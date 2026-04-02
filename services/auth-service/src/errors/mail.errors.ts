import { AppError } from "./app.error";

export class MailDeliveryError extends AppError {
  constructor(cause?: unknown) {
    super(
      "Unable to send email. Check SMTP settings or try again later.",
      503,
      "MAIL_DELIVERY_FAILED",
      cause,
    );
    this.name = "MailDeliveryError";
  }
}
