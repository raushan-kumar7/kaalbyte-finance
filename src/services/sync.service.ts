import { db } from "../db/client";
import { tursoDb, migrateTurso } from "../config/turso_client";
import {
  dailyEntries,
  monthlyIncomes,
  digitalAssets,
  equityAssets,
} from "../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_SYNC_KEY = "last_sync_timestamp";
const TURSO_MIGRATED_KEY = "turso_migrated";
const DATE_FIELDS = new Set(["date", "createdAt", "updatedAt"]);

const TABLE_MAP = [
  { key: "dailyEntries", table: dailyEntries, userCol: dailyEntries.userId },
  {
    key: "monthlyIncomes",
    table: monthlyIncomes,
    userCol: monthlyIncomes.userId,
  },
  { key: "digitalAssets", table: digitalAssets, userCol: digitalAssets.userId },
  { key: "equityAssets", table: equityAssets, userCol: equityAssets.userId },
] as const;

type SnapshotData = Record<string, Record<string, any>[]>;

export class SyncService {
  private static async ensureReady(): Promise<void> {
    const migrated = await AsyncStorage.getItem(TURSO_MIGRATED_KEY);
    if (migrated) return;

    await migrateTurso();
    await AsyncStorage.setItem(TURSO_MIGRATED_KEY, "true");
  }

  static async performSync(): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await this.ensureReady();

      const data = await this.fetchLocalData(user.uid);
      await this.upsertToTurso(user.uid, data);

      await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      console.log(
        "[Sync] ✅ Turso Sync Completed at",
        new Date().toISOString(),
      );
    } catch (err) {
      console.error("[Sync] ❌ Failed:", err);
      throw err;
    }
  }

  static async restoreFromCloud(userId: string): Promise<boolean> {
    try {
      await this.ensureReady();

      const data = await this.fetchFromTurso(userId);

      // If all tables are empty, no backup exists yet
      const hasData = TABLE_MAP.some((t) => (data[t.key]?.length ?? 0) > 0);
      if (!hasData) {
        console.log("[Sync] No Turso backup found — first install");
        return false;
      }

      await this.writeToLocalSQLite(data, userId);

      console.log("[Sync] ✅ Restored from Turso backup");
      return true;
    } catch (err) {
      console.error("[Sync] ❌ Restore failed:", err);
      return false;
    }
  }

  static async getLastSyncTime(): Promise<string | null> {
    return AsyncStorage.getItem(LAST_SYNC_KEY);
  }

  private static async fetchLocalData(userId: string): Promise<SnapshotData> {
    const results = await Promise.all(
      TABLE_MAP.map(({ table, userCol }) =>
        db.select().from(table).where(eq(userCol, userId)),
      ),
    );

    return Object.fromEntries(
      TABLE_MAP.map(({ key }, i) => [key, results[i].map(this.serialize)]),
    );
  }

  private static async upsertToTurso(
    userId: string,
    data: SnapshotData,
  ): Promise<void> {
    await Promise.all(
      TABLE_MAP.map(({ table, userCol }) =>
        tursoDb.delete(table).where(eq(userCol, userId)),
      ),
    );

    // 3. Perform the insert
    await Promise.all(
      TABLE_MAP.map(async ({ key, table }) => {
        const rows = data[key];
        if (rows && rows.length > 0) {
          // We use deserialize to turn ISO strings back into Date objects for Drizzle
          const formattedRows = rows.map((r) => this.deserialize(r));

          await tursoDb.insert(table).values(formattedRows as any[]);

          // console.log(`[Sync] ✅ Uploaded ${rows.length} rows to ${key}`);
        }
      }),
    );
  }

  private static async fetchFromTurso(userId: string): Promise<SnapshotData> {
    const results = await Promise.all(
      TABLE_MAP.map(({ table, userCol }) =>
        tursoDb.select().from(table).where(eq(userCol, userId)),
      ),
    );

    return Object.fromEntries(
      TABLE_MAP.map(({ key }, i) => [key, results[i].map(this.serialize)]),
    );
  }

  private static async writeToLocalSQLite(
    data: SnapshotData,
    userId: string,
  ): Promise<void> {
    // Clear existing local rows for this user
    await Promise.all(
      TABLE_MAP.map(({ table, userCol }) =>
        db.delete(table).where(eq(userCol, userId)),
      ),
    );

    // Re-insert from Turso snapshot
    await Promise.all(
      TABLE_MAP.map(async ({ key, table }) => {
        const rows = data[key];
        if (rows && Array.isArray(rows) && rows.length > 0) {
          const clean = rows.filter((r) => r != null && typeof r === "object");
          if (clean.length > 0) {
            await db.insert(table).values(clean.map(this.deserialize) as any[]);
          }
        }
      }),
    );
  }

  private static serialize(row: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(row).map(([k, v]) => [
        k,
        v instanceof Date ? v.toISOString() : v,
      ]),
    );
  }

  private static deserialize(row: Record<string, any>): Record<string, any> {
    if (!row || typeof row !== "object") return {};

    return Object.fromEntries(
      Object.entries(row).map(([k, v]) => [
        k,
        DATE_FIELDS.has(k) && typeof v === "string" ? new Date(v) : v,
      ]),
    );
  }
}
