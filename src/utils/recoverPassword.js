import jwt from "jsonwebtoken"
import { jwtSign } from "./jwt.js"

const METHOD = "PASSWORD_FORGOTTEN"

const FRONTEND_URL = process.env.FRONTEND_URL || "https://split-meet:4433";
const JWT_SECRET = process.env.JWT_SECRET || "secretJWT";

export function generateRepasswordUrl(user_id) {
  const token = jwtSign({ user_id, method: METHOD }, "1h");
  return FRONTEND_URL + "/change-password/" + token;
}

export async function checkRepasswordUrl(token) {
  if (!token) return;

  const {
    // iat: generationDate,
    // exp: expirationDate,
    method,
    usr_id,
  } = jwt.verify(token, JWT_SECRET);

  if (method !== METHOD || !usr_id) return undefined;

  return usr_id; //await db_getUserByID(usr_id);
}
