import { DailyEntry, NewDailyEntry } from "../db/schema";
import { DailyEntriesRepository } from "../repositories";
import {
  BucketType,
  CategoryLabel,
  MonthlyExpenseTracker,
} from "../types/finance";
import { dailyEntryServiceSchema } from "../validations/finance";

export class DailyEntriesService {
  static async createEntry(
    data: NewDailyEntry,
    userId: string,
  ): Promise<DailyEntry> {
    await dailyEntryServiceSchema.validate({ ...data, userId });
    return await DailyEntriesRepository.create(data, userId);
  }

  static async getAllEntries(userId: string): Promise<DailyEntry[]> {
    return await DailyEntriesRepository.getAll(userId);
  }

  static async getEntryById(
    id: number,
    userId: string,
  ): Promise<DailyEntry | undefined> {
    return await DailyEntriesRepository.getById(id, userId);
  }

  static async updateEntry(
    id: number,
    data: Partial<NewDailyEntry>,
    userId: string,
  ): Promise<DailyEntry> {
    const existing = await DailyEntriesRepository.getById(id, userId);
    if (!existing) {
      throw new Error(`Entry with id ${id} not found or unauthorized`);
    }

    await dailyEntryServiceSchema.validate({ ...existing, ...data, userId });

    return await DailyEntriesRepository.update(id, data, userId);
  }

  static async deleteEntry(id: number, userId: string): Promise<void> {
    const existing = await DailyEntriesRepository.getById(id, userId);
    if (!existing) {
      throw new Error(`Entry with id ${id} not found or unauthorized`);
    }

    await DailyEntriesRepository.delete(id, userId);
  }

  static async getEntriesByMonth(
    month: string,
    userId: string,
  ): Promise<DailyEntry[]> {
    return await DailyEntriesRepository.getByMonth(month, userId);
  }

  static async getMonthlyExpenseSummary(
    month: string,
    userId: string,
  ): Promise<MonthlyExpenseTracker> {
    const entries = await this.getEntriesByMonth(month, userId);

    const categoryTotals: Partial<Record<string, number>> = {};
    const bucketTotals: Record<BucketType, number> = {
      [BucketType.NEEDS]: 0,
      [BucketType.WANTS]: 0,
      [BucketType.SAVINGS]: 0,
    };

    let grandTotal = 0;

    entries.forEach((entry) => {
      categoryTotals[entry.category] =
        (categoryTotals[entry.category] || 0) + entry.amount;
      bucketTotals[entry.bucket as BucketType] += entry.amount;
      grandTotal += entry.amount;
    });

    const [year, monthNum] = month.split("-").map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0);
    const monthRange = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

    return {
      month,
      month_range: monthRange,
      categoryTotals,
      bucketTotals,
      grandTotal,
    };
  }

  static async getSpendingByCategory(
    category: CategoryLabel,
    userId: string,
  ): Promise<number> {
    const entries = await DailyEntriesRepository.getByCategory(
      category,
      userId,
    );
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  }

  static async getSpendingByBucket(
    bucket: BucketType,
    userId: string,
  ): Promise<number> {
    const entries = await DailyEntriesRepository.getByBucket(bucket, userId);
    return entries.reduce((sum, entry) => sum + entry.amount, 0);
  }

  static async getEntriesByDateRange(
    startDate: Date,
    endDate: Date,
    userId: string,
  ): Promise<DailyEntry[]> {
    return await DailyEntriesRepository.getByDateRange(
      startDate,
      endDate,
      userId,
    );
  }

  static async getAverageDailySpending(
    month: string,
    userId: string,
  ): Promise<number> {
    const entries = await this.getEntriesByMonth(month, userId);

    if (entries.length === 0) return 0;

    const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const [year, monthNum] = month.split("-").map(Number);
    const daysInMonth = new Date(year, monthNum, 0).getDate();

    return total / daysInMonth;
  }

  static async getBucketAllocation(
    month: string,
    userId: string,
  ): Promise<Record<BucketType, number>> {
    const summary = await this.getMonthlyExpenseSummary(month, userId);

    if (summary.grandTotal === 0) {
      return {
        [BucketType.NEEDS]: 0,
        [BucketType.WANTS]: 0,
        [BucketType.SAVINGS]: 0,
      };
    }

    return {
      [BucketType.NEEDS]:
        (summary.bucketTotals[BucketType.NEEDS] / summary.grandTotal) * 100,
      [BucketType.WANTS]:
        (summary.bucketTotals[BucketType.WANTS] / summary.grandTotal) * 100,
      [BucketType.SAVINGS]:
        (summary.bucketTotals[BucketType.SAVINGS] / summary.grandTotal) * 100,
    };
  }
}
