import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
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
      const profile = await authService.getProfile(jwtPayload.sub);
      res.json(profile);
    } catch (e) {
      next(e);
    }
  },

  async updatePasswordForAuthenticatedUser(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = (req as Request & { user: JwtPayload }).user;
      if (!jwtPayload) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await authService.updatePasswordForAuthenticatedUser(jwtPayload.sub, req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async updatePersonalInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = (req as Request & { user: JwtPayload }).user;
      if (!jwtPayload) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await authService.updatePersonalInfo(jwtPayload.sub, req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async upsertDrivingLicense(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = (req as Request & { user: JwtPayload }).user;
      if (!jwtPayload) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await authService.upsertDrivingLicense(jwtPayload.sub, req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async updateProfilePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = (req as Request & { user: JwtPayload }).user;
      if (!jwtPayload) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await authService.updateProfilePhoto(jwtPayload.sub, req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },
};
