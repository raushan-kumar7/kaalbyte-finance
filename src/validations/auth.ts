import * as Yup from "yup";
import { userSchema } from "./user";

export const signinSchema = Yup.object().shape({
  userId: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

// Create the type first
export type ISignup = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

// Cast the schema to ObjectSchema<ISignup> to fix the "unknown" type errors
export const signupSchema = Yup.object().shape({
  firstName: userSchema.fields.firstName,
  lastName: userSchema.fields.lastName,
  email: userSchema.fields.email,
  username: userSchema.fields.username,
  password: userSchema.fields.password,
}) as Yup.ObjectSchema<ISignup>;

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string().required("New password is required"),
  confirmPassword: Yup.string().required("Confirm password is required"),
});

export type ISignin = Yup.InferType<typeof signinSchema>;
export type IChangePassword = Yup.InferType<typeof changePasswordSchema>;
