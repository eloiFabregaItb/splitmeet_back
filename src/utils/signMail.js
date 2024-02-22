import jwt from "jsonwebtoken";
import { jwtSign } from "./jwt.js";

const METHOD = "MAIL_VALIDATE";

const FRONTEND_URL = process.env.FRONTEND_URL || "https://split-meet:4433";

const JWT_SECRET = process.env.JWT_SECRET || "secretJWT";

export function generateMailValidationUrl(user_id) {
  const token = jwtSign({ user_id, method: METHOD }, "24h");
  return FRONTEND_URL + "/validateMail?id=" + token;
}

export async function checkMailValidationUrl(token) {
  if (!token) return;

  const {
    // iat: generationDate,
    // exp: expirationDate,
    method,
    user_id,
  } = jwt.verify(token, JWT_SECRET);

  if (method !== METHOD || !user_id) return undefined;

  return user_id; //await db_getUserByID(usr_id);
}
