/**
 * Domain model for User. Matches the database entity (users table).
 * Use UserResponse for API responses (no password).
 */
export interface User {
  id: number;
  nom_complet: string;
  cin: string;
  telephone: string;
  email: string;
  adresse: string | null;
  password: string;
  isEmailValidated: boolean | null;
  created_at: Date;
  updatedAt: Date;
}

/** User without password, safe for API responses and JWT payload context */
export type UserResponse = Omit<User, "password">;

/** Input for creating a new user (e.g. register) */
export interface CreateUserInput {
  nom_complet: string;
  cin: string;
  telephone: string;
  email: string;
  adresse?: string | null;
  password: string;
}

/** Strip password from a user object */
export function toUserResponse(user: User): UserResponse {
  const { password: _, ...rest } = user;
  return rest;
}
