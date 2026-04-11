import { Router } from "express";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";

import { profileRouter } from "./profile.routes";

import { reservationRouter } from "./reservation.routes";
import { notificationRouter } from "./notification.routes";


export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);

apiRouter.use("/profile", profileRouter);


apiRouter.use("/reservations", reservationRouter);
apiRouter.use("/notifications", notificationRouter);



    // apiRouter.use((err: unknown, req: Request, res: Response): Response => {
    // res.status(404).json({ message: "Route not found" });
    // });

