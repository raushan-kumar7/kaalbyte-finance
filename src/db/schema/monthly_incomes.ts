import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamps } from "./timestamps";

export const monthlyIncomes = sqliteTable("monthly_incomes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  month: text("month").notNull(),
  salary: real("salary").default(0).notNull(),
  otherIncome: real("other_income").default(0).notNull(),
  totalIncome: real("total_income").notNull(),
  ...timestamps(),
});

export type MonthlyIncome = typeof monthlyIncomes.$inferSelect;
export type NewMonthlyIncome = typeof monthlyIncomes.$inferInsert;
