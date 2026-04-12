import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import "dotenv/config";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "API Gateway is working" });
});

// AUTH
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: `${process.env.AUTH_SERVICE_URL}/api/auth`,
    changeOrigin: true,
  })
);

// ADMIN
app.use(
  "/api/admin",
  createProxyMiddleware({
    target: process.env.ADMIN_SERVICE_URL,
    changeOrigin: true,
  })
);

// PROFILE
app.use(
  "/api/profile",
  createProxyMiddleware({
    target: `${process.env.AUTH_SERVICE_URL}/api/profile`,
    changeOrigin: true,
  })
);

// USERS
app.use(
  "/api/users",
  createProxyMiddleware({
    target: `${process.env.AUTH_SERVICE_URL}/api/users`,
    changeOrigin: true,
  })
);

// AGENTS
app.use(
  "/api/agents",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

// TICKETS
app.use(
  "/api/tickets",
  createProxyMiddleware({
    target: `${process.env.TICKET_SERVICE_URL}/api/tickets`,
    changeOrigin: true,
  })
);

// AI
app.use(
  "/api/ai",
  createProxyMiddleware({
    target: process.env.AI_SERVICE_URL,
    changeOrigin: true,
  })
);

// REVIEWS
app.use(
  "/api/reviews",
  createProxyMiddleware({
    target: `${process.env.REVIEW_SERVICE_URL}/api/reviews`,
    changeOrigin: true,
  })
);

// RESERVATIONS
app.use(
  "/api/reservations",
  createProxyMiddleware({
    target: `${process.env.RESERVATION_SERVICE_URL}/api/reservations`,
    changeOrigin: true,
  })
);

export default app;