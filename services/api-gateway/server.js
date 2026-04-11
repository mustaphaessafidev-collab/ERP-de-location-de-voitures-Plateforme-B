import app from "./app.js";

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`\n═══════════════════════════════════════════`);
  console.log(`✓ API Gateway running on port ${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`═══════════════════════════════════════════\n`);
});

// Handle server errors
server.on("error", (err) => {
  console.error("[API GATEWAY] Server Error:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("[API GATEWAY] Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("[API GATEWAY] Unhandled Rejection at:", promise, "reason:", reason);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[API GATEWAY] SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("[API GATEWAY] HTTP server closed");
    process.exit(0);
  });
});



