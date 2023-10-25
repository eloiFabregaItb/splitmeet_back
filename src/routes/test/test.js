import express from "express";
// import { io } from "../server";

import { jwtVerify } from "../../utils/jwt.js";
import { User } from "../../models/User.js";
import db from "../../db/db.js";

const router = express.Router()
export default router


router.post('/getjwtbyid', async (req, res) => {
    const {usr_id} = req.body
    console.log(usr_id)
    const [rows] = await db.query("SELECT * FROM Users WHERE usr_id =  ?",[usr_id])
    const user = new User(rows[0])

    
    user.signJWT()
 

    //retornar un success
    return res.json({ success: true, ...user.publicData()});
        
  })
  
  
  
  