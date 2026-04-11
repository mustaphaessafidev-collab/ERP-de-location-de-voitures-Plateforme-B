import { z } from "zod";
import { isMailConfigured, send } from "./mail.service";
import * as reservationRepo from "../repositories/reservation.repository";
import * as notifRepo from "../repositories/notification.repository";

const confirmBodySchema = z.object({
  email: z.string().email(),
  vehicleName: z.string().min(1),
  vehicleId: z.number().int().positive().optional().nullable(),
  agency: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pickUp: z.string().min(1),
  returnDrop: z.string().min(1),
  days: z.number().int().positive(),
  totalAmount: z.union([z.number(), z.string()]),
  planningSlots: z.string().optional().nullable(),
});

function parseAmount(v: number | string): number {
  if (typeof v === "number") return v;
  return Number.parseFloat(v);
}

function generatePublicId(): string {
  return `RES-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function confirmReservationWithEmail(raw: unknown): Promise<{ reservationId: string }> {
  const data = confirmBodySchema.parse(raw);

  if (!isMailConfigured()) {
    throw new Error("MAIL_NOT_CONFIGURED");
  }

  const totalAmount = parseAmount(data.totalAmount);
  const amountStr = totalAmount.toFixed(2);
  const location = [data.agency, data.city].filter(Boolean).join(" — ") || "—";
  const publicId = generatePublicId();

  const slotsLine =
    data.planningSlots?.trim() ?
      `\nCréneaux planning : ${data.planningSlots.trim()}`
    : "";

  const text = [
    `Bonjour,`,
    ``,
    `Votre réservation est confirmée.`,
    ``,
    `N° de réservation : ${publicId}`,
    `Véhicule : ${data.vehicleName}`,
    `Lieu : ${location}`,
    `Prise en charge : ${data.pickUp}`,
    `Retour : ${data.returnDrop}`,
    `Durée : ${data.days} jour(s)`,
    `Montant total : ${amountStr} DH`,
    `${slotsLine}`,
    ``,
    `Merci de votre confiance.`,
  ].join("\n");

  await send({
    to: data.email,
    subject: `Confirmation de réservation ${publicId}`,
    text,
  });

  await reservationRepo.createConfirmedReservation({
    publicId,
    customerEmail: data.email,
    vehicleName: data.vehicleName,
    vehicleId: data.vehicleId,
    agency: data.agency,
    city: data.city,
    pickUpLabel: data.pickUp,
    returnLabel: data.returnDrop,
    days: data.days,
    totalAmount,
    planningSlots: data.planningSlots,
  });

  // Création automatique de la notification liée à la réservation
  await notifRepo.createNotification({
    userEmail: data.email,
    type: "success",
    title: "Réservation confirmée ✅",
    message: `Votre réservation ${publicId} pour ${data.vehicleName} a été confirmée avec succès.`,
    reservationId: publicId,
  });

  return { reservationId: publicId };
}
