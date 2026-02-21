export enum Exchange {
  NSE = "nse",
  BSE = "bse",
}

export enum BucketType {
  NEEDS = "needs",
  WANTS = "wants",
  SAVINGS = "savings",
}

export enum DigitalGoldOrSilverAssetType {
  GOLD = "gold",
  SILVER = "silver",
}

export const CATEGORIES = {
  pg_rent: {
    label: "pg rent",
    bucket: BucketType.NEEDS,
  },
  foods: {
    label: "foods",
    bucket: BucketType.NEEDS,
  },
  tea_snacks: {
    label: "tea & snacks",
    bucket: BucketType.WANTS,
  },
  medicine: {
    label: "medicine",
    bucket: BucketType.NEEDS,
  },
  recharge: {
    label: "mobile recharge",
    bucket: BucketType.NEEDS,
  },
  bills_other: {
    label: "other bills",
    bucket: BucketType.NEEDS,
  },
  travel: {
    label: "travel",
    bucket: BucketType.WANTS,
  },
  clothes: {
    label: "clothes",
    bucket: BucketType.WANTS,
  },
  misc_other: {
    label: "misc other",
    bucket: BucketType.WANTS,
  },
  gold: {
    label: "gold investment",
    bucket: BucketType.SAVINGS,
  },
  silver: {
    label: "silver investment",
    bucket: BucketType.SAVINGS,
  },
  sip: {
    label: "sip / mutual funds",
    bucket: BucketType.SAVINGS,
  },
  emr_fund: {
    label: "emergency fund",
    bucket: BucketType.SAVINGS,
  },
  snd_home: {
    label: "send home",
    bucket: BucketType.NEEDS,
  },
  others: {
    label: "general others",
    bucket: BucketType.WANTS,
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export type CategoryLabel = (typeof CATEGORIES)[CategoryKey]["label"];

export interface DailyEntry {
  id: number;
  userId: string;
  date: Date;
  category: CategoryLabel;
  description: string;
  amount: number;
  bucket: BucketType;
}

export interface MonthlyIncome {
  id: number;
  userId: string;
  month: string;
  salary: number;
  other_income: number;
  total_income: number;
}

export interface DigitalGoldOrSilverAssets {
  id: number;
  userId: string;
  date: Date;
  type: DigitalGoldOrSilverAssetType;
  platform: string;
  rate_per_gram: number;
  amount_paid: number;
  gst_3_percent: number;
  weight_g: number;
  gold_value: number;
}

export interface EquityAssets {
  id: number;
  userId: string;
  date: Date;
  company: string;
  exchange: Exchange;
  price_per_share: number;
  total_shares: number;
  total_amount: number;
}

export interface MonthlyExpenseTracker {
  month: string;
  month_range: string;
  categoryTotals: Partial<Record<CategoryLabel, number>>;
  bucketTotals: {
    [K in BucketType]: number;
  };
  grandTotal: number;
}