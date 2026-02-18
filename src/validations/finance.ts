import * as Yup from "yup";
import { Exchange, BucketType, CATEGORIES } from "../types/finance";

const categoryLabels = Object.values(CATEGORIES).map((cat) => cat.label);

// ✅ CORRECTED: userId is optional for form validation
// The service layer will add userId, so forms don't need to provide it
export const dailyEntrySchema = Yup.object().shape({
  userId: Yup.string().optional(), // ✅ CHANGED: Make optional for forms
  date: Yup.date().required("Date is required"),
  category: Yup.string()
    .oneOf(categoryLabels, "Invalid category")
    .required("Category is required"),
  description: Yup.string()
    .trim()
    .max(200, "Description is too long")
    .required("Description is required"),
  amount: Yup.number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  bucket: Yup.mixed<BucketType>()
    .oneOf(Object.values(BucketType), "Invalid bucket type")
    .required("Bucket is required"),
});

// ✅ NEW: Separate schema for service layer validation (with required userId)
export const dailyEntryServiceSchema = Yup.object().shape({
  userId: Yup.string().required("User ID is required"),
  date: Yup.date().required("Date is required"),
  category: Yup.string()
    .oneOf(categoryLabels, "Invalid category")
    .required("Category is required"),
  description: Yup.string()
    .trim()
    .max(200, "Description is too long")
    .required("Description is required"),
  amount: Yup.number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  bucket: Yup.mixed<BucketType>()
    .oneOf(Object.values(BucketType), "Invalid bucket type")
    .required("Bucket is required"),
});

// ✅ CORRECTED: user_id is optional for forms
export const goldAssetSchema = Yup.object().shape({
  user_id: Yup.string().optional(), // ✅ CHANGED: Make optional for forms
  date: Yup.date().required("Purchase date is required"),
  platform: Yup.string().required("Platform name is required"),
  rate_per_gram: Yup.number()
    .positive("Rate must be positive")
    .required("Rate is required"),
  amount_paid: Yup.number()
    .positive("Paid amount must be positive")
    .required("Amount paid is required"),
  gst_3_percent: Yup.number().min(0, "GST cannot be negative"),
  weight_g: Yup.number().positive("Weight must be positive"),
  gold_value: Yup.number().min(0, "Value cannot be negative"),
});

// ✅ NEW: Separate schema for service layer
export const goldAssetServiceSchema = Yup.object().shape({
  user_id: Yup.string().required("User ID is required"),
  date: Yup.date().required("Purchase date is required"),
  platform: Yup.string().required("Platform name is required"),
  rate_per_gram: Yup.number()
    .positive("Rate must be positive")
    .required("Rate is required"),
  amount_paid: Yup.number()
    .positive("Paid amount must be positive")
    .required("Amount paid is required"),
  gst_3_percent: Yup.number().min(0, "GST cannot be negative"),
  weight_g: Yup.number().positive("Weight must be positive"),
  gold_value: Yup.number().min(0, "Value cannot be negative"),
});

// ✅ CORRECTED: user_id is optional for forms
export const equityAssetSchema = Yup.object().shape({
  user_id: Yup.string().optional(), // ✅ CHANGED: Make optional for forms
  date: Yup.date().required("Purchase date is required"),
  company: Yup.string().required("Company name is required"),
  exchange: Yup.mixed<Exchange>()
    .oneOf(Object.values(Exchange), "Invalid exchange")
    .required("Exchange is required"),
  price_per_share: Yup.number().positive().required("Price is required"),
  total_shares: Yup.number().integer().positive().required("Shares required"),
  total_amount: Yup.number().positive().required("Total amount required"),
});

// ✅ NEW: Separate schema for service layer
export const equityAssetServiceSchema = Yup.object().shape({
  user_id: Yup.string().required("User ID is required"),
  date: Yup.date().required("Purchase date is required"),
  company: Yup.string().required("Company name is required"),
  exchange: Yup.mixed<Exchange>()
    .oneOf(Object.values(Exchange), "Invalid exchange")
    .required("Exchange is required"),
  price_per_share: Yup.number().positive().required("Price is required"),
  total_shares: Yup.number().integer().positive().required("Shares required"),
  total_amount: Yup.number().positive().required("Total amount required"),
});

// ✅ CORRECTED: userId is optional for forms
export const monthlyIncomeSchema = Yup.object().shape({
  userId: Yup.string().optional(), // ✅ CHANGED: Make optional for forms
  month: Yup.string()
    .matches(/^\d{4}-\d{2}$/, "Format must be YYYY-MM")
    .required("Month is required"),
  salary: Yup.number().min(0).default(0),
  other_income: Yup.number().min(0).default(0),
  total_income: Yup.number().min(0),
});

// ✅ NEW: Separate schema for service layer
export const monthlyIncomeServiceSchema = Yup.object().shape({
  userId: Yup.string().required("User ID is required"),
  month: Yup.string()
    .matches(/^\d{4}-\d{2}$/, "Format must be YYYY-MM")
    .required("Month is required"),
  salary: Yup.number().min(0).default(0),
  other_income: Yup.number().min(0).default(0),
  total_income: Yup.number().min(0),
});