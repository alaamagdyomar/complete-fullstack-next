// import crypto from "crypto";
// import { config } from "dotenv";
// config();

// const algorithm = "aes-256-cbc";
// const key = Buffer.from(process.env.ENCRYPTION_KEY!, "base64"); // must be 32 bytes

// export const encryptData = (data: string) => {
//   const iv = crypto.randomBytes(16); // NEW IV every time
//   const cipher = crypto.createCipheriv(algorithm, key, iv);

//   const encrypted = Buffer.concat([
//     cipher.update(data, "utf8"),
//     cipher.final(),
//   ]);

//   // store iv + ciphertext together
//   return `${iv.toString("base64")}:${encrypted.toString("base64")}`;
// };

// export const decryptData = (payload: string) => {
//   const [ivB64, encryptedB64] = payload.split(":");
//   if (!ivB64 || !encryptedB64) throw new Error("Invalid payload format");

//   const iv = Buffer.from(ivB64, "base64");
//   const encrypted = Buffer.from(encryptedB64, "base64");

//   const decipher = crypto.createDecipheriv(algorithm, key, iv);
//   const decrypted = Buffer.concat([
//     decipher.update(encrypted),
//     decipher.final(),
//   ]);

//   return decrypted.toString("utf8");
// };

import crypto from "crypto";
import { config } from "dotenv";
config();

const key = Buffer.from(process.env.ENCRYPTION_KEY!, "base64");
const iv = crypto.randomBytes(16);
const algorithm = "aes-256-cbc";

export const encryptData = (data: string) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptData = (encrypted: string) => {
  const decripher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decripher.update(encrypted, "hex", "utf8");
  decrypted += decripher.final("utf8");
  return decrypted;
};
