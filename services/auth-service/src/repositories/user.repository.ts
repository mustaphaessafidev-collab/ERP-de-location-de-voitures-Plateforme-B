import { prisma } from "../config/prisma";
import type { UserResponse } from "../models";

const userSelect = {
  id: true,
  nom_complet: true,
  cin: true,
  telephone: true,
  email: true,
  adresse: true,
  isEmailValidated: true,
  created_at: true,
  updatedAt: true,
} as const;

export const userRepository = {
  async findMany(): Promise<UserResponse[]> {
    return prisma.user.findMany({
      select: userSelect,
    }) as Promise<UserResponse[]>;
  },

  async findById(id: number): Promise<UserResponse | null> {
    const row = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    return row as UserResponse | null;
  },
};
