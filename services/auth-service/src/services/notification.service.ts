import { z } from "zod";
import * as notifRepo from "../repositories/notification.repository";

const createSchema = z.object({
  userEmail: z.string().email(),
  type: z.enum(["success", "error", "info", "warning"]),
  title: z.string().min(1),
  message: z.string().min(1),
  reservationId: z.string().optional().nullable(),
});

export async function createNotification(raw: unknown) {
  const data = createSchema.parse(raw);
  return notifRepo.createNotification(data);
}

export async function listNotifications(email: string) {
  if (!email) throw new Error("email requis");
  return notifRepo.getNotificationsByEmail(email);
}

export async function markOneRead(id: number) {
  return notifRepo.markNotificationRead(id);
}

export async function markAllRead(email: string) {
  if (!email) throw new Error("email requis");
  return notifRepo.markAllNotificationsRead(email);
}

export async function removeOne(id: number) {
  return notifRepo.deleteNotification(id);
}

export async function removeAll(email: string) {
  if (!email) throw new Error("email requis");
  return notifRepo.deleteAllNotifications(email);
}
