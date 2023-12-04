import jwt from "jsonwebtoken";
import { jwtSign } from "./jwt.js";

const MAIL_VALIDATE = "MAIL_VALIDATE";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://splitmeet.ddns.net";

const JWT_SECRET = process.env.JWT_SECRET || "secretJWT";

export function generateMailValidationUrl(user_id) {

  const token = jwtSign({ user_id, method: MAIL_VALIDATE }, "24h");
  return FRONTEND_URL + "/validateMail/" + token;
}

export async function checkMailValidationUrl(token) {
  if (!token) return;

  const {
    // iat: generationDate,
    // exp: expirationDate,
    method,
    usr_id,
  } = jwt.verify(token, JWT_SECRET);

  if (method !== MAIL_VALIDATE || !usr_id) return undefined;

  return usr_id; //await db_getUserByID(usr_id);
}
