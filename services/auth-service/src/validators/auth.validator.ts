import { z } from "zod";

const EMAIL_MAX_LENGTH = 255;

/** Password: min 8 chars, at least one uppercase, one lowercase, one special character */
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(
    PASSWORD_PATTERN,
    "Le mot de passe doit contenir au moins une majuscule, une minuscule et un caractère spécial"
  );

const emailSchema = z
  .string()
  .email("Email invalide")
  .max(EMAIL_MAX_LENGTH, `L'e-mail doit faire au plus ${EMAIL_MAX_LENGTH} caractères`);

export const registerSchema = z.object({
  nom_complet: z.string().min(1, "Le nom complet est requis").max(200),
  cin: z.string().max(50).optional(),
  telephone: z.string().max(20).optional(),
  email: emailSchema,
  adresse: z.string().max(500).optional(),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  recaptchaToken: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Le mot de passe et sa confirmation doivent être identiques",
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis"),
  recaptchaToken: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  recaptchaToken: z.string().optional(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Le jeton de réinitialisation est requis"),
  password: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Le mot de passe et sa confirmation doivent être identiques",
});

export const updatePasswordSchema = z.object({
  email: emailSchema,
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Le nouveau mot de passe et sa confirmation doivent être identiques",
});

/** 6-digit verification code from email */
export const validateEmailSchema = z.object({
  otp: z
    .string()
    .min(1, "Le code de vérification est requis")
    .length(6, "Le code doit comporter 6 chiffres")
    .regex(/^\d{6}$/, "Le code doit comporter exactement 6 chiffres"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type ValidateEmailInput = z.infer<typeof validateEmailSchema>;
