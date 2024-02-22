import jwt from "jsonwebtoken"
import { jwtSign } from "./jwt.js"
import { db_getUserByID } from "../db/db_users.js";

const METHOD = "PASSWORD_FORGOTTEN"

const FRONTEND_URL = process.env.FRONTEND_URL || "https://split-meet:4433";
const JWT_SECRET = process.env.JWT_SECRET || "secretJWT";

export function generateRepasswordUrl(usr_id) {
  const token = jwtSign({ usr_id, method: METHOD }, "1h");
  return FRONTEND_URL + "/change-password?id=" +token;
}

export async function checkRepasswordUrl(token) {
  if (!token) return;

  const obj =jwt.verify(token, JWT_SECRET);
  const {
    // iat: generationDate,
    // exp: expirationDate,
    method,
    usr_id,
    
  } = obj 

  if (method !== METHOD || !usr_id) return undefined;


  return await db_getUserByID(usr_id);
}
