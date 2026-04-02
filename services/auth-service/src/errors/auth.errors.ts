import { AppError } from "./app.error";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("The credentials don't match with our records", 400, "INVALID_CREDENTIALS");
    this.name = "InvalidCredentialsError";
  }
}

export class EmailNotValidatedError extends AppError {
  constructor() {
    super("Please verify your email before logging in", 403, "EMAIL_NOT_VALIDATED");
    this.name = "EmailNotValidatedError";
  }
}

export class InvalidVerificationTokenError extends AppError {
  constructor() {
    super("Invalid or expired verification token", 400, "INVALID_VERIFICATION_TOKEN");
    this.name = "InvalidVerificationTokenError";
  }
}

export class UserAlreadyRegisteredError extends AppError {
  constructor() {
    super("The email or cin is already registered", 409, "EMAIL_ALREADY_REGISTERED");
    this.name = "UserAlreadyRegisteredError";
  }
}

export class CinAlreadyRegisteredError extends AppError {
  constructor() {
    super("The email or cin is already registered", 409, "CIN_ALREADY_REGISTERED");
    this.name = "CinAlreadyRegisteredError";
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("User not found", 404, "USER_NOT_FOUND");
    this.name = "UserNotFoundError";
  }
}

export class InvalidResetTokenError extends AppError {
  constructor() {
    super("Invalid or expired reset token", 400, "INVALID_RESET_TOKEN");
    this.name = "InvalidResetTokenError";
  }
}
