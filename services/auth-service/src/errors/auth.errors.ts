import { AppError } from "./app.error";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Les informations de connexion ne correspondent pas à nos dossiers", 400, "INVALID_CREDENTIALS");
    this.name = "InvalidCredentialsError";
  }
}

export class InvalidCurrentPasswordError extends AppError {
  constructor() {
    super("Current password is incorrect", 400, "INVALID_CURRENT_PASSWORD");
    this.name = "InvalidCurrentPasswordError";
  }
}

export class EmailNotValidatedError extends AppError {
  constructor() {
    super("Veuillez vérifier votre adresse e-mail avant de vous connecter", 403, "EMAIL_NOT_VALIDATED");
    this.name = "EmailNotValidatedError";
  }
}

export class InvalidVerificationTokenError extends AppError {
  constructor() {
    super("Code de vérification invalide ou expiré", 400, "INVALID_VERIFICATION_TOKEN");
    this.name = "InvalidVerificationTokenError";
  }
}

export class UserAlreadyRegisteredError extends AppError {
  constructor() {
    super("Cette adresse e-mail est déjà enregistrée", 409, "EMAIL_ALREADY_REGISTERED");
    this.name = "UserAlreadyRegisteredError";
  }
}

export class CinAlreadyRegisteredError extends AppError {
  constructor() {
    super("Ce CIN est déjà enregistré", 409, "CIN_ALREADY_REGISTERED");
    this.name = "CinAlreadyRegisteredError";
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super("Utilisateur non trouvé", 404, "USER_NOT_FOUND");
    this.name = "UserNotFoundError";
  }
}

export class InvalidResetTokenError extends AppError {
  constructor() {
    super("Jeton de réinitialisation invalide ou expiré", 400, "INVALID_RESET_TOKEN");
    this.name = "InvalidResetTokenError";
  }
}
