import { Router } from "express";
import { createUser, getUser } from "../handlers/user-handler";

const usersRouter = Router();

usersRouter.get("/:id", getUser);
usersRouter.post("/new", createUser);

export default usersRouter;
