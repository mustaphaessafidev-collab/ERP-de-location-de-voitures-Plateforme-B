import { Router } from "express";
import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";
<<<<<<< HEAD
import { profileRouter } from "./profile.routes";
=======
import { reservationRouter } from "./reservation.routes";
import { notificationRouter } from "./notification.routes";
>>>>>>> 1a92cc264f276ccbf61ba251e8cad6efa348dcc2

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
<<<<<<< HEAD
apiRouter.use("/profile", profileRouter);

=======
apiRouter.use("/reservations", reservationRouter);
apiRouter.use("/notifications", notificationRouter);
>>>>>>> 1a92cc264f276ccbf61ba251e8cad6efa348dcc2


    // apiRouter.use((err: unknown, req: Request, res: Response): Response => {
    // res.status(404).json({ message: "Route not found" });
    // });

