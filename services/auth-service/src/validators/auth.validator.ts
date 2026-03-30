import { z } from "zod";

const EMAIL_MAX_LENGTH = 255;

/** Password: min 8 chars, at least one uppercase, one lowercase, one special character */
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    PASSWORD_PATTERN,
    "Password must contain at least one uppercase, one lowercase and one special character"
  );

const emailSchema = z
  .string()
  .email("Invalid email")
  .max(EMAIL_MAX_LENGTH, `Email must be at most ${EMAIL_MAX_LENGTH} characters`);

export const registerSchema = z.object({
  nom_complet: z.string().min(1, "Full name is required").max(200),
  cin: z.string().min(1, "CIN is required").max(50),
  telephone: z.string().min(1, "Phone is required").max(20),
  email: emailSchema,
  adresse: z.string().max(500).optional(),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  recaptchaToken: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Password and confirm password must be the same",
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  recaptchaToken: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  recaptchaToken: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Password and confirm password must be the same",
});

export const updatePasswordSchema = z.object({
  email: emailSchema,
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "New password and confirm password must be the same",
});

/** 6-digit verification code from email */
export const validateEmailSchema = z.object({
  otp: z
    .string()
    .min(1, "Verification code is required")
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Code must be exactly 6 digits"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;
