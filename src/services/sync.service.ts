import { db } from "../db/client";
import { tursoDb, tursoClient, migrateTurso } from "../config/turso_client";
import {
  dailyEntries,
  monthlyIncomes,
  digitalAssets,
  equityAssets,
} from "../db/schema";
import { eq } from "drizzle-orm";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_SYNC_KEY = "last_sync_timestamp";
const TURSO_MIGRATED_KEY = "turso_migrated";

/**
 * All timestamp/date column names from your schema.
 * These are stored as Unix seconds (INTEGER) in SQLite.
 */
const DATE_FIELDS = new Set(["date", "createdAt", "updatedAt", "timestamp"]);

// Safe limit for Turso transactions
const TURSO_BATCH_SIZE = 25;
const STAGING_MARKER = "__staging__";

const TABLE_MAP = [
  {
    key: "dailyEntries",
    table: dailyEntries,
    userCol: dailyEntries.userId,
    sqlName: "daily_entries",
  },
  {
    key: "monthlyIncomes",
    table: monthlyIncomes,
    userCol: monthlyIncomes.userId,
    sqlName: "monthly_incomes",
  },
  {
    key: "digitalAssets",
    table: digitalAssets,
    userCol: digitalAssets.userId,
    sqlName: "digital_assets",
  },
  {
    key: "equityAssets",
    table: equityAssets,
    userCol: equityAssets.userId,
    sqlName: "equity_assets",
  },
] as const;

type SnapshotData = Record<string, any[]>;

export class SyncService {
  private static async allTablesExist(): Promise<boolean> {
    try {
      const tableNames = TABLE_MAP.map((t) => t.sqlName);
      const placeholders = tableNames.map(() => "?").join(", ");
      const result = await tursoClient.execute({
        sql: `SELECT name FROM sqlite_master WHERE type='table' AND name IN (${placeholders})`,
        args: tableNames,
      });
      return result.rows.length === tableNames.length;
    } catch {
      return false;
    }
  }

  private static async ensureReady(): Promise<void> {
    const migrated = await AsyncStorage.getItem(TURSO_MIGRATED_KEY);
    if (migrated === "true" && (await this.allTablesExist())) return;

    try {
      await migrateTurso();
      await AsyncStorage.setItem(TURSO_MIGRATED_KEY, "true");
    } catch (err) {
      console.error("[Sync] Migration failed:", err);
      throw err;
    }
  }

  static async performSync(): Promise<void> {
    const { auth } = await import("../config/firebase");
    const user = auth.currentUser;
    if (user) await this.smartSync(user.uid);
  }

  static async smartSync(userId: string): Promise<boolean> {
    try {
      await this.ensureReady();
      const [localData, tursoData] = await Promise.all([
        this.fetchLocalData(userId),
        this.fetchFromTurso(userId),
      ]);

      let didRestore = false;

      for (const { key, table, userCol } of TABLE_MAP) {
        const localRows = localData[key] || [];
        const cloudRows = tursoData[key] || [];

        try {
          if (localRows.length === 0 && cloudRows.length > 0) {
            // --- RESTORE: Cloud to Local ---
            const cleanRows = cloudRows.map((r) => this.toLocalRow(r));
            for (let i = 0; i < cleanRows.length; i += 50) {
              await db
                .insert(table)
                .values(cleanRows.slice(i, i + 50) as any)
                .onConflictDoNothing();
            }
            didRestore = true;

          } else if (localRows.length > 0) {
            // --- PUSH: Local to Cloud (Two-phase atomic upload) ---
            const stagingUserId = `${userId}${STAGING_MARKER}`;

            // Convert all rows for Turso — dates become proper Date objects,
            // id is stripped so Turso auto-increments (no UNIQUE conflicts).
            const rowsToUpload = localRows.map((r) => {
              const tursoRow = this.toTursoRow(r);
              const { id, ...rowWithoutId } = tursoRow; // strip id — let Turso AUTOINCREMENT
              return { ...rowWithoutId, userId: stagingUserId };
            });

            // Clear any leftover staging rows from a previous failed sync
            await tursoDb.delete(table).where(eq(userCol, stagingUserId));

            // Phase 1: Upload all rows to staging in safe batches
            let allBatchesSucceeded = true;
            let uploadedCount = 0;

            for (let i = 0; i < rowsToUpload.length; i += TURSO_BATCH_SIZE) {
              const chunk = rowsToUpload.slice(i, i + TURSO_BATCH_SIZE);
              try {
                await tursoDb.insert(table).values(chunk as any);
                uploadedCount += chunk.length;
                console.log(
                  `[Sync] 📦 ${key}: staged ${uploadedCount}/${rowsToUpload.length} rows`,
                );
              } catch (batchErr) {
                allBatchesSucceeded = false;
                console.error(
                  `[Sync] ❌ ${key}: batch [${i}–${i + chunk.length - 1}] failed:`,
                  batchErr,
                );
                break;
              }
            }

            if (!allBatchesSucceeded) {
              await tursoDb.delete(table).where(eq(userCol, stagingUserId));
              console.error(
                `[Sync] ❌ ${key}: staging incomplete — live data untouched. Will retry next sync.`,
              );
              continue;
            }

            // Phase 2: Verify row count in staging matches what we sent
            const staged = await tursoDb
              .select()
              .from(table)
              .where(eq(userCol, stagingUserId));

            if (staged.length !== rowsToUpload.length) {
              await tursoDb.delete(table).where(eq(userCol, stagingUserId));
              console.error(
                `[Sync] ❌ ${key}: count mismatch — expected ${rowsToUpload.length}, ` +
                  `got ${staged.length}. Live data untouched. Will retry next sync.`,
              );
              continue;
            }

            console.log(
              `[Sync] ✅ ${key}: all ${rowsToUpload.length} rows staged and verified`,
            );

            // Phase 3: Atomic swap — delete live rows, promote staging to live
            await tursoDb.delete(table).where(eq(userCol, userId));

            for (let i = 0; i < staged.length; i += TURSO_BATCH_SIZE) {
              const chunk = staged
                .slice(i, i + TURSO_BATCH_SIZE)
                .map((r: any) => {
                  const { id, ...rowWithoutId } = r;
                  return { ...rowWithoutId, userId };
                });
              await tursoDb.insert(table).values(chunk as any);
            }

            await tursoDb.delete(table).where(eq(userCol, stagingUserId));

            console.log(
              `[Sync] ✅ ${key}: ${staged.length} rows live in cloud`,
            );
          }
        } catch (tableErr) {
          console.error(`[Sync] ❌ Table ${key} failed:`, tableErr);
        }
      }

      await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      return didRestore;
    } catch (err) {
      console.error("[Sync] ❌ Sync failed:", err);
      throw err;
    }
  }

  private static async fetchLocalData(userId: string): Promise<SnapshotData> {
    const results = await Promise.all(
      TABLE_MAP.map(({ table, userCol }) =>
        db.select().from(table).where(eq(userCol, userId)),
      ),
    );
    return Object.fromEntries(TABLE_MAP.map(({ key }, i) => [key, results[i]]));
  }

  private static async fetchFromTurso(userId: string): Promise<SnapshotData> {
    const data: SnapshotData = {};
    for (const { key, table, userCol } of TABLE_MAP) {
      try {
        data[key] = await tursoDb
          .select()
          .from(table)
          .where(eq(userCol, userId));
      } catch {
        data[key] = [];
      }
    }
    return data;
  }

  /**
   * Converts a local SQLite row for insertion into Turso.
   *
   * CRITICAL: Local SQLite stores timestamps as Unix seconds (INTEGER).
   * e.g. 1767225600 = a date in seconds, NOT milliseconds.
   *
   * Drizzle's LibSQL (Turso) driver calls .getTime() on date columns,
   * so they MUST be proper Date objects.
   *
   * Conversion rules:
   *   number < 10_000_000_000  → Unix seconds  → multiply × 1000 → Date
   *   number >= 10_000_000_000 → Unix ms        → Date directly
   *   string                   → ISO string     → new Date(v)
   *   Date                     → pass through
   *   null / undefined         → pass through (nullable)
   */
  private static toTursoRow(row: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(row).map(([k, v]) => {
        if (!DATE_FIELDS.has(k) || v == null) return [k, v];
        if (v instanceof Date) return [k, v];
        if (typeof v === "number") {
          // Unix seconds if below year 2001 in ms threshold
          const ms = v < 10_000_000_000 ? v * 1000 : v;
          const d = new Date(ms);
          return [k, isNaN(d.getTime()) ? null : d];
        }
        if (typeof v === "string") {
          const d = new Date(v);
          return [k, isNaN(d.getTime()) ? null : d];
        }
        console.warn(`[Sync] ⚠️ Unexpected type for date field "${k}":`, typeof v);
        return [k, null];
      }),
    );
  }

  /**
   * Converts a Turso row for insertion into local SQLite.
   *
   * Expo SQLite / drizzle-orm local driver expects Date objects for
   * timestamp columns (it serializes them to Unix seconds internally).
   */
  private static toLocalRow(row: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(row).map(([k, v]) => {
        if (!DATE_FIELDS.has(k) || v == null) return [k, v];
        if (v instanceof Date) return [k, v];
        if (typeof v === "number") {
          const ms = v < 10_000_000_000 ? v * 1000 : v;
          const d = new Date(ms);
          return [k, isNaN(d.getTime()) ? null : d];
        }
        if (typeof v === "string") {
          const d = new Date(v);
          return [k, isNaN(d.getTime()) ? null : d];
        }
        return [k, null];
      }),
    );
  }
}