import { prisma } from "../config/prisma";
import type { CreateUserInput, User } from "../models";

export type { CreateUserInput };

export const authRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return row as User | null;
  },

  async findByCin(cin: string): Promise<User | null> {
    const row = await prisma.user.findUnique({
      where: { cin },
    });
    return row as User | null;
  },

  async create(data: CreateUserInput): Promise<User> {
    const row = await prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });
    return row as User;
  },

  async updatePasswordByUserId(userId: number, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },

  async createPasswordResetToken(userId: number, email: string, token: string, expiresAt: Date) {
    return prisma.passwordResetToken.create({
      data: { userId, email: email.toLowerCase(), token, expiresAt },
    });
  },

  findValidResetToken(token: string) {
    return prisma.passwordResetToken.findFirst({
      where: { token },
      include: { user: true },
    });
  },

  deleteResetToken(id: number) {
    return prisma.passwordResetToken.delete({
      where: { id },
    });
  },

  deleteExpiredTokens() {
    return prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  },

  async createEmailVerificationToken(userId: number, email: string, token: string, expiresAt: Date) {
    return prisma.emailVerificationToken.create({
      data: { userId, email: email.toLowerCase(), token, expiresAt },
    });
  },

  findValidEmailVerificationToken(token: string) {
    return prisma.emailVerificationToken.findFirst({
      where: { token },
      include: { user: true },
    });
  },

  deleteEmailVerificationToken(id: number) {
    return prisma.emailVerificationToken.delete({ where: { id } });
  },

  async setEmailValidated(userId: number) {
    await prisma.user.update({
      where: { id: userId },
      data: { isEmailValidated: true },
    });
  },

  deleteExpiredEmailVerificationTokens() {
    return prisma.emailVerificationToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  },
};
