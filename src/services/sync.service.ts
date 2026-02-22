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
const DATE_FIELDS = new Set(["date", "createdAt", "updatedAt"]);

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
      const found = result.rows.length;
      console.log(
        `[Sync] 🔍 Tables found in Turso: ${found}/${tableNames.length}`,
      );
      return found === tableNames.length;
    } catch (err) {
      console.warn("[Sync] ⚠️ Could not verify Turso tables:", err);
      return false;
    }
  }

  private static async ensureReady(): Promise<void> {
    const migrated = await AsyncStorage.getItem(TURSO_MIGRATED_KEY);

    if (migrated === "true") {
      const exists = await this.allTablesExist();
      if (exists) {
        console.log("[Sync] ✅ Turso tables verified — skipping migration");
        return;
      }
      console.warn(
        "[Sync] ⚠️ Migration flag set but tables missing — re-migrating...",
      );
      await AsyncStorage.removeItem(TURSO_MIGRATED_KEY);
    }

    try {
      console.log("[Sync] 🚀 Running Turso migrations...");
      await migrateTurso();
      await AsyncStorage.setItem(TURSO_MIGRATED_KEY, "true");
      console.log("[Sync] ✅ Turso tables ready");
    } catch (err) {
      console.error("[Sync] ❌ Migration failed:", err);
      throw err;
    }
  }

  static async getLastSyncTime(): Promise<string | null> {
    return await AsyncStorage.getItem(LAST_SYNC_KEY);
  }

  static async getLocalDataSummary(userId: string): Promise<number> {
    const results = await Promise.all(
      TABLE_MAP.map(({ table, userCol }) =>
        db.select().from(table).where(eq(userCol, userId)),
      ),
    );
    return results.reduce((sum, rows) => sum + rows.length, 0);
  }

  static async performSync(): Promise<void> {
    const { auth } = await import("../config/firebase");
    const user = auth.currentUser;
    if (user) {
      await this.smartSync(user.uid);
    } else {
      console.log("[Sync] No user logged in, skipping.");
    }
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
        const localRows: any[] = localData[key] || [];
        const tursoRows: any[] = tursoData[key] || [];

        try {
          if (localRows.length === 0 && tursoRows.length > 0) {
            console.log(
              `[Sync] 📥 Restoring ${key} (${tursoRows.length} rows) from Turso`,
            );
            const cleanRows = tursoRows.map((r) => this.toLocalRow(r));
            await db
              .insert(table)
              .values(cleanRows as any)
              .onConflictDoNothing();
            didRestore = true;
          } else if (localRows.length > 0) {
            console.log(
              `[Sync] 📤 Pushing ${key} (${localRows.length} rows) to Turso`,
            );
            const tursoRows = localRows.map((r) => this.toTursoRow(r));

            await tursoDb.transaction(async (tx) => {
              await tx.delete(table).where(eq(userCol, userId));
              for (let i = 0; i < tursoRows.length; i += 100) {
                await tx
                  .insert(table)
                  .values(tursoRows.slice(i, i + 100) as any);
              }
            });
          } else {
            console.log(`[Sync] ⏭️ ${key} — both empty, skipping`);
          }
        } catch (tableErr) {
          console.error(`[Sync] ❌ Failed to sync table ${key}:`, tableErr);
        }
      }

      await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      console.log("[Sync] ✅ Smart sync complete at", new Date().toISOString());
      return didRestore;
    } catch (err) {
      console.error("[Sync] ❌ Smart sync failed:", err);
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
      } catch (err) {
        console.warn(`[Sync] ⚠️ Table "${key}" fetch failed:`, err);
        data[key] = [];
      }
    }
    return data;
  }

  private static toLocalRow(row: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(row).map(([k, v]) => [
        k,
        DATE_FIELDS.has(k) && v != null ? new Date(v) : v,
      ]),
    );
  }

  private static toTursoRow(row: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(row).map(([k, v]) => [
        k,
        DATE_FIELDS.has(k) && v instanceof Date ? v.toISOString() : v,
      ]),
    );
  }
}
