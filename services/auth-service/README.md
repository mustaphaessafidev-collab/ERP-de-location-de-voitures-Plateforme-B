# Auth API

REST API for user authentication and account management: registration, login, password reset, and password update. Built with Node.js, Express, TypeScript, Prisma, and a layered architecture.

---

## Features

- **User registration** – Create account with full name, CIN, phone, email, address, and password; sends email verification link
- **Email verification** – Validate email via token; after validation, welcome email is sent; login is blocked until email is verified
- **Login** – Authenticate with email and password; returns JWT (forbidden if email not validated)
- **Forgot password** – Request a reset token by email
- **Reset password** – Set a new password using the reset token
- **Update password** – Change password by providing email and current password
- **Data validation** – Email length (max 255), password strength (min 8 chars, uppercase, lowercase, special character)
- **Security** – Passwords hashed with bcrypt; JWT for authenticated sessions
- **reCAPTCHA** – Optional middleware on register, login, and forgot-password (v2/v3); server-side verification via Google siteverify
- **Mail service** – Global sender; optional SMTP; EJS templates (welcome, reset-password, validate-email)
- **Layered architecture** – Routes → Controllers → Services → Repositories

---

## Tech Stack

| Layer        | Technology        |
|-------------|-------------------|
| Runtime     | Node.js           |
| Language    | TypeScript        |
| Framework   | Express           |
| Database    | PostgreSQL        |
| ORM         | Prisma            |
| Validation  | Zod               |
| Auth        | JWT (jsonwebtoken)|
| Passwords   | bcrypt            |

---

## Project Structure (Layered Architecture)

```
src/
├── config/          # Environment, Prisma client
├── middlewares/     # Error handler, JWT auth, reCAPTCHA
├── routes/          # API route definitions
├── controllers/     # HTTP request/response handling
├── services/        # Business logic & validation
├── repositories/    # Database access (Prisma)
├── validators/      # Zod schemas
├── app.ts           # Express app setup
└── server.ts        # Server entry point
prisma/
└── schema.prisma    # Data models
```

---

## Data Model (Entity)

### User

| Field             | Type     | Constraints   |
|-------------------|----------|---------------|
| id                | Int      | PK, auto      |
| nom_complet       | String   | Required      |
| cin               | String   | Unique        |
| telephone         | String   | Required      |
| email             | String   | Unique        |
| adresse           | String?  | Optional      |
| password          | String   | Hashed        |
| isEmailValidated  | Boolean? | Optional      |
| created_at        | DateTime | Default now   |
| updatedAt         | DateTime | Auto-updated  |

Login is allowed only when `isEmailValidated === true`.

### EmailVerificationToken

| Field      | Type     | Constraints   |
|------------|----------|---------------|
| id         | Int      | PK, auto      |
| userId     | Int      | FK → User     |
| token      | String   | Unique        |
| expiresAt  | DateTime | Required      |

### PasswordResetToken

Used for the forgot/reset password flow: `token`, `email`, `expiresAt`, `userId`.

---

## Validation Rules

- **Email**: Valid format, max **255** characters.
- **Password** (register, reset, update):
  - Minimum **8** characters
  - At least **one uppercase** letter
  - At least **one lowercase** letter
  - At least **one special character** (e.g. `!@#$%^&*()_+-=[]{};':"|,.<>/?`)

---

## API Reference

Base URL: `http://localhost:3000/api`

### Health

| Method | Endpoint   | Description |
|--------|------------|-------------|
| GET    | /health    | Server health check (no `/api` prefix) |

### Auth

| Method | Endpoint                    | Description                                      |
|--------|-----------------------------|--------------------------------------------------|
| POST   | /api/auth/register          | Register a new user (sends email verification)  |
| POST   | /api/auth/validate-email    | Validate email using verification token         |
| POST   | /api/auth/login             | Login; returns user + JWT (blocked if unverified) |
| POST   | /api/auth/forgot-password   | Request password reset token                    |
| POST   | /api/auth/reset-password    | Set new password with token                     |
| PUT    | /api/auth/update-password   | Change password by email + current password     |

When `RECAPTCHA_ENABLED=true`, include `recaptchaToken` in the body for **register**, **login**, and **forgot-password** (token from your frontend reCAPTCHA v2/v3 widget).

### Users (read-only, no password in response)

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| GET    | /api/users    | List all users     |
| GET    | /api/users/:id| Get user by ID     |

---

## Request / Response Examples

### Register

**Request**

```http
POST /api/auth/register
Content-Type: application/json

{
  "nom_complet": "Ahmed Ali",
  "cin": "AB123456",
  "telephone": "0612345678",
  "email": "user@example.com",
  "adresse": "Casablanca",
  "password": "MyPass@1",
  "confirmPassword": "MyPass@1",
  "recaptchaToken": "optional-when-RECAPTCHA_ENABLED-true"
}
```

**Response** `201 Created`

```json
{
  "user": {
    "id": 1,
    "nom_complet": "Ahmed Ali",
    "cin": "AB123456",
    "telephone": "0612345678",
    "email": "user@example.com",
    "adresse": "Casablanca",
    "isEmailValidated": null,
    "created_at": "2025-03-15T00:00:00.000Z",
    "updatedAt": "2025-03-15T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

After registration, a verification email is sent. The user must validate their email before logging in.

### Validate email

**Request**

```http
POST /api/auth/validate-email
Content-Type: application/json

{
  "token": "verification-token-from-email-link"
}
```

**Response** `200 OK`

```json
{
  "message": "Email validated successfully",
  "user": { "id": 1, "nom_complet": "Ahmed Ali", "isEmailValidated": true, ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

A welcome email is sent after successful validation.

### Login

Login returns **403** if the user's email is not yet validated (`Please verify your email before logging in`).

**Request**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "MyPass@1"
}
```

**Response** `200 OK`

```json
{
  "user": { "id": 1, "nom_complet": "Ahmed Ali", "cin": "AB123456", "telephone": "0612345678", "email": "user@example.com", "adresse": "Casablanca", "created_at": "...", "updatedAt": "..." },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Forgot password

**Request**

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response** `200 OK`

```json
{
  "message": "If the email exists, a reset link will be sent.",
  "resetToken": "a1b2c3d4e5f6..."
}
```

*(In production, send the token by email instead of returning it.)*

### Reset password

**Request**

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "a1b2c3d4e5f6...",
  "password": "NewPass@1"
}
```

**Response** `200 OK`

```json
{
  "message": "Password reset successfully"
}
```

### Update password (by email + current password)

**Request**

```http
PUT /api/auth/update-password
Content-Type: application/json

{
  "email": "user@example.com",
  "currentPassword": "MyPass@1",
  "newPassword": "NewPass@1"
}
```

**Response** `200 OK`

```json
{
  "message": "Password updated successfully"
}
```

---

## Error Responses

| Status | Meaning        | Example message                                           |
|--------|----------------|-----------------------------------------------------------|
| 400    | Validation     | `"Validation failed"` + `errors` array                    |
| 400    | Bad request    | `"Invalid or expired reset token"`, `"Invalid or expired verification token"`, `"reCAPTCHA verification failed. Please try again."` |
| 401    | Unauthorized   | `"Invalid email or password"`                             |
| 403    | Forbidden      | `"Please verify your email before logging in"`            |
| 404    | Not found      | `"User not found"`                                        |
| 409    | Conflict       | `"Email already registered"`, `"CIN already registered"`  |
| 500    | Server error   | Generic or message from thrown error                      |

---

## Security

- **Passwords**: Stored as bcrypt hashes (salt rounds: 10). Never returned in API responses.
- **JWT**: Issued on register and login. Use `Authorization: Bearer <token>` for protected routes.
- **Email verification**: Login is blocked until the user validates their email via the link sent after registration.
- **reCAPTCHA**: When `RECAPTCHA_ENABLED=true`, the `recaptchaMiddleware` runs on register, login, and forgot-password and requires a valid `recaptchaToken` in the request body. Server verifies the token with Google's siteverify API; on failure it responds with 400 and does not call the route handler.
- **Optional middleware**: `requireAuth` in `src/middlewares/auth.middleware.ts` can be attached to routes that require a valid JWT.

---

## Environment Variables

Create a `.env` file at the project root:

```env
# Required
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET=your-secret-key

# Optional
PORT=8000
JWT_EXPIRES_IN=7d
RESET_TOKEN_EXPIRES_MINUTES=60

# URLs (used in emails and links)
APP_BASE_URL=http://localhost:8000          # Backend public URL (for generic links)
FRONTEND_URL=http://localhost:3000          # Frontend URL (for reset/validate email links)

# Mail (optional; if not set, reset token may be returned in API response for dev)
MAIL_ENABLED=true
MAIL_FROM_NAME="Noreply"
MAIL_FROM_EMAIL="noreply@example.com"

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=

# reCAPTCHA (optional; when enabled, register/login/forgot-password require recaptchaToken in body)
RECAPTCHA_ENABLED=false
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

---

## Setup & Run

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Install and database

```bash
npm install
```

Add `DATABASE_URL` (and optionally `JWT_SECRET`, etc.) to `.env`, then:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Development

```bash
npm run dev
```

Server runs at `http://localhost:3000` (or the port set in `PORT`).

### Build and production

```bash
npm run build
npm start
```

### Scripts

| Script             | Description                |
|--------------------|----------------------------|
| `npm run dev`      | Start dev server (ts-node-dev) |
| `npm run build`    | Compile TypeScript to `dist/`   |
| `npm start`       | Run compiled app               |
| `npm run deploy`   | Build + generate Prisma client (production prep) |
| `npm run prisma:generate` | Generate Prisma client   |
| `npm run prisma:migrate`  | Run migrations (dev)     |

---

## Deploy

### Production build (VPS, VM, PaaS)

```bash
npm run deploy
```

Then set `DATABASE_URL`, `JWT_SECRET`, and `PORT` in the environment and run:

```bash
npx prisma migrate deploy
npm start
```

### Docker

Build and run the API in a container (default port 8000):

```bash
docker build -t auth-api .
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  -e FRONTEND_URL="https://your-frontend.com" \
  -e MAIL_ENABLED=true -e SMTP_HOST=... -e SMTP_USER=... -e SMTP_PASS=... \
  auth-api
```

Run migrations against your production DB before or after starting the container (e.g. on the host or in a one-off container):

```bash
npx prisma migrate deploy
```

---

## License

ISC
