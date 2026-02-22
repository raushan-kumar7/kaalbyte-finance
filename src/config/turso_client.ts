import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql/web";
import * as schema from "@/src/db/schema";
import { APP_CONFIG } from "./app_cfg";
import migrations from "@/drizzle/migrations";

export const tursoClient = createClient({
  url: APP_CONFIG.turso.url,
  authToken: APP_CONFIG.turso.authToken,
});

export const tursoDb = drizzle(tursoClient, { schema });

export async function migrateTurso(): Promise<void> {
  try {
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS __drizzle_migrations (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        hash       TEXT    NOT NULL UNIQUE,
        created_at INTEGER
      )
    `);

    const result = await tursoClient.execute(
      `SELECT hash FROM __drizzle_migrations`,
    );
    const appliedHashes = new Set(result.rows.map((r) => r.hash as string));

    for (const entry of migrations.journal.entries) {
      const tag = entry.tag;
      if (appliedHashes.has(tag)) continue;

      const key =
        `m${String(entry.idx).padStart(4, "0")}` as keyof typeof migrations.migrations;
      const migrationSql = migrations.migrations[key] as string | undefined;

      if (!migrationSql) {
        console.warn(`[Turso] ⚠ No SQL found for migration: ${tag}`);
        continue;
      }

      const statements = migrationSql
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        await tursoClient.execute(statement);
      }

      await tursoClient.execute({
        sql: `INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)`,
        args: [tag, Date.now()],
      });

      console.log(`[Turso] ✅ Applied migration: ${tag}`);
    }

    console.log("[Turso] ✅ All migrations applied");
  } catch (err) {
    console.error("[Turso] ❌ Migration failed:", err);
    throw err;
  }
}
