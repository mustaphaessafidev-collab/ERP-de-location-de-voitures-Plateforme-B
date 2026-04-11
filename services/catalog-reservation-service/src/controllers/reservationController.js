import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createReservation = async (req, res) => {
  try {
    const {
      client_id,
      vehicle_id,
      date_debut,
      date_fin,
      prix,
      nombre_jours,
    } = req.body;

    if (!client_id || !vehicle_id || !date_debut || !date_fin || !prix) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const reservation = await prisma.reservation.create({
      data: {
        client_id: BigInt(client_id),
        vehicle_id: BigInt(vehicle_id),
        date_debut: new Date(date_debut),
        date_fin: new Date(date_fin),
        prix,
        nombre_jours,
        status: "CONFIRMED",
      },
    });

    // ✅ الحل ديال BigInt هنا
    const formatted = {
      ...reservation,
      id: reservation.id.toString(),
      client_id: reservation.client_id.toString(),
      vehicle_id: reservation.vehicle_id.toString(),
    };

    res.status(201).json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error creating reservation",
      details: err.message,
    });
  }
};


//get all reservations for a client
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // 🔥 fix BigInt
    const formatted = {
      ...reservation,
      id: reservation.id.toString(),
      client_id: reservation.client_id.toString(),
      vehicle_id: reservation.vehicle_id.toString(),
    };

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error fetching reservation",
      details: err.message,
    });
  }
};