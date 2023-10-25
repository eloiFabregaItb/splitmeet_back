import express from "express";


import { db_getUserByMailPassword } from "../../../db/db_users.js";
import { jwtVerify } from "../../../utils/jwt.js";
import { generateAlphaNumericNonRepeated, hashPassword } from "../../../utils/crypto.js";

import crypto from "crypto"
import db from "../../../db/db.js";

const router = express.Router()
export default router




router.post('/join',jwtVerify, async (req, res) => {
    // Create token    
    const {evt_url} = req.body
    if(!evt_url){
      return res.status(400).json({success:false,msg:'Campos requeridos'})
    }

    console.log(req.user)

    cosnt [rows] = await db.query("SELECT * FROM Events WHERE evt_url = ?",[evt_url])
    if(!rows || !rows[0]) return 
    
    //retornar un success
    return res.json({ success: true});
        
})



