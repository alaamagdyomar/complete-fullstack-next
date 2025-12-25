import { Request, Response } from "express";
import { pool } from "../mysql/connection";
import { GET_USER_BY_EMAIL, GET_USER_BY_ID } from "../mysql/queries";
import { INSERT_USER_STATEMENT } from "../mysql/mutation";
import bcrypt from "bcrypt";
import { generateJWTToken, saveRefreshToken } from "../token/jwt-token-manager";
import { encryptData } from "../encryption";

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

const setCookies = (
  accessToken: string,
  refreshToken: string,
  res: Response
) => {
  res.clearCookie("access_token", {
    domain: "localhost",
    httpOnly: true,
    path: "/",
  });

  res.clearCookie("refresh_token", {
    domain: "localhost",
    httpOnly: true,
    path: "/",
  });

  const expiryAccessToken = new Date(new Date().getTime() + 60 * 60 * 1000);
  const expiryRefreshToken = new Date(
    new Date().getTime() + 7 * 24 * 60 * 60 * 1000
  );

  res.cookie("access_token", accessToken, {
    domain: "localhost",
    httpOnly: true,
    path: "/",
    expires: expiryAccessToken,
    sameSite: "lax",
  });

  res.cookie("refresh_token", refreshToken, {
    domain: "localhost",
    httpOnly: true,
    path: "/",
    expires: expiryRefreshToken,
    sameSite: "lax",
  });

  return;
};

const setAuthToken = async (id: string, email: string, res: Response) => {
  try {
    const accessToken = generateJWTToken(id, email, "access");
    const refreshToken = generateJWTToken(id, email, "refresh");
    const encryptedRefreshToken = encryptData(refreshToken);
    await saveRefreshToken(refreshToken);
    setCookies(accessToken, refreshToken, res);
  } catch (error) {
    console.log("Error = ", error);
    throw error;
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

    //@ts-ignore
    const insertId = result[0].insertID as Number;

    //set token
    await setAuthToken(String(insertId), email, res);

    return res
      .status(200)
      .json({ message: "user register successfully", user: result });
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

    // set tokens
    await setAuthToken(String(user.id), email, res);

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
