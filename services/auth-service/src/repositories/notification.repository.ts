import { prisma } from "../config/prisma";

export async function createNotification(data: {
  userEmail: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  reservationId?: string | null;
}) {
  return prisma.notification.create({
    data: {
      userEmail: data.userEmail,
      type: data.type,
      title: data.title,
      message: data.message,
      reservationId: data.reservationId ?? null,
      isRead: false,
    },
  });
}

export async function getNotificationsByEmail(email: string) {
  return prisma.notification.findMany({
    where: { userEmail: email },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationRead(id: number) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllNotificationsRead(email: string) {
  return prisma.notification.updateMany({
    where: { userEmail: email, isRead: false },
    data: { isRead: true },
  });
}

export async function deleteNotification(id: number) {
  return prisma.notification.delete({ where: { id } });
}

export async function deleteAllNotifications(email: string) {
  return prisma.notification.deleteMany({ where: { userEmail: email } });
}
