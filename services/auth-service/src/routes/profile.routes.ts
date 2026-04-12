import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const profileRouter = Router();

profileRouter.get("/profile", requireAuth, authController.getProfile);
profileRouter.put("/personal-info", requireAuth, authController.updatePersonalInfo);
profileRouter.put("/photo", requireAuth, authController.updateProfilePhoto);
profileRouter.put("/password", requireAuth, authController.updatePasswordForAuthenticatedUser);
profileRouter.put("/license", requireAuth, authController.upsertDrivingLicense);
