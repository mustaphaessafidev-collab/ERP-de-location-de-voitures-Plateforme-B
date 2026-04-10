/**
 * Domain model for User. Matches the database entity (users table).
 * Use UserResponse for API responses (no password).
 */
export interface User {
  id: number;
  nom_complet: string;
  cin: string;
  num_permis?: string | null;
  telephone: string;
  email: string;
  adresse: string | null;
  profilePhotoData?: string | null;
  profilePhotoName?: string | null;
  profilePhotoMimeType?: string | null;
  password: string;
  isEmailValidated: boolean | null;
  created_at: Date;
  updatedAt: Date;
}

export interface DrivingLicense {
  id: number;
  userId: number;
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
}

export interface UserProfileResponse extends UserResponse {
  drivingLicense?: DrivingLicense | null;
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
