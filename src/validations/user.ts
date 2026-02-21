import * as Yup from "yup";
import { Gender } from "../types/user";

export const userSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(2)
    .max(50)
    .required("First name is required"),
  middleName: Yup.string().trim().max(50).default(""),
  lastName: Yup.string()
    .trim()
    .min(2)
    .max(50)
    .required("Last name is required"),
  username: Yup.string().trim().min(3).max(50).required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain letters")
    .matches(/[0-9]/, "Password must contain numbers")
    .required("Password is required"),
  phone: Yup.string()
    .matches(/^[0-9+]{10,15}$/, "Invalid format")
    .default(""),
  gender: Yup.mixed<Gender>()
    .oneOf(Object.values(Gender))
    .default(Gender.OTHER),
  dateOfBirth: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
    .default(""),
  avatar: Yup.string().url().default(""),
});

export const profileUpdateSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .min(2)
    .max(50)
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(2)
    .max(50)
    .required("Last name is required"),
  phone: Yup.string()
    .matches(/^[0-9+]{10,15}$/, "Invalid format")
    .optional(),
  gender: Yup.mixed<Gender>()
    .oneOf(Object.values(Gender))
    .optional(),
  dateOfBirth: Yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD")
    .optional(),
});