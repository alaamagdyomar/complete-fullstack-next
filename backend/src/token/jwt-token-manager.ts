import jwt from "jsonwebtoken";
import { generateRadisKey, generateTTL } from "../utilis/helpers";
import { setCache } from "../redis/action";
import { encryptData } from "../encryption";

export const generateJWTToken = (
  id: string,
  email: string,
  tokenType: "access" | "refresh"
) => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET_KEY!, {
    expiresIn: tokenType === "access" ? "1h" : "7d",
  });
  return token;
};

export const saveRefreshToken = async (token: string) => {
  try {
    const decodeData = jwt.decode(token, { json: true });
    if (!decodeData) throw new Error("unable to decode token");

    const key = generateRadisKey(decodeData.id);
    const TTL = generateTTL(decodeData.exp!);
    await setCache(key, encryptData(token), TTL);
    console.log("savved refresh token ");
  } catch (err) {
    console.log("error in saving refresh token");
    throw err;
  }
};
