import { desc, eq, and } from "drizzle-orm";
import { db } from "../db/client";
import { MonthlyIncome, monthlyIncomes, NewMonthlyIncome } from "../db/schema";

export class MonthlyIncomesRepository {
  static async create(
    income: NewMonthlyIncome,
    userId: string,
  ): Promise<MonthlyIncome> {
    const [created] = await db
      .insert(monthlyIncomes)
      .values({ ...income, userId })
      .returning();
    return created;
  }

  static async getAll(userId: string): Promise<MonthlyIncome[]> {
    return await db
      .select()
      .from(monthlyIncomes)
      .where(eq(monthlyIncomes.userId, userId))
      .orderBy(desc(monthlyIncomes.month));
  }

  static async getById(
    id: number,
    userId: string,
  ): Promise<MonthlyIncome | undefined> {
    const [income] = await db
      .select()
      .from(monthlyIncomes)
      .where(and(eq(monthlyIncomes.id, id), eq(monthlyIncomes.userId, userId)))
      .limit(1);
    return income;
  }

  static async getByMonth(
    month: string,
    userId: string,
  ): Promise<MonthlyIncome | undefined> {
    const [income] = await db
      .select()
      .from(monthlyIncomes)
      .where(
        and(eq(monthlyIncomes.month, month), eq(monthlyIncomes.userId, userId)),
      )
      .limit(1);
    return income;
  }

  static async update(
    id: number,
    data: Partial<NewMonthlyIncome>,
    userId: string,
  ): Promise<MonthlyIncome> {
    const [updated] = await db
      .update(monthlyIncomes)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(monthlyIncomes.id, id), eq(monthlyIncomes.userId, userId)))
      .returning();

    if (!updated) {
      throw new Error(`Income with id ${id} not found or unauthorized`);
    }

    return updated;
  }

  static async delete(id: number, userId: string): Promise<void> {
    const result = await db
      .delete(monthlyIncomes)
      .where(and(eq(monthlyIncomes.id, id), eq(monthlyIncomes.userId, userId)))
      .returning();

    if (result.length === 0) {
      throw new Error(`Income with id ${id} not found or unauthorized`);
    }
  }

  static async upsertByMonth(
    month: string,
    data: NewMonthlyIncome,
    userId: string,
  ): Promise<MonthlyIncome> {
    const existing = await this.getByMonth(month, userId);

    if (existing) {
      return this.update(existing.id, data, userId);
    }

    return this.create(data, userId);
  }
}
