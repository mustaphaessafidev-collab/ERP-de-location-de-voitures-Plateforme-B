import { env } from "../config/env";

const SITEVERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export type VerifyResult = { success: true } | { success: false; errorCodes: string[] };

/**
 * Verify a reCAPTCHA token with Google's siteverify API.
 * Works with both v2 and v3 tokens. When recaptcha is disabled or secret is empty, returns success.
 */
export async function verifyRecaptcha(
  token: string | undefined,
  remoteip?: string
): Promise<VerifyResult> {
  if (!env.recaptcha.enabled || !env.recaptcha.secretKey) {
    return { success: true };
  }
  if (!token || typeof token !== "string" || !token.trim()) {
    return { success: false, errorCodes: ["missing-input-response"] };
  }
  const body = new URLSearchParams({
    secret: env.recaptcha.secretKey,
    response: token.trim(),
    ...(remoteip && { remoteip }),
  });
  const res = await fetch(SITEVERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    return { success: false, errorCodes: ["request-failed"] };
  }
  const data = (await res.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };
  if (data.success === true) {
    return { success: true };
  }
  const errorCodes = Array.isArray(data["error-codes"]) ? data["error-codes"] : ["unknown"];
  return { success: false, errorCodes };
}
