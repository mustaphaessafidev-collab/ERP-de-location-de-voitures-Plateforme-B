# Auth API: Node.js + TypeScript + Prisma (PostgreSQL) + EJS email templates
# Required env at runtime: DATABASE_URL, JWT_SECRET
# Optional: PORT, JWT_EXPIRES_IN, RESET_TOKEN_EXPIRES_MINUTES, MAIL_*, APP_BASE_URL, FRONTEND_URL

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install

# Prisma schema and config (Prisma 7 may use prisma.config.ts)
COPY prisma ./prisma/
COPY prisma.config.ts* ./
RUN npx prisma generate

# TypeScript and source (includes src/templates/*.ejs)
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

# Prisma generated client and schema (for reference / migrate)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Built app and EJS templates (welcome, reset-password, validate-email, email)
COPY --from=builder /app/dist ./dist

EXPOSE 8000

# Run migrations externally: docker run ... npx prisma migrate deploy
# Then start the server (or use a separate init container for migrate)
CMD ["node", "dist/server.js"]
