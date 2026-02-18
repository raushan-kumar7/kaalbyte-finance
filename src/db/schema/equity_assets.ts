import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "./timestamps";
import { Exchange } from "@/src/types/finance";

export const equityAssets = sqliteTable("equity_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  company: text("company").notNull(),
  exchange: text("exchange").$type<Exchange>().notNull(),
  pricePerShare: real("price_per_share").notNull(),
  totalShares: integer("total_shares").notNull(),
  totalAmount: real("total_amount").notNull(),
  ...timestamps(),
});

export type EquityAssets = typeof equityAssets.$inferSelect;
export type NewEquityAssets = typeof equityAssets.$inferInsert;
