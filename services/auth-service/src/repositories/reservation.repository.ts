import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

export async function createConfirmedReservation(data: {
  publicId: string;
  customerEmail: string;
  vehicleName: string;
  vehicleId?: number | null;
  agency?: string | null;
  city?: string | null;
  pickUpLabel: string;
  returnLabel: string;
  days: number;
  totalAmount: number;
  planningSlots?: string | null;
}) {
  return prisma.reservation.create({
    data: {
      publicId: data.publicId,
      status: "CONFIRMED",
      customerEmail: data.customerEmail,
      vehicleName: data.vehicleName,
      vehicleId: data.vehicleId ?? null,
      agency: data.agency ?? null,
      city: data.city ?? null,
      pickUpLabel: data.pickUpLabel,
      returnLabel: data.returnLabel,
      days: data.days,
      totalAmount: new Prisma.Decimal(data.totalAmount),
      planningSlots: data.planningSlots ?? null,
    },
  });
}
