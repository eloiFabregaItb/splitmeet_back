import { User } from "../models/User.js";
import db from "./db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretJWT"

export async function db_getUserByMailPassword(usr_mail,usr_pass) {
  const [rows,fields] = await db.query(
    "SELECT * FROM Users WHERE usr_mail = ? AND usr_password = ?",
    [usr_mail,usr_pass]
  )

  if(rows && rows[0]){
    return new User(rows[0])
  }

  return undefined
}


export async function db_getUserByJWT(token){
  
  if (!token) return
  
  try {
    const {mail,usr_id,iat,exp} = jwt.verify(token, JWT_SECRET);
    const [rows,fields] = await db.query(
      "SELECT * FROM Users WHERE usr_id = ? AND usr_mail = ?",
      [usr_id,mail]
    )

    if(rows && rows[0]){
      return new User(rows[0])
    }
    
  } catch (err) {
    console.error(err)
  }

}