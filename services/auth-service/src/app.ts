import express from "express";
import cors from "cors";
import { apiRouter } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import morgan from "morgan";
import { httpErrorHandler } from "./middlewares/httpErrorHandler";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", apiRouter);

  



  app.use(errorHandler);
  app.use(httpErrorHandler);

  return app;
}

