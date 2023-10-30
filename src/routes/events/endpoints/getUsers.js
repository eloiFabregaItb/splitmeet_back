import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";


const router = express.Router()
export default router




router.post('/getUsers',jwtVerify, async (req, res) => {

  if(!req.event){
    return res.status(400).json({success:false,msg:'No event found'})
  }

  const ev = req.event
  console.log("getUSERS",ev.getUsers)
  const users = await ev.getUsers()

  if(!users) return res.status(400).json({success:false,msg:'No users found'})

  if(!users.some(x=>x.id === req.user.id)) return res.status(401).json({success:false,msg:'Unauthorized'})

  //retornar un success
  return res.json({ 
    success: true, 
    event:ev.publicData(),
  })

})

