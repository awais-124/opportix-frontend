import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email")
    .max(255, "Email is too long"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username is too long"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name is too long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username is too long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email")
      .max(255, "Email is too long"),
    phone: z
      .string()
      .regex(
        /^(\+92|0)?[0-9]{10}$/,
        "Phone must be a valid Pakistani number (e.g. 03001234567)"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["applicant", "employer"], {
      errorMap: () => ({ message: "Select a role" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  fullname: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100)
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .optional(),
  phone: z
    .string()
    .regex(/^(\+92|0)?[0-9]{10}$/, "Phone must be a valid Pakistani number")
    .optional(),
  linkedIn: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
});
