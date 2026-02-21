import { and, between, desc, eq } from "drizzle-orm";
import { db } from "../db/client";
import { dailyEntries, DailyEntry, NewDailyEntry } from "../db/schema";
import { BucketType, CategoryLabel } from "../types/finance";

export class DailyEntriesRepository {
  static async create(
    entry: NewDailyEntry,
    userId: string,
  ): Promise<DailyEntry> {
    const [created] = await db
      .insert(dailyEntries)
      .values({ ...entry, userId })
      .returning();
    return created;
  }

  static async getAll(userId: string): Promise<DailyEntry[]> {
    return await db
      .select()
      .from(dailyEntries)
      .where(eq(dailyEntries.userId, userId))
      .orderBy(desc(dailyEntries.date));
  }

  static async getById(
    id: number,
    userId: string,
  ): Promise<DailyEntry | undefined> {
    const [entry] = await db
      .select()
      .from(dailyEntries)
      .where(and(eq(dailyEntries.id, id), eq(dailyEntries.userId, userId)))
      .limit(1);
    return entry;
  }

  static async getByDateRange(
    startDate: Date,
    endDate: Date,
    userId: string,
  ): Promise<DailyEntry[]> {
    return await db
      .select()
      .from(dailyEntries)
      .where(
        and(
          between(dailyEntries.date, startDate, endDate),
          eq(dailyEntries.userId, userId),
        ),
      )
      .orderBy(desc(dailyEntries.date));
  }

  static async getByMonth(
    month: string,
    userId: string,
  ): Promise<DailyEntry[]> {
    const [year, monthNum] = month.split("-").map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);

    return this.getByDateRange(startDate, endDate, userId);
  }

  static async update(
    id: number,
    data: Partial<NewDailyEntry>,
    userId: string,
  ): Promise<DailyEntry> {
    const [updated] = await db
      .update(dailyEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(dailyEntries.id, id), eq(dailyEntries.userId, userId)))
      .returning();

    if (!updated) {
      throw new Error(`Entry with id ${id} not found or unauthorized`);
    }

    return updated;
  }

  static async delete(id: number, userId: string): Promise<void> {
    const result = await db
      .delete(dailyEntries)
      .where(and(eq(dailyEntries.id, id), eq(dailyEntries.userId, userId)))
      .returning();

    if (result.length === 0) {
      throw new Error(`Entry with id ${id} not found or unauthorized`);
    }
  }

  static async getByCategory(
    category: CategoryLabel,
    userId: string,
  ): Promise<DailyEntry[]> {
    return await db
      .select()
      .from(dailyEntries)
      .where(
        and(
          eq(dailyEntries.category, category),
          eq(dailyEntries.userId, userId),
        ),
      )
      .orderBy(desc(dailyEntries.date));
  }

  static async getByBucket(
    bucket: BucketType,
    userId: string,
  ): Promise<DailyEntry[]> {
    return await db
      .select()
      .from(dailyEntries)
      .where(
        and(eq(dailyEntries.bucket, bucket), eq(dailyEntries.userId, userId)),
      )
      .orderBy(desc(dailyEntries.date));
  }
}
