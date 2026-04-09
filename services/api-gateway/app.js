import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "API Gateway is working" });
});

// Auth Service Proxy
app.use(
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    changeOrigin: true,
    pathFilter: ["/api/auth", "/api/user", "/api/validate", "/api/notifications"],
  })
);

// Review Service Proxy
app.use(
  createProxyMiddleware({
    target: process.env.REVIEW_SERVICE_URL || "http://localhost:3002",
    changeOrigin: true,
    pathFilter: ["/api/reviews"],
  })
);

//test github
// app.use(
//   "/api/reservations",
//   createProxyMiddleware({
//     target: process.env.AUTH_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: { "^/api/reservations": "/api/reservations" },
//   })
// );

// app.use(
//   "/api/notifications",
//   createProxyMiddleware({
//     target: process.env.AUTH_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: { "^/api/notifications": "/api/notifications" },
//   })
// );


// app.use(
//   "/api/tickets",
//   createProxyMiddleware({
//     target: process.env.TICKET_SERVICE_URL,
//     changeOrigin: true,
//   })
// );

// app.use(
//   "/api/admin",
//   createProxyMiddleware({
//     target: process.env.ADMIN_SERVICE_URL,
//     changeOrigin: true,
//   })
// );

// app.use(
//   "/api/ai",
//   createProxyMiddleware({
//     target: process.env.AI_SERVICE_URL,
//     changeOrigin: true,
//   })
// );

export default app;