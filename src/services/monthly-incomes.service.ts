import { MonthlyIncome, NewMonthlyIncome } from "../db/schema";
import { MonthlyIncomesRepository } from "../repositories";
import { monthlyIncomeSchema } from "../validations/finance";

export class MonthlyIncomesService {
  static async createIncome(
    data: NewMonthlyIncome,
    userId: string,
  ): Promise<MonthlyIncome> {
    const totalIncome = (data.salary || 0) + (data.otherIncome || 0);
    const incomeData = { ...data, totalIncome };

    await monthlyIncomeSchema.validate({ ...incomeData, userId });

    return await MonthlyIncomesRepository.create(incomeData, userId);
  }

  static async getAllIncomes(userId: string): Promise<MonthlyIncome[]> {
    return await MonthlyIncomesRepository.getAll(userId);
  }

  static async getIncomeById(
    id: number,
    userId: string,
  ): Promise<MonthlyIncome | undefined> {
    return await MonthlyIncomesRepository.getById(id, userId);
  }

  static async getIncomeByMonth(
    month: string,
    userId: string,
  ): Promise<MonthlyIncome | undefined> {
    return await MonthlyIncomesRepository.getByMonth(month, userId);
  }

  static async updateIncome(
    id: number,
    data: Partial<NewMonthlyIncome>,
    userId: string,
  ): Promise<MonthlyIncome> {
    const existing = await MonthlyIncomesRepository.getById(id, userId);
    if (!existing) {
      throw new Error(`Income record with id ${id} not found or unauthorized`);
    }

    const salary = data.salary !== undefined ? data.salary : existing.salary;
    const otherIncome =
      data.otherIncome !== undefined ? data.otherIncome : existing.otherIncome;
    const totalIncome = salary + otherIncome;

    const updateData = { ...data, totalIncome };

    await monthlyIncomeSchema.validate({ ...existing, ...updateData, userId });

    return await MonthlyIncomesRepository.update(id, updateData, userId);
  }

  static async deleteIncome(id: number, userId: string): Promise<void> {
    const existing = await MonthlyIncomesRepository.getById(id, userId);
    if (!existing) {
      throw new Error(`Income record with id ${id} not found or unauthorized`);
    }

    await MonthlyIncomesRepository.delete(id, userId);
  }

  static async upsertIncome(
    month: string,
    data: NewMonthlyIncome,
    userId: string,
  ): Promise<MonthlyIncome> {
    const totalIncome = (data.salary || 0) + (data.otherIncome || 0);
    const incomeData = { ...data, month, totalIncome };

    await monthlyIncomeSchema.validate({ ...incomeData, userId });

    return await MonthlyIncomesRepository.upsertByMonth(
      month,
      incomeData,
      userId,
    );
  }

  static async getYearlyIncome(year: number, userId: string): Promise<number> {
    const allIncomes = await MonthlyIncomesRepository.getAll(userId);
    const yearIncomes = allIncomes.filter((income) =>
      income.month.startsWith(year.toString()),
    );

    return yearIncomes.reduce((sum, income) => sum + income.totalIncome, 0);
  }

  static async getAverageMonthlyIncome(userId: string): Promise<number> {
    const allIncomes = await MonthlyIncomesRepository.getAll(userId);

    if (allIncomes.length === 0) return 0;

    const total = allIncomes.reduce(
      (sum, income) => sum + income.totalIncome,
      0,
    );
    return total / allIncomes.length;
  }

  static async getIncomeBreakdown(
    month: string,
    userId: string,
  ): Promise<{
    salary: number;
    otherIncome: number;
    total: number;
    salaryPercentage: number;
    otherIncomePercentage: number;
  } | null> {
    const income = await this.getIncomeByMonth(month, userId);

    if (!income) return null;

    return {
      salary: income.salary,
      otherIncome: income.otherIncome,
      total: income.totalIncome,
      salaryPercentage: (income.salary / income.totalIncome) * 100,
      otherIncomePercentage: (income.otherIncome / income.totalIncome) * 100,
    };
  }

  static async getIncomeTrend(
    months: number = 6,
    userId: string,
  ): Promise<MonthlyIncome[]> {
    const allIncomes = await MonthlyIncomesRepository.getAll(userId);
    return allIncomes.slice(0, months);
  }
}
