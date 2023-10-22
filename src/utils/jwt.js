import jwt from "jsonwebtoken";
import { db_getUserByJWT } from "../db/db_users.js";

const JWT_TIMEOUT = process.env.JWT_TIMEOUT || "48h"
const JWT_SECRET = process.env.JWT_SECRET || "secretJWT"

export function jwtSign(data){
    return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_TIMEOUT });
}
  










/**
 * Esta funcion se usa como middleware para los endpoints, al usar esta función aseguras que en el endpoint solo entren
 * usuarios registrados, añadirá dos objetos en el objeto <req>, req.by y req.usr_id
 * req.by={
        "usr_mail": "mail@example.com", // the user email
        "iat": 1697734874,  //timestamp of code creation
        "exp": 1698771674   //timestamp of code expiration
    }
 * 
 
EJEMPLO:                 _________
router.post("/protected",jwtVerify,async(req,res)=>{
  const {usr_id} = req
  res.json({success:true,msg:"authentificated",user:req.by})
})


 */

export async function jwtVerify (req, res, next){
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({success:false,msg:"A token is required for authentication"});
  }
  
  const user = await db_getUserByJWT(token)

  if(!user){
    return res.status(401).json({success:false,msg:"Invalid Token"});
  }

  req.user = user
  return next();
};


export async function jwtUserFromToken(token){
  if(!token) return undefined
  const user = db_getUserByJWT(token)
  if(!user) return undefined
  return user
}