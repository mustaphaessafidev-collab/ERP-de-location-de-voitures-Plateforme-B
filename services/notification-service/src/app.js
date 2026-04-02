import express from "express";
import cors from "cors";
import morgan from "morgan";
import notificationRoutes from "./routes/notificationRoutes.js";
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/notifications", notificationRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "notification-service",
  });
});

export default app;