import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import { GET_USER_BY_EMAIL, GET_USER_BY_ID } from "../mysql/queries";
import { INSERT_USER_STATEMENT } from "../mysql/mutation";
import bcrypt from "bcrypt";

//resuable func
const getUserBy = async (by: "email" | "id", value: string) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      by === "id" ? GET_USER_BY_ID : GET_USER_BY_EMAIL,
      [value]
    );

    console.log("result of user", result);
    //@ts-ignore
    const user = result[0]?.[0];
    console.log("user retrieved =", user);
    return user;
  } catch (err) {
    console.log("error while retrieving the user", err);
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "invalid User" });
    }

    const user = getUserBy("id", id);
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    return res.status(200).json({ message: "user retrieved", user });
  } catch (error) {
    console.log("Error occured = ", error);
    res
      .status(500)
      .json({ message: "unexpected error happened , try again later " });
    throw error;
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({
        message: "data messing",
      });
    }

    const user = await getUserBy("email", email);
    //@ts-ignore
    if (user) {
      return res.status(401).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    const result = await conn.query(INSERT_USER_STATEMENT, [
      name,
      email,
      hashedPassword,
    ]);

    return res
      .status(200)
      .json({ message: "user created successfully", user: result });
  } catch (error) {
    console.log("Error occured = ", error);
    res
      .status(500)
      .json({ message: "unexpected error happened , try again later " });
    throw error;
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({
        message: "data messing",
      });
    }

    const user = await getUserBy("email", email);
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    // wrong password status
    //@ts-ignore
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "incorrect password ",
      });
    }

    return res.status(200).json({ message: "login successfully", user });
  } catch (error) {
    console.log("Error occured = ", error);
    res
      .status(500)
      .json({ message: "unexpected error happened , try again later " });
    throw error;
  }
};

export { getUser, registerUser, loginUser };
