import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { authRepository } from "../repositories/auth.repository";
import { send as sendMail, isMailConfigured } from "./mail.service";
import { toUserResponse } from "../models";
import { env } from "../config/env";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  validateEmailSchema,
  type RegisterInput,
  type LoginInput,
  type ResetPasswordInput,
  type UpdatePasswordInput,
  type ValidateEmailInput,
} from "../validators/auth.validator";

const SALT_ROUNDS = 10;

function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

function signToken(userId: number, email: string): string {
  const payload = { sub: userId, email };
  const options: jwt.SignOptions = {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.jwtSecret, options);
}

function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/** 6-digit numeric code (000000–999999) for email verification */
function generateEmailVerificationCode(): string {
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

export const authService = {
  async register(payload: unknown) {
    const data = registerSchema.parse(payload) as RegisterInput;
    const existing = await authRepository.findByEmail(data.email);
    if (existing) throw new Error("Email already registered");
    const byCin = await authRepository.findByCin(data.cin);
    if (byCin) throw new Error("CIN already registered");
    const hashed = await hashPassword(data.password);
    const user = await authRepository.create({
      nom_complet: data.nom_complet,
      cin: data.cin,
      telephone: data.telephone,
      email: data.email,
      adresse: data.adresse ?? null,
      password: hashed,
    });
    await authRepository.deleteExpiredEmailVerificationTokens();
    const verificationCode = generateEmailVerificationCode();
    const expiresAt = new Date(Date.now() + env.resetTokenExpiresMinutes * 60 * 1000);
    await authRepository.createEmailVerificationToken(user.id, user.email, verificationCode, expiresAt);
    const validationUrl = `${env.frontendUrl}/validate-email?token=${encodeURIComponent(verificationCode)}`;
    await sendMail({
      to: user.email,
      subject: "Verify your email",
      text: `Verify your email. Use this code: ${verificationCode} (valid ${env.resetTokenExpiresMinutes} min). Or open: ${validationUrl}`,
      template: { type: "validate-email", token: verificationCode, validationUrl, expiresMinutes: env.resetTokenExpiresMinutes },
    });
  
  },

  async validateEmail(payload: unknown) {
    const { otp } = validateEmailSchema.parse(payload) as ValidateEmailInput;
    const record = await authRepository.findValidEmailVerificationToken(otp);
    if (!record || record.expiresAt < new Date())
      throw new Error("Invalid or expired verification token");
    await authRepository.setEmailValidated(record.userId);
    await authRepository.deleteEmailVerificationToken(record.id);
    const user = await authRepository.findByEmail(record.user.email);
    if (!user) throw new Error("User not found");
    await sendMail({
      to: user.email,
      subject: "Welcome",
      text: `Welcome, ${user.nom_complet}. Your account has been verified.`,
      template: { type: "welcome", nomComplet: user.nom_complet },
    });
    const jwt = signToken(user.id, user.email);
    return { message: "Email validated successfully", user: toUserResponse(user), token: jwt };
  },

  async login(payload: unknown) {
    const data = loginSchema.parse(payload) as LoginInput;
    const user = await authRepository.findByEmail(data.email);
    if (!user) throw new Error("Invalid email or password");
    if (user.isEmailValidated !== true) throw new Error("Email not validated");
    const ok = await comparePassword(data.password, user.password);
    if (!ok) throw new Error("Invalid email or password");
    const token = signToken(user.id, user.email);
    return { user: toUserResponse(user), token };
  },

  async forgotPassword(payload: unknown) {
    const { email } = forgotPasswordSchema.parse(payload);
    const user = await authRepository.findByEmail(email);
    if (!user) return { message: "The email was sent successfully" };
    await authRepository.deleteExpiredTokens();
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + env.resetTokenExpiresMinutes * 60 * 1000);
    await authRepository.createPasswordResetToken(user.id, user.email, token, expiresAt);
    const resetUrl = `${env.frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
    const expiresMinutes = env.resetTokenExpiresMinutes;
    await sendMail({
      to: user.email,
      subject: "Password reset",
      text: `You requested a password reset. Use this link (valid ${expiresMinutes} min):\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
      template: { type: "password-reset", resetUrl, expiresMinutes },
    });
    const response: { message: string; resetToken?: string } = { message: "The email was sent successfully" };
    if (!isMailConfigured()) response.resetToken = token;
    return response;
  },

  async resetPassword(payload: unknown) {
    const data = resetPasswordSchema.parse(payload) as ResetPasswordInput;
    const record = await authRepository.findValidResetToken(data.token);
    if (!record || record.expiresAt < new Date())
      throw new Error("Invalid or expired reset token");
    const hashed = await hashPassword(data.password);
    await authRepository.updatePasswordByUserId(record.userId, hashed);
    await authRepository.deleteResetToken(record.id);
    return { message: "Password reset successfully" };
  },

  async updatePassword(payload: unknown) {
    const data = updatePasswordSchema.parse(payload) as UpdatePasswordInput;
    const user = await authRepository.findByEmail(data.email);
    if (!user) throw new Error("Invalid email or password");
    const ok = await comparePassword(data.currentPassword, user.password);
    if (!ok) throw new Error("Invalid email or password");
    const hashed = await hashPassword(data.newPassword);
    await authRepository.updatePasswordByUserId(user.id, hashed);
    return { message: "Password updated successfully" };
  },
};
