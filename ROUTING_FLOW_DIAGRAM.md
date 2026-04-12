# 🎯 API Gateway → Reservation Service Routing Flow

## ✅ FIXED ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                             │
│                 http://localhost:5173                            │
│                                                                   │
│  User clicks "Book Car" → POST /api/reservations                │
│  Body: { client_id, vehicle_id, date_debut, date_fin, prix }   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Frontend sends POST
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API GATEWAY (Express)                           │
│                   http://localhost:4000                          │
│                                                                   │
│  Receives: POST /api/reservations                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ app.use("/api/reservations",                            │   │
│  │   createProxyMiddleware({                               │   │
│  │     target: "http://localhost:5003/api/reservations"   │   │
│  │   })                                                    │   │
│  │ )                                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Decision: Route /api/reservations to Service                   │
│                                                                   │
│  Forwards to: http://localhost:5003/api/reservations            │
│              (COMPLETE PATH - no stripping)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Gateway Proxy Forwards
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│         RESERVATION SERVICE (Node.js + Express)                 │
│           http://localhost:5003                                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Logging Middleware                                       │  │
│  │ console.log(`[RESERVATION SERVICE] ${req.method}...`)  │  │
│  │                                                          │  │
│  │ Output: [RESERVATION SERVICE] POST /api/reservations   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Router Mount Point                                       │  │
│  │ app.use("/api/reservations", reservationRoutes)         │  │
│  │                                                          │  │
│  │ Incoming path: /api/reservations                        │  │
│  │ Mount point: /api/reservations                          │  │
│  │ → Router sees remaining path: /                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Route Handler (Relative Path)                           │  │
│  │ router.post("/", createReservation)                     │  │
│  │                                                          │  │
│  │ Incoming path: /                                        │  │
│  │ Route pattern: /                                        │  │
│  │ → ✅ MATCH! Handler executes                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Controller (createReservation)                          │  │
│  │ • Validate input                                        │  │
│  │ • Create Prisma record                                  │  │
│  │ • Return JSON response                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Database (PostgreSQL)                                   │  │
│  │ INSERT INTO "Reservation"                               │  │
│  │ (client_id, vehicle_id, date_debut, date_fin, prix)    │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                   Response: 201 Created
                   Body: { id: "123", ... }
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                             │
│         Dashboard/History component receives data                │
│         Displays new reservation in table                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Path Breakdown

### GET /api/reservations/user/123

```
Gateway receives:
  /api/reservations/user/123
  
Target config:
  target: "http://localhost:5003/api/reservations"
  
Forwarded to:
  http://localhost:5003/api/reservations/user/123
  
Service mount point:
  /api/reservations
  
Router sees path:
  /user/123
  
Route handler:
  router.get("/user/:userId", getUserReservations)
  
Match: ✅ /user/:userId matches /user/123

Handler executes: getUserReservations(req, res)
```

---

## ❌ OLD (BROKEN) VS ✅ NEW (FIXED)

### POST /api/reservations Request

**❌ BEFORE - BROKEN:**
```
Frontend: POST /api/reservations
           ↓
Gateway target: http://localhost:5003
pathRewrite: ("^/api/reservations": "")
           ↓ (Path stripped to /)
Service receives: POST /
           ↓
app.use("/api/reservations", routes)
router.post("/api/reservations", ...)
           ↓
Service looking for: /api/reservations
Request path is: /
           ↓
❌ 404 NOT FOUND
```

**✅ NEW - FIXED:**
```
Frontend: POST /api/reservations
           ↓
Gateway target: http://localhost:5003/api/reservations
           ↓ (Full path included)
Service receives: POST /api/reservations
           ↓
app.use("/api/reservations", routes)
router.post("/", createReservation)
           ↓
Router mounts at: /api/reservations
Request path is: /api/reservations
Router sees relative: /
Route pattern: /
           ↓
✅ 201 CREATED
```

---

## 📋 Router Mount Point Logic

When you do `app.use("/api/reservations", router)`:

```
Original Request Path: /api/reservations
Mount Point: /api/reservations
Router removes mount point: /api/reservations - /api/reservations = /

Router then matches routes relative to this remaining path
```

Example with different paths:

```
Request: /api/reservations
Mount: /api/reservations
Router sees: /
Route pattern: router.post("/", ...)
Result: ✅ MATCH

---

Request: /api/reservations/user/1
Mount: /api/reservations
Router sees: /user/1
Route pattern: router.get("/user/:userId", ...)
Result: ✅ MATCH

---

Request: /api/reservations/123
Mount: /api/reservations
Router sees: /123
Route pattern: router.get("/:id", ...)
Result: ✅ MATCH
```

---

## 🎯 All Endpoints (Fixed)

| Frontend URL | Gateway | Service URL | Router Matches | Handler |
|---|---|---|---|---|
| POST /api/reservations | → | /api/reservations | "/" | router.post("/") |
| GET /api/reservations/1 | → | /api/reservations/1 | "/:id" | router.get("/:id") |
| GET /api/reservations/user/1 | → | /api/reservations/user/1 | "/user/:userId" | router.get("/user/:userId") |

---

## 🧪 Console Output (Expected)

```
Gateway sees:
  POST /api/reservations 201
  GET /api/reservations/user/1 200
  
Service logs:
  [RESERVATION SERVICE] POST /api/reservations
  [RESERVATION SERVICE] GET /api/reservations/user/1
```

**Why this is correct:**
- No duplicate `/api/reservations` paths
- No stripped paths showing just `/`
- URLs are consistent end-to-end
- Logging shows actual request paths

