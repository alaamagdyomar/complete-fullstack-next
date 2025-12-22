import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import { GET_USER_BY_ID } from "../mysql/queries";
import { INSERT_USER_STATEMENT } from "../mysql/mutation";

const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "invalid User" });
    }

    const conn = await pool.getConnection();
    const result = await conn.query(GET_USER_BY_ID, [id]);
    console.log("user retrieved =", result);

    return res.status(200).json({ message: "user retrieved", user: result });
  } catch (error) {
    console.log("Error occured = ", error);
    res
      .status(500)
      .json({ message: "unexpected error happened , try again later " });
    throw error;
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(422).json({
        message: "data messing",
      });
    }

    const conn = await pool.getConnection();
    const result = await conn.query(INSERT_USER_STATEMENT, [
      name,
      email,
      password,
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

export { getUser, createUser };
