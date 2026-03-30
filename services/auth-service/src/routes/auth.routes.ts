import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { recaptchaMiddleware } from "../middlewares/recaptcha.middleware";

export const authRouter = Router();

authRouter.post("/register", recaptchaMiddleware, authController.register);
authRouter.post("/validate-email", recaptchaMiddleware, authController.validateEmail);
authRouter.post("/login", recaptchaMiddleware, authController.login);
authRouter.post("/forgot-password", recaptchaMiddleware, authController.forgotPassword);
authRouter.post("/reset-password", recaptchaMiddleware, authController.resetPassword);
authRouter.put("/update-password", recaptchaMiddleware, authController.updatePassword);
