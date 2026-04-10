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
    const rows = await prisma.$queryRaw<
      Array<
        User & {
          id: number | bigint;
          driving_license_id: number | bigint | null;
          license_number: string | null;
          expiry_date: Date | null;
          front_document_data: string | null;
          front_document_name: string | null;
          front_document_mime_type: string | null;
          back_document_data: string | null;
          back_document_name: string | null;
          back_document_mime_type: string | null;
          dl_created_at: Date | null;
          dl_updated_at: Date | null;
        }
      >
    >(Prisma.sql`
      SELECT
        u.id,
        u.nom_complet,
        u.cin,
        u.num_permis,
        u.telephone,
        u.email,
        u.adresse,
        u.profile_photo_data AS "profilePhotoData",
        u.profile_photo_name AS "profilePhotoName",
        u.profile_photo_mime_type AS "profilePhotoMimeType",
        u.password,
        u.is_email_validated AS "isEmailValidated",
        u.created_at,
        u.updated_at AS "updatedAt",
        dl.id AS driving_license_id,
        dl.license_number,
        dl.expiry_date,
        dl.front_document_data,
        dl.front_document_name,
        dl.front_document_mime_type,
        dl.back_document_data,
        dl.back_document_name,
        dl.back_document_mime_type,
        dl.created_at AS dl_created_at,
        dl.updated_at AS dl_updated_at
      FROM users u
      LEFT JOIN driving_licenses dl ON dl.user_id = u.id
      WHERE u.id = ${id}
      LIMIT 1
    `);

    const row = rows[0];
    if (!row) return null;

    const {
      password,
      driving_license_id,
      license_number,
      expiry_date,
      front_document_data,
      front_document_name,
      front_document_mime_type,
      back_document_data,
      back_document_name,
      back_document_mime_type,
      dl_created_at,
      dl_updated_at,
      ...userWithoutPassword
    } = row;

    return {
      ...userWithoutPassword,
      id: toNumber(row.id),
      drivingLicense: driving_license_id
        ? {
            id: toNumber(driving_license_id),
            userId: toNumber(row.id),
            licenseNumber: license_number ?? "",
            expiryDate: expiry_date,
            frontDocumentData: front_document_data,
            frontDocumentName: front_document_name,
            frontDocumentMimeType: front_document_mime_type,
            backDocumentData: back_document_data,
            backDocumentName: back_document_name,
            backDocumentMimeType: back_document_mime_type,
            createdAt: dl_created_at ?? new Date(),
            updatedAt: dl_updated_at ?? new Date(),
          }
        : null,
    } as UserProfileResponse;
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
      const [drivingLicense] = await tx.$queryRaw<
        Array<{
          id: number | bigint;
          userId: number | bigint;
          licenseNumber: string;
          expiryDate: Date | null;
          frontDocumentData: string | null;
          frontDocumentName: string | null;
          frontDocumentMimeType: string | null;
          backDocumentData: string | null;
          backDocumentName: string | null;
          backDocumentMimeType: string | null;
          createdAt: Date;
          updatedAt: Date;
        }>
      >(Prisma.sql`
        INSERT INTO driving_licenses (
          user_id,
          license_number,
          expiry_date,
          front_document_data,
          front_document_name,
          front_document_mime_type,
          back_document_data,
          back_document_name,
          back_document_mime_type
        )
        VALUES (
          ${userId},
          ${data.licenseNumber},
          ${data.expiryDate},
          ${data.frontDocumentData ?? null},
          ${data.frontDocumentName ?? null},
          ${data.frontDocumentMimeType ?? null},
          ${data.backDocumentData ?? null},
          ${data.backDocumentName ?? null},
          ${data.backDocumentMimeType ?? null}
        )
        ON CONFLICT (user_id) DO UPDATE SET
          license_number = EXCLUDED.license_number,
          expiry_date = EXCLUDED.expiry_date,
          front_document_data = EXCLUDED.front_document_data,
          front_document_name = EXCLUDED.front_document_name,
          front_document_mime_type = EXCLUDED.front_document_mime_type,
          back_document_data = EXCLUDED.back_document_data,
          back_document_name = EXCLUDED.back_document_name,
          back_document_mime_type = EXCLUDED.back_document_mime_type,
          updated_at = CURRENT_TIMESTAMP
        RETURNING
          id,
          user_id AS "userId",
          license_number AS "licenseNumber",
          expiry_date AS "expiryDate",
          front_document_data AS "frontDocumentData",
          front_document_name AS "frontDocumentName",
          front_document_mime_type AS "frontDocumentMimeType",
          back_document_data AS "backDocumentData",
          back_document_name AS "backDocumentName",
          back_document_mime_type AS "backDocumentMimeType",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `);

      await tx.user.update({
        where: { id: userId },
        data: { num_permis: data.licenseNumber },
      });

      return {
        ...drivingLicense,
        id: toNumber(drivingLicense.id),
        userId: toNumber(drivingLicense.userId),
      };
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
