import dotenv from "dotenv";

dotenv.config({ path: "prisma/.env" });

const toBoolean = (value: string | undefined, defaultValue: boolean) => {
  return value?.toLowerCase() === "true" ? true : value?.toLowerCase() === "false" ? false : defaultValue;
};

const toNumber = (value: string | undefined, defaultValue: number) => {
  return Number(value) ?? defaultValue;
};

const toString = (value: string | undefined, defaultValue: string) => {
  return String(value) ?? defaultValue;
};


export const env = {
  port: toNumber(process.env.PORT, 8000),
  nodeEnv: toBoolean(process.env.NODE_ENV, true),
  jwtSecret: toString(process.env.JWT_SECRET, "change-me-in-production"),
  jwtExpiresIn: toString(process.env.JWT_EXPIRES_IN, "7d"),
  resetTokenExpiresMinutes: toNumber(process.env.RESET_TOKEN_EXPIRES_MINUTES, 60),
  // Mail: set MAIL_ENABLED=true and SMTP_* to send emails
  mail: {
    enabled: toBoolean(process.env.MAIL_ENABLED, false),
    fromName: toString(process.env.MAIL_FROM_NAME, "Noreply"),
    fromEmail: toString(process.env.MAIL_FROM_EMAIL, "noreply@example.com"),
    host: process.env.SMTP_HOST ?? "",
    port: toNumber(process.env.SMTP_PORT, 587),
    secure: toBoolean(process.env.SMTP_SECURE, false),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
  },
  get mailFrom() {
    const { fromName, fromEmail } = env.mail;
    return fromName ? `"${fromName}" <${fromEmail}>` : fromEmail;
  },
  appBaseUrl: toString(process.env.APP_BASE_URL, "http://localhost:8000"),
  frontendUrl: toString(process.env.FRONTEND_URL, "http://localhost:3000"),
  // reCAPTCHA: set RECAPTCHA_ENABLED=true and RECAPTCHA_SECRET_KEY to verify on register/login
  recaptcha: {
    enabled: toBoolean(process.env.RECAPTCHA_ENABLED, false),
    secretKey: toString(process.env.RECAPTCHA_SECRET_KEY, ""),
  },
};

