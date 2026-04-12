import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import type { CreateUserInput, User, UserProfileResponse } from "../models";

export type { CreateUserInput };

function toNumber(value: unknown): number {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "number") return value;
  return Number(value);
}

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

  async findById(id: number): Promise<User | null> {
    const row = await prisma.user.findUnique({
      where: { id },
    });
    return row as User | null;
  },

  async findProfileById(id: number): Promise<UserProfileResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        drivingLicense: true,
      },
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword as UserProfileResponse;
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

  async updatePersonalInfoByUserId(
    userId: number,
    data: { nom_complet: string; cin: string; email: string; telephone: string; adresse: string | null }
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        nom_complet: data.nom_complet,
        cin: data.cin,
        email: data.email.toLowerCase(),
        telephone: data.telephone,
        adresse: data.adresse,
      },
    });
  },

  async updateProfilePhotoByUserId(
    userId: number,
    data: {
      profilePhotoData: string | null;
      profilePhotoName: string | null;
      profilePhotoMimeType: string | null;
    }
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        profilePhotoData: data.profilePhotoData,
        profilePhotoName: data.profilePhotoName,
        profilePhotoMimeType: data.profilePhotoMimeType,
      },
    });
  },

  async upsertDrivingLicense(
    userId: number,
    data: {
      licenseNumber: string;
      expiryDate: Date | null;
      frontDocumentData?: string | null;
      frontDocumentName?: string | null;
      frontDocumentMimeType?: string | null;
      backDocumentData?: string | null;
      backDocumentName?: string | null;
      backDocumentMimeType?: string | null;
    }
  ) {
    return prisma.$transaction(async (tx) => {
      const payload = {
        licenseNumber: data.licenseNumber,
        expiryDate: data.expiryDate,
        frontDocumentData: data.frontDocumentData ?? null,
        frontDocumentName: data.frontDocumentName ?? null,
        frontDocumentMimeType: data.frontDocumentMimeType ?? null,
        backDocumentData: data.backDocumentData ?? null,
        backDocumentName: data.backDocumentName ?? null,
        backDocumentMimeType: data.backDocumentMimeType ?? null,
      };

      const drivingLicense = await tx.drivingLicense.upsert({
        where: { userId },
        create: {
          userId,
          ...payload
        },
        update: payload,
      });

      await tx.user.update({
        where: { id: userId },
        data: { num_permis: data.licenseNumber },
      });

      return drivingLicense;
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
