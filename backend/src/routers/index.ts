import { Router } from "express";
import usersRouter from "./user.";
import validationRouter from "./validation";

const appRouter = Router();

// router for handling user authentication
appRouter.use("/user", usersRouter);
appRouter.use("/validate", validationRouter);

export default appRouter;
