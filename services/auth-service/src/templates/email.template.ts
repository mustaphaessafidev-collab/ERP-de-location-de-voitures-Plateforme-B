import path from "path";
import fs from "fs";
import ejs from "ejs";

function getTemplatesDir(): string {
  const fromDir = path.join(__dirname);
  if (fs.existsSync(path.join(fromDir, "email.ejs"))) return fromDir;
  return path.join(process.cwd(), "src", "templates");
}

function getTemplatePath(filename: string): string {
  return path.join(getTemplatesDir(), filename);
}

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Template type for auth emails */
export type EmailTemplateType = "welcome" | "password-reset" | "validate-email";

export interface WelcomeTemplateVars {
  title: string;
  nomComplet: string;
}

export interface ResetPasswordTemplateVars {
  title: string;
  resetUrl: string;
  expiresMinutes: number;
}

export interface ValidateEmailTemplateVars {
  title: string;
  token: string;
  validationUrl: string;
  expiresMinutes: number;
}

/** Generic (fallback) – title + body */
export interface EmailTemplateVariables {
  title: string;
  body: string;
}

/**
 * Build HTML from a typed template. Use for welcome, password-reset and validate-email in auth.
 */
export async function buildTemplateHtml(
  type: EmailTemplateType,
  vars: WelcomeTemplateVars | ResetPasswordTemplateVars | ValidateEmailTemplateVars
): Promise<string> {
  const dir = getTemplatesDir();
  const filenames: Record<EmailTemplateType, string> = {
    welcome: "welcome.ejs",
    "password-reset": "reset-password.ejs",
    "validate-email": "validate-email.ejs",
  };
  const templatePath = path.join(dir, filenames[type]);

  if (type === "welcome") {
    const { title, nomComplet } = vars as WelcomeTemplateVars;
    return ejs.renderFile(templatePath, {
      title: escapeHtml(String(title).trim() || "Welcome"),
      nomComplet: escapeHtml(String(nomComplet).trim()),
    });
  }
  if (type === "password-reset") {
    const { title, resetUrl, expiresMinutes } = vars as ResetPasswordTemplateVars;
    return ejs.renderFile(templatePath, {
      title: escapeHtml(String(title).trim() || "Password reset"),
      resetUrl: String(resetUrl),
      expiresMinutes: Number(expiresMinutes) || 60,
    });
  }
  const { title, token, validationUrl, expiresMinutes } = vars as ValidateEmailTemplateVars;
  return ejs.renderFile(templatePath, {
    title: escapeHtml(String(title).trim() || "Verify your email"),
    token: String(token),
    validationUrl: String(validationUrl),
    expiresMinutes: Number(expiresMinutes) || 60,
  });
}

/**
 * Build HTML from generic email.ejs (title + body). Used when no template type is set.
 */
export async function buildStyledHtml(variables: EmailTemplateVariables): Promise<string> {
  const title = escapeHtml(String(variables.title).trim() || "Message");
  const body = variables.body?.trim() ?? "";
  const templatePath = getTemplatePath("email.ejs");
  return ejs.renderFile(templatePath, { title, body });
}
