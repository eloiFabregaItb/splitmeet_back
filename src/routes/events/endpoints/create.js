import express from "express";


import { db_getUserByMailPassword } from "../../../db/db_users.js";
import { jwtVerify } from "../../../utils/jwt.js";
import { generateAlphaNumericNonRepeated, hashPassword } from "../../../utils/crypto.js";

import crypto from "crypto"
import db from "../../../db/db.js";

const router = express.Router()
export default router




router.post('/create',jwtVerify, async (req, res) => {
    const {evt_name} = req.body
    if(!evt_name){
      return res.status(400).json({success:false,msg:'Campos requeridos'})
    }

    
    const newUrl = await generateNewEventUrl()
    const evt_id = crypto.randomUUID()

    await db.query("INSERT INTO Events (evt_id,usr_id_creator,evt_name,evt_url) VALUES (?,?,?,?);",
    [evt_id,req.user.id,evt_name,newUrl])
    
    
    //retornar un success
    return res.json({ success: true, url_code:newUrl});
})
  

export async function generateNewEventUrl(){
  const [rows] = await db.query("SELECT evt_url FROM Events")
  const codes = rows.map(x=>x.evt_url)
  const newUrl = generateAlphaNumericNonRepeated(codes)
  return newUrl
}