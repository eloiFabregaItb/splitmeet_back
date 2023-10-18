import express from "express";
// import { io } from "../server";

import { db } from "../db/db.js";

const router = express.Router()
export default router

router.get('/', (req, res) => {
  res.json({test:true})
  // io.emmit("")
})





router.post('/login', async (req, res) => {
  
  const {usr_mail,password} = req.body
  if(!usr_mail || !password){
    return res.status(401).json({success:false,msg:'Usuario o contraseña no presente'})
  }

  try{

    const [rows,fields] = await db.query(
      "SELECT * FROM Users WHERE usr_mail = ? AND usr_password = ?",
      [usr_mail,password]
    )

    if (!rows || rows.length === 0) {
      // No user found, send a response with success:false
      return res.json({ success: false, msg:"User/Password combo doesn't match"});
    }

    const {usr_password,usr_id, ...publicUser} = rows[0]

    return res.json({ success: true, usr_data:publicUser});
    

  }catch(err){
    console.log(err)
    return res.json({ success: false, msg:"An error occurred" });
  }
      
})




