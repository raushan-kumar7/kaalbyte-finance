import {
  DailyEntry,
  MonthlyIncome,
  DigitalGoldOrSilverAssets,
  EquityAssets,
} from "../types/finance";

export const calculateAssetStats = (
  gold: DigitalGoldOrSilverAssets[],
  equity: EquityAssets[],
) => {
  const goldVal = gold.reduce((acc, curr) => acc + (curr.gold_value || 0), 0);
  const silverVal = gold.reduce(
    (acc, curr) =>
      curr.type === "silver" ? acc + (curr.gold_value || 0) : acc,
    0,
  ); // Using the same interface
  const equityVal = equity.reduce(
    (acc, curr) => acc + (curr.total_amount || 0),
    0,
  );

  return {
    totalAssets: goldVal + equityVal,
    gold: goldVal - silverVal,
    silver: silverVal,
    equity: equityVal,
  };
};

export const calculateMonthlyStats = (
  monthStr: string,
  entries: DailyEntry[],
  incomes: MonthlyIncome[],
) => {
  const income = incomes.find((i) => i.month === monthStr)?.total_income || 0;
  const expenses = entries
    .filter((e) => e.date.toISOString().startsWith(monthStr))
    .reduce((acc, curr) => acc + curr.amount, 0);

  return {
    month: monthStr,
    salary: income,
    expenses,
    remaining: income - expenses,
  };
};
