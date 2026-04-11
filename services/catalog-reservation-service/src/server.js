import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reservationRoutes from "./routes/reservationRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[RESERVATION SERVICE] ${req.method} ${req.path}`);
  next();
});

app.use("", reservationRoutes);

app.get("/", (req, res) => {
  res.send("Reservation Service Running 🚀");
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`[RESERVATION SERVICE] Running on port ${PORT}`);
});

export default app;