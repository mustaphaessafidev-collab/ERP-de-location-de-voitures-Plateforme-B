import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { env } from "../config/env";
import {
  buildStyledHtml,
  buildTemplateHtml,
  type WelcomeTemplateVars,
  type ResetPasswordTemplateVars,
  type ValidateEmailTemplateVars,
} from "../templates/email.template";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  const { enabled, host, port, secure, user, pass } = env.mail;
  if (!enabled || !host || !user || !pass) return null;
  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  return transporter;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Template payload for auth emails – pick type and pass the right vars */
export type MailTemplate =
  | { type: "welcome"; nomComplet: string }
  | { type: "password-reset"; resetUrl: string; expiresMinutes: number }
  | { type: "validate-email"; token: string; validationUrl: string; expiresMinutes: number };

export interface SendOptions {
  to: string;
  subject: string;
  text: string;
  /** When set, use welcome.ejs, reset-password.ejs or validate-email.ejs instead of generic email.ejs */
  template?: MailTemplate;
}


function textToBodyHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}

/**
 * Global sender. Pass template: { type: 'welcome' | 'password-reset', ...vars } to use welcome.ejs or reset-password.ejs.
 * Otherwise HTML is built from generic email.ejs with subject + text.
 */
export async function send(options: SendOptions): Promise<void> {
  const transport = getTransporter();
  if (!transport) return;

  const to = options.to.trim();
  const subject = options.subject.trim();
  const text = options.text.trim();

  let html: string;
  if (options.template) {
    const title = subject;
    if (options.template.type === "welcome") {
      const vars: WelcomeTemplateVars = { title, nomComplet: options.template.nomComplet };
      html = await buildTemplateHtml("welcome", vars);
    } else if (options.template.type === "password-reset") {
      const vars: ResetPasswordTemplateVars = {
        title,
        resetUrl: options.template.resetUrl,
        expiresMinutes: options.template.expiresMinutes,
      };
      html = await buildTemplateHtml("password-reset", vars);
    } else {
      const vars: ValidateEmailTemplateVars = {
        title,
        token: options.template.token,
        validationUrl: options.template.validationUrl,
        expiresMinutes: options.template.expiresMinutes,
      };
      html = await buildTemplateHtml("validate-email", vars);
    }
  } else {
    html = await buildStyledHtml({ title: subject, body: textToBodyHtml(text) });
  }

  await transport.sendMail({
    from: env.mailFrom,
    to,
    subject,
    text,
    html,
  });
}

export function isMailConfigured(): boolean {
  return getTransporter() !== null;
}
