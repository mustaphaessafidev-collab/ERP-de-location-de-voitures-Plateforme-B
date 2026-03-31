import { AppError } from "./app.error";

export class DatabaseConfigError extends AppError {
  constructor(message: string) {
    super(message, 500, "DATABASE_CONFIG_ERROR");
    this.name = "DatabaseConfigError";
  }
}

export class DatabaseConnectionError extends AppError {
  public readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message, 500, "DATABASE_CONNECTION_ERROR", { cause });
    this.name = "DatabaseConnectionError";
    this.cause = cause;
  }
}
