import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { authRepository } from "../repositories/auth.repository";
import type { JwtPayload } from "../middlewares/auth.middleware";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.register(req.body);
      res.status(201).json({ message: "Registration check your email for verification" });
    } catch (e) {
      next(e);
    }
  },

  async validateEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.validateEmail(req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.updatePassword(req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = (req as Request & { user: JwtPayload }).user;
      if (!jwtPayload) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Fetch complete user data from database
      const user = await authRepository.findById(jwtPayload.sub);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (e) {
      next(e);
    }
  },
};
