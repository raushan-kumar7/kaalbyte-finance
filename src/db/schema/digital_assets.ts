import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { DigitalGoldOrSilverAssetType } from "@/src/types/finance";
import { timestamps } from "./timestamps";

export const digitalAssets = sqliteTable("digital_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  type: text("type").$type<DigitalGoldOrSilverAssetType>().notNull(),
  platform: text("platform").notNull(),
  ratePerGram: real("rate_per_gram").notNull(),
  amountPaid: real("amount_paid").notNull(),
  gst3Percent: real("gst_3_percent").default(0).notNull(),
  weightG: real("weight_g").notNull(),
  assetValue: real("asset_value").notNull(),
  ...timestamps(),
});

export type DigitalAssets = typeof digitalAssets.$inferSelect;
export type NewDigitalAssets = typeof digitalAssets.$inferInsert;
