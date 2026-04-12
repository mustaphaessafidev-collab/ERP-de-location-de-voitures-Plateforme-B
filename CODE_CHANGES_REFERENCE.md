# 📖 Code Changes Reference

## 🔧 Backend Changes

### 1. **Reservation Routes** (`services/catalog-reservation-service/src/routes/reservationRoutes.js`)

**What Changed**: 
- Added `/api` prefix to all routes
- Added new route for getting user reservations
- Added import for getUserReservations controller

**Before**:
```javascript
router.post("/", createReservation);
router.get("/:id", getReservationById); 
```

**After**:
```javascript
// Create reservation
router.post("/api/reservations", createReservation);

// Get single reservation by ID
router.get("/api/reservations/:id", getReservationById);

// Get all reservations for a specific user
router.get("/api/reservations/user/:userId", getUserReservations);
```

---

### 2. **Reservation Controller** (`services/catalog-reservation-service/src/controllers/reservationController.js`)

**What Changed**:
- Added `formatReservation()` helper function
- Refactored `createReservation()` with better validation
- **NEW**: Added `getUserReservations()` function

**New Functions Added**:

```javascript
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
 * Get all reservations for a specific user
 * GET /api/reservations/user/:userId
 */
export const getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "Missing userId parameter",
      });
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        client_id: BigInt(userId),
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formatted = reservations.map(formatReservation);
    res.json(formatted);
  } catch (err) {
    console.error("[RESERVATION SERVICE] Error fetching user reservations:", err);
    res.status(500).json({
      error: "Error fetching reservations",
      details: err.message,
    });
  }
};
```

---

## 🎨 Frontend Changes

### 1. **Reservation API Service** (`Frontend/src/services/reservation.js`)

**What Changed**:
- Updated base URL to use API Gateway
- Added new function: `getUserReservations(userId)`
- Added proper error handling and logging
- Kept existing functions for compatibility

**New Functions Added**:

```javascript
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || "http://localhost:4000";

/**
 * Get all reservations for a user
 * GET /api/reservations/user/:userId
 */
export async function getUserReservations(userId) {
  try {
    const { data } = await client.get(`/api/reservations/user/${userId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching reservations for user ${userId}:`, error);
    throw error;
  }
}
```

---

### 2. **Reservation.jsx** (`Frontend/src/components/reservation/Reservation.jsx`)

**What Changed**:
- Updated imports to use new API service
- Simplified `handleConfirm()` function
- Now uses `createReservation()` from API service instead of direct axios

**Before**:
```javascript
const response = await axios.post(
  "http://localhost:4000/api/reservations",
  reservationPayload
);
```

**After**:
```javascript
import { createReservation } from "../../services/reservation";

// In handleConfirm():
const reservation = await createReservation(reservationPayload);
```

---

### 3. **Dashboard.jsx** (`Frontend/src/components/dashboard/Dashboard.jsx`)

**What Changed**:
- Added import for `getUserReservations`
- Complete rewrite of `fetchReservations()` function
- Updated table to display correct field names
- Fixed stats calculation

**Before**:
```javascript
const fetchReservations = async () => {
  const response = await fetch(
    `http://localhost:8000/api/reservations/my?email=${userEmail}`,
    // ...
  );
  const data = await response.json();
  const total = data.reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0);
};
```

**After**:
```javascript
import { getUserReservations } from "../../services/reservation";

const fetchReservations = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  
  if (!userId) return;

  const data = await getUserReservations(userId);
  const total = data.reduce((sum, r) => sum + (parseFloat(r.prix) || 0), 0);
};
```

**Table Display Updates**:

```javascript
// Before:
booking.vehicle?.name || "Unknown Vehicle"
booking.vehicle?.plate_number
booking.start_date
booking.end_date
booking.total_price

// After:
Vehicle #{booking.vehicle_id}
Reservation #{booking.id}
booking.date_debut
booking.date_fin
booking.prix
```

---

### 4. **HistoryPage.jsx** (`Frontend/src/components/dashboard/HistoryPage.jsx`)

**What Changed**:
- Added import for `getUserReservations`
- Complete rewrite of `fetchAllReservations()` function
- Updated table to display correct field names
- Fixed stats calculation

**Before**:
```javascript
const fetchAllReservations = async () => {
  const response = await fetch(`http://localhost:8000/api/reservations/my?email=${userEmail}`, {
    // ...
  });
  const data = await response.json();
  setReservations(data.reverse());
};
```

**After**:
```javascript
import { getUserReservations } from "../../services/reservation";

const fetchAllReservations = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  
  if (!userId) return;

  const data = await getUserReservations(userId);
  setReservations(data || []);
};
```

**Table Display Updates**:

```javascript
// Before:
reservation.vehicle?.image_url
reservation.vehicle?.name
reservation.start_date
reservation.end_date
reservation.total_price

// After:
Car icon (placeholder)
Vehicle #{reservation.vehicle_id}
reservation.date_debut
reservation.date_fin
reservation.prix
reservation.nombre_jours
```

---

## 🗄️ Database Schema

**File**: `services/catalog-reservation-service/prisma/schema.prisma`

**No changes needed** - Schema already had all required fields:

```prisma
model Reservation {
  id            BigInt   @id @default(autoincrement())
  client_id     BigInt
  vehicle_id    BigInt
  prix          Float
  status        String   @default("CONFIRMED")
  date_debut    DateTime
  date_fin      DateTime
  nombre_jours  Int
  created_at    DateTime @default(now())
}
```

---

## 🔄 Data Flow

### Creating a Reservation

```
Frontend (Reservation.jsx)
    ↓
handleConfirm() {
  await createReservation({
    client_id,
    vehicle_id,
    date_debut,
    date_fin,
    prix,
    nombre_jours
  })
}
    ↓
POST http://localhost:4000/api/reservations
    ↓
API Gateway (routes to) 
    ↓
POST http://localhost:5003/api/reservations
    ↓
reservationController.createReservation()
    ↓
prisma.reservation.create({data})
    ↓
PostgreSQL saves record
    ↓
formatReservation(reservation)
    ↓
Return JSON response (with IDs as strings)
    ↓
Frontend shows success notification
```

### Fetching User Reservations

```
Frontend (Dashboard.jsx or HistoryPage.jsx)
    ↓
fetchReservations() {
  const userId = localStorage.getItem("user").id
  await getUserReservations(userId)
}
    ↓
GET http://localhost:4000/api/reservations/user/:userId
    ↓
API Gateway (routes to)
    ↓
GET http://localhost:5003/api/reservations/user/:userId
    ↓
reservationController.getUserReservations()
    ↓
prisma.reservation.findMany({
  where: { client_id: userId },
  orderBy: { created_at: "desc" }
})
    ↓
Format all results with formatReservation()
    ↓
Return JSON array
    ↓
Frontend renders in table
```

---

## 🌍 Environment Configuration

### Backend
**File**: `services/catalog-reservation-service/.env`
```env
DATABASE_URL=postgresql://user:password@localhost:5432/erp_db
PORT=5003
```

### Frontend
**File**: `Frontend/.env` (or `.env.local`)
```env
VITE_GATEWAY_URL=http://localhost:4000
VITE_API_URL=http://localhost:8000/api
```

---

## ✅ Field Mapping Reference

| Reservation Model | Frontend Uses | Display Label |
|-------------------|---------------|---------------|
| `id` | `reservation.id` | Reservation #123 |
| `client_id` | `userId` (from localStorage) | (hidden) |
| `vehicle_id` | `vehicle_id` | Vehicle #45 |
| `prix` | `reservation.prix` | $1,250.50 |
| `status` | `reservation.status` | CONFIRMED |
| `date_debut` | `reservation.date_debut` | Apr 15 |
| `date_fin` | `reservation.date_fin` | Apr 20 |
| `nombre_jours` | `reservation.nombre_jours` | 5 days |
| `created_at` | `reservation.created_at` | (metadata) |

---

## 🐛 Common Issues & Fixes

### Issue: "Missing required fields" error

**Cause**: Client sending wrong field names

**Fix**: Use exact names from Prisma schema
- ✅ `date_debut` not `startDate`
- ✅ `date_fin` not `endDate`
- ✅ `prix` not `totalPrice`
- ✅ `nombre_jours` not `days`

### Issue: "TypeError: Cannot read property 'toLocaleString' of undefined"

**Cause**: Date field is null or undefined in database

**Fix**: Ensure dates are stored as DateTime
- Check database: `SELECT * FROM "Reservation"`
- Verify `date_debut` and `date_fin` are not NULL
- Run migration: `npx prisma migrate dev`

### Issue: BigInt serialization errors

**Cause**: JavaScript can't serialize BigInt to JSON directly

**Fix**: Already handled by `formatReservation()` helper
```javascript
const formatReservation = (reservation) => ({
  ...reservation,
  id: reservation.id.toString(),
  client_id: reservation.client_id.toString(),
  vehicle_id: reservation.vehicle_id.toString(),
});
```

---

## 🚀 Deployment Checklist

- [ ] Backend Reservation Service running on port 5003
- [ ] API Gateway running on port 4000
- [ ] Database migrations applied
- [ ] Frontend environment variables set
- [ ] CORS enabled on all services
- [ ] Database user has correct permissions
- [ ] All services have correct DATABASE_URL
- [ ] Frontend can authenticate users
- [ ] localStorage saves user object with id

---

## 📞 Support

For issues or questions:
1. Check [QUICK_START_TESTING.md](./QUICK_START_TESTING.md)
2. Review service logs (check console.log outputs)
3. Test API endpoints directly with cURL/Postman
4. Verify database connection and records

