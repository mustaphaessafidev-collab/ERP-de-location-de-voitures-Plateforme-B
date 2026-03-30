import { Router } from "express";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);


    // apiRouter.use((err: unknown, req: Request, res: Response): Response => {
    // res.status(404).json({ message: "Route not found" });
    // });

