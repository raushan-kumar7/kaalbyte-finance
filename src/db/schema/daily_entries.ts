import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { BucketType } from "@/src/types/finance";
import { timestamps } from "./timestamps";

export const dailyEntries = sqliteTable("daily_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  bucket: text("bucket").$type<BucketType>().notNull(),
  ...timestamps(),
});

export type DailyEntry = typeof dailyEntries.$inferSelect;
export type NewDailyEntry = typeof dailyEntries.$inferInsert;
