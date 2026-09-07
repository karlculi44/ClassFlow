import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters long")
      .max(100, "Name must be 100 characters or fewer"),
    email: z.string().trim().toLowerCase().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(128, "Password must be 128 characters or fewer"),
  })
  .strict();

export const createAdminSchema = registerSchema;

export const forgotPasswordSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Invalid email address"),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, "Reset token is required").max(256),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(128, "Password must be 128 characters or fewer"),
    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const profileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters long")
      .max(100, "Name must be 100 characters or fewer"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254, "Email must be 254 characters or fewer")
      .email("Invalid email address"),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters long")
      .max(128, "Current password must be 128 characters or fewer"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long")
      .max(128, "New password must be 128 characters or fewer"),
  })
  .strict();
