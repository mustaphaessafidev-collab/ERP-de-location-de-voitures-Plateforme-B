import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Helper: Format BigInt values for JSON response
 */
const formatReservation = (reservation) => ({
  ...reservation,
  id: reservation.id.toString(),
  client_id: reservation.client_id.toString(),
  vehicle_id: reservation.vehicle_id.toString(),
});

/**
 * Create a new reservation
 * POST /api/reservations
 */
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

    // Validate required fields
    if (!client_id || !vehicle_id || !date_debut || !date_fin || !prix) {
      return res.status(400).json({
        error: "Missing required fields: client_id, vehicle_id, date_debut, date_fin, prix are required",
      });
    }

    // Create reservation in database
    const reservation = await prisma.reservation.create({
      data: {
        client_id: BigInt(client_id),
        vehicle_id: BigInt(vehicle_id),
        date_debut: new Date(date_debut),
        date_fin: new Date(date_fin),
        prix: parseFloat(prix),
        nombre_jours: nombre_jours || 1,
        status: "CONFIRMED",
      },
    });

    console.log(
      `[RESERVATION SERVICE] ✅ Reservation ${reservation.id} created for client ${client_id}`
    );

    res.status(201).json(formatReservation(reservation));
  } catch (err) {
    console.error("[RESERVATION SERVICE] ❌ Error creating reservation:", err);
    res.status(500).json({
      error: "Error creating reservation",
      details: err.message,
    });
  }
};

/**
 * Get single reservation by ID
 * GET /api/reservations/:id
 */
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await prisma.reservation.findUnique({
      where: {
        id: BigInt(id),
      },
    });

    if (!reservation) {
      return res.status(404).json({
        error: `Reservation with ID ${id} not found`,
      });
    }

    console.log(`[RESERVATION SERVICE] ✅ Fetched reservation ${id}`);

    res.json(formatReservation(reservation));
  } catch (err) {
    console.error(
      "[RESERVATION SERVICE] ❌ Error fetching reservation:",
      err
    );
    res.status(500).json({
      error: "Error fetching reservation",
      details: err.message,
    });
  }
};

/**
 * Get all reservations for a specific user
 * GET /api/reservations/user/:userId
 */
export const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        error: "Missing userId parameter",
      });
    }

    // Fetch all reservations for this user, ordered by most recent first
    const reservations = await prisma.reservation.findMany({
      where: {
        client_id: BigInt(userId),
      },
      orderBy: {
        created_at: "desc",
      },
    });

    console.log(
      `[RESERVATION SERVICE] ✅ Fetched ${reservations.length} reservations for user ${userId}`
    );

    // Format BigInt values
    const formatted = reservations.map(formatReservation);

    res.json(formatted);
  } catch (err) {
    console.error(
      "[RESERVATION SERVICE] ❌ Error fetching user reservations:",
      err
    );
    res.status(500).json({
      error: "Error fetching reservations",
      details: err.message,
    });
  }
};