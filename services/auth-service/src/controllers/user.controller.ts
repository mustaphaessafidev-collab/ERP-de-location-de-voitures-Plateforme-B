import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";

export const userController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.list();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await userService.getById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },
};
