import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const profileRouter = Router();

profileRouter.get("/profile", requireAuth, authController.getProfile);
