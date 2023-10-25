import express from "express";


import { db_getUserByMailPassword } from "../../../db/db_users.js";
import { jwtVerify } from "../../../utils/jwt.js";
import { generateAlphaNumericNonRepeated, hashPassword } from "../../../utils/crypto.js";

import db from "../../../db/db.js";
import { User } from "../../../models/User.js";

const router = express.Router()
export default router



router.post('/getUsers/:evt_url', jwtVerify, async (req, res) => {
  const { evt_url } = req.params;
  getUsers(evt_url,req,res)
})

router.post('/getUsers',jwtVerify, async (req, res) => {
  const {evt_url} = req.body
  getUsers(evt_url,req,res)
})


async function getUsers(evt_url,req,res){
  if(!evt_url){
    return res.status(400).json({success:false,msg:'Campos requeridos'})
  }

  // const [rows] = await db.query("SELECT * FROM Events WHERE evt_url = ?",[evt_url])
  const [users,event] = await getUsersFromEventCode(evt_url)
  if(!users) return res.status(400).json({success:false,msg:'No event found'})

  if(!users.some(x=>x.id === req.user.id)) return res.status(401).json({success:false,msg:'Unauthorized'})

  
  //retornar un success
  return res.json({ 
    success: true, 
    users:users.map(x=>x.publicData()),
    creator:users.find(x=>x.id === event.usr_id_creator).publicData(),
    event
  })
}


export async function getUsersFromEventCode(evt_url){

  const [events] = await db.query(`SELECT * FROM Events WHERE evt_url = ?`,[evt_url])

  if(!events || events.length<=0) return undefined

  const event = events[0]

  const [usersRows] = await db.query(`
  SELECT Users.*
  FROM Users
  JOIN Events ON Users.usr_id = Events.usr_id_creator
  WHERE Events.evt_url = ? 
  UNION
  SELECT Users.*
  FROM Users
  JOIN User_participation ON Users.usr_id = User_participation.usr_id
  JOIN Events ON User_participation.evt_id = Events.evt_id
  WHERE Events.evt_url = ?`,[evt_url,evt_url])

  if(usersRows.length <= 0) return undefined


  const users = usersRows.map((x) => {
    const user = new User(x);
    if (user.usr_id === event.usr_id_creator) {
      user.isCreator = true;
    }
    return user;
  })

  return [users,event]
  
}
