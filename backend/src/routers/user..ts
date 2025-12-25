import { Router } from "express";
import { registerUser, getUser, loginUser } from "../handlers/user-handler";

const usersRouter = Router();

usersRouter.get("/:id", getUser);
usersRouter.post("/register", registerUser);
usersRouter.post("/login", loginUser);

export default usersRouter;
