# 🚀 Quick Start & Testing Guide

## ⚡ 5-Minute Setup

### Step 1: Verify Services Are Running

```bash
# Terminal 1: Frontend
cd Frontend
npm run dev
# Should be on http://localhost:5173

# Terminal 2: Reservation Service
cd services/catalog-reservation-service
npm run dev
# Should be on http://localhost:5003
# Output: [RESERVATION SERVICE] Running on port 5003

# Terminal 3: API Gateway
cd services/api-gateway
npm run dev
# Should be on http://localhost:4000
# Output: Gateway running on port 4000

# Terminal 4: Auth Service (for user authentication)
cd services/auth-service
npm run dev
# Should be on http://localhost:8000
```

### Step 2: Database Setup

```bash
# In services/catalog-reservation-service
npx prisma migrate dev --name init
# Or push schema:
npx prisma db push
```

### Step 3: Login to Frontend

1. Go to http://localhost:5173
2. Click "Login" or "Register"
3. Enter credentials
4. **IMPORTANT**: Check browser's Local Storage
   - Verify `user` object exists with `id` field
   - Verify `userEmail` exists
   - Verify `token` exists

---

## 🧪 Complete Test Flow

### Test Case 1: Create Reservation

#### Step 1: Navigate to Vehicle Details
```
1. Go to: http://localhost:5173/VehicleDetail/1
2. You should see vehicle details with BookingCard
```

#### Step 2: Fill Booking Card
```
1. Click "Date de prise en charge" input
2. Select a date (e.g., 2024-04-20)
3. Click "Date de retour" input
4. Select a date > 2024-04-20 (e.g., 2024-04-25)
5. Optionally select insurance/child seat
6. Click "CONTINUER" button

Expected: Navigate to /booking-review page
```

#### Step 3: Confirm Reservation
```
1. On ReservationPage, review details
2. Click "Confirm" button
3. Wait for loading...

Expected Output (Console):
[FRONTEND] === Reservation Confirm ===
[FRONTEND] User ID: 1
[FRONTEND] Reservation Payload: {...}
[FRONTEND] ✅ Reservation created: {id: "123", ...}

UI Changes:
✅ Green success notification appears
✅ Reservation ID shown in top badge
✅ Status shows "Confirmed"
```

#### Step 4: Verify in Database
```bash
# Open PostgreSQL
psql -U [user] -d [database]

# Query
SELECT * FROM "Reservation" WHERE client_id = 1 ORDER BY created_at DESC LIMIT 1;

# Should show:
id          | client_id | vehicle_id | prix      | status     | date_debut | date_fin
123         | 1         | 45         | 1250.50   | CONFIRMED  | 2024-04-20 | 2024-04-25
```

---

### Test Case 2: Dashboard Shows Reservation

#### Step 1: Navigate to Dashboard
```
1. Go to: http://localhost:5173/dashboard
2. Wait for page to load

Expected: Recent Bookings table shows your reservation
```

#### Step 2: Verify Data Display
```
Expected Table Content:
─────────────────────────────────────────────
Vehicle      | Dates              | Duration | Total  | Status
─────────────────────────────────────────────
Vehicle #45  | Apr 20 to Apr 25   | 5 days   | 1250.50| Confirmed
─────────────────────────────────────────────
```

#### Step 3: Verify Stats
```
Expected Stats Cards:
• Active Rentals: 1
• Upcoming Bookings: 0
• Total Spent: $1,250.50
```

#### Step 4: Check Console Logs
```
[DASHBOARD] Fetching reservations for userId: 1
[DASHBOARD] ✅ Received reservations: [...]
[DASHBOARD] Stats: {activeRentals: 1, upcomingBookings: 0, totalSpent: "1250.50"}
```

---

### Test Case 3: History Page Shows All Reservations

#### Step 1: Navigate to History
```
1. Go to: http://localhost:5173/history
2. Wait for page to load

Expected: Shows all your reservations
```

#### Step 2: Create Multiple Reservations (for testing)
```
1. Go back to /VehicleDetail/1
2. Create 3+ different reservations with different dates
3. Go back to /history
```

#### Step 3: Verify All Shown
```
Expected: All 3+ reservations appear in table
- Should show pagination (if >10)
- Search bar should filter by vehicle ID or reservation ID
```

---

### Test Case 4: Direct API Testing

#### Using cURL

```bash
# 1. Create Reservation
curl -X POST http://localhost:4000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "1",
    "vehicle_id": "5",
    "date_debut": "2024-04-22",
    "date_fin": "2024-04-27",
    "prix": 1500,
    "nombre_jours": 5
  }'

# Expected Response (201):
{
  "id": "124",
  "client_id": "1",
  "vehicle_id": "5",
  "prix": 1500,
  "status": "CONFIRMED",
  "date_debut": "2024-04-22T00:00:00.000Z",
  "date_fin": "2024-04-27T00:00:00.000Z",
  "nombre_jours": 5,
  "created_at": "2024-04-12T14:30:00.000Z"
}

# 2. Get User Reservations
curl http://localhost:4000/api/reservations/user/1

# Expected Response (200): Array of all user's reservations

# 3. Get Single Reservation
curl http://localhost:4000/api/reservations/124

# Expected Response (200): Single reservation object
```

#### Using Postman

1. **Create Request**
   - Method: POST
   - URL: http://localhost:4000/api/reservations
   - Headers: Content-Type: application/json
   - Body (JSON):
   ```json
   {
     "client_id": "1",
     "vehicle_id": "5",
     "date_debut": "2024-04-22",
     "date_fin": "2024-04-27",
     "prix": 1500,
     "nombre_jours": 5
   }
   ```

2. **Get User Reservations**
   - Method: GET
   - URL: http://localhost:4000/api/reservations/user/1
   - Should return array of reservations

---

## 🔍 Debugging Checklist

### Issue: API returns 400 (Bad Request)

```
❌ Response: {"error": "Missing required fields: ..."}

✅ Fix:
- Verify all fields are present
- Ensure date format is YYYY-MM-DD
- Ensure prix is a number
- Ensure client_id and vehicle_id are strings or numbers
```

### Issue: API returns 404 (Not Found)

```
❌ Response: {"error": "Reservation with ID ... not found"}

✅ Fix:
- Verify the reservation ID is correct
- Check database if record exists
```

### Issue: Frontend shows "No bookings yet"

```
✅ Diagnostic Steps:
1. Open DevTools (F12)
2. Go to Storage → Local Storage
3. Check if "user" object exists
4. Check if "user.id" has a value
5. Check Console for [DASHBOARD] logs
6. Verify Reservation Service is running (port 5003)
7. Make a test request to /api/reservations/user/1
```

### Issue: CORS Errors

```
❌ Error in console: "Access to XMLHttpRequest blocked by CORS policy"

✅ Fix:
- Check API Gateway has CORS enabled
- Verify correct API_URL in .env
- Check service is allow CORS headers
```

### Issue: Database Connection Error

```
❌ Error: "Error: connect ECONNREFUSED 127.0.0.1:5432"

✅ Fix:
- Start PostgreSQL: sudo systemctl start postgresql (Linux) or brew services start postgresql (Mac)
- Verify DATABASE_URL in .env
- Check database exists
- Run: psql -u [user] -d [database]
```

---

## 📊 Success Criteria

### ✅ System is Working if:

1. **Create Reservation**
   - [✓] POST /api/reservations returns 201 with reservation ID
   - [✓] Frontend shows success notification
   - [✓] Record appears in database

2. **Dashboard Shows Data**
   - [✓] /dashboard loads reservation data
   - [✓] Recent Bookings table has data
   - [✓] Stats cards show correct numbers
   - [✓] No "No bookings yet" message (if reservations exist)

3. **History Shows Data**
   - [✓] /history loads all reservations
   - [✓] Table displays all records
   - [✓] Pagination works for >10 records
   - [✓] Search/filter works (optional)

4. **API Works**
   - [✓] GET /api/reservations/user/:id returns array
   - [✓] GET /api/reservations/:id returns single record
   - [✓] All responses include proper BigInt serialization (strings for IDs)

---

## 📝 Test Results Template

```
Date: _______________
Tester: _____________
Browser: ____________

Test Case 1: Create Reservation
Status: [  ] PASS [  ] FAIL
Notes: _____________________________________

Test Case 2: Dashboard Display
Status: [  ] PASS [  ] FAIL
Notes: _____________________________________

Test Case 3: History Page
Status: [  ] PASS [  ] FAIL
Notes: _____________________________________

Test Case 4: API Endpoints
Status: [  ] PASS [  ] FAIL
Notes: _____________________________________

Overall: [  ] WORKING [  ] NEEDS FIX
```

---

## 🎯 Performance Notes

- ✅ Queries use indexes on client_id
- ✅ Frontend caches user data in localStorage
- ✅ API Gateway routes efficiently
- ✅ Prisma handles connection pooling
- ✅ No N+1 queries (fetches only reservation data, not vehicles)

---

## 📚 Related Files

- [RESERVATION_SYSTEM_GUIDE.md](./RESERVATION_SYSTEM_GUIDE.md) - Complete technical documentation
- [Backend Routes](./services/catalog-reservation-service/src/routes/reservationRoutes.js)
- [Controller](./services/catalog-reservation-service/src/controllers/reservationController.js)
- [Frontend Service](./Frontend/src/services/reservation.js)
- [Dashboard Component](./Frontend/src/components/dashboard/Dashboard.jsx)
- [History Component](./Frontend/src/components/dashboard/HistoryPage.jsx)
- [Reservation Page](./Frontend/src/components/reservation/Reservation.jsx)

