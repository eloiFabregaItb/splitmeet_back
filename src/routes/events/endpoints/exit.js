import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";

import db from "../../../db/db.js";

const router = express.Router();
export default router;

//POST /event/exit
router.post("/exit", jwtVerify, async (req, res) => {
  // Create token
  if (!req.event) {
    return res.status(400).json({ success: false, msg: "No event found" });
  }

  const ev = req.event;

  try {
    await db.query(
      `UPDATE User_participation
      SET active = 0
      WHERE usr_id = ? AND evt_id = ?`,
      [req.user.id, ev.id]
    );

    //retornar un success
    return res.json({ success: true });
  } catch {
    return res.json({ success: false, msg: "An error occurred" });
  }
});


//POST /event/fire
router.post("/fire",jwtVerify,async (req,res)=>{
  if (!req.event) {
    return res.status(400).json({ success: false, msg: "No event found" });
  }

  const ev = req.event
  
  if(ev.cretorId !== req.user.id){
    return res.json({success:false,msg:"You dont have permissions"})
  }
  const userFireId = req.body.usr_id
  if(req.user.id === userFireId){
    return res.json({success:false,msg:"You cannot fire yourself"})
  }
  if(!userFireId) {
    return res.json({success:false,msg:"Missing usr_id"})
  }
  
  const users = await ev.getUsers()
  const userFire = users.find(x=>x.id===userFireId)
  if(!userFire){
    return res.json({success:false,msg:"User is no participating"})
  }

  try {
    await db.query(
      `UPDATE User_participation
      SET active = 0
      WHERE usr_id = ? AND evt_id = ?`,
      [userFire.id, ev.id]
    );


    const usersUpdate = await ev.getUsers(true)

    //retornar un success
    return res.json({ success: true, users:usersUpdate.map(x=>x.publicData()) });
  } catch {
    return res.json({ success: false, msg: "An error occurred" });
  }

})