import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.register(req.body);
      res.status(203).json();
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
};
