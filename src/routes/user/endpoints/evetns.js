import express from "express";


import { db_getUserByMailPassword } from "../../../db/db_users.js";
import { jwtVerify } from "../../../utils/jwt.js";
import { generateAlphaNumericNonRepeated, hashPassword } from "../../../utils/crypto.js";

import crypto from "crypto"
import db from "../../../db/db.js";

const router = express.Router()
export default router



//  /user/events
router.post('/events',jwtVerify, async (req, res) => {

  const [participatingEvents, createdEvents] = await Promise.all([
    getUserParticipatingEvents(req.user.id),
    getUserCreatedEvents(req.user.id)
  ])

  const eventsParticipating = participatingEvents.map(x=>new Event(x))
  const eventsCreated = createdEvents.map(x=>new Event(x))
  
  console.log(eventsParticipating,eventsCreated)
  
  //retornar un success
  return res.json({ success: true});
        
})

async function getUserParticipatingEvents(usr_id){
  const [rows] = await db.query(`SELECT Events.*
  FROM Events
  JOIN User_participation ON Events.evt_id = User_participation.evt_id
  WHERE User_participation.usr_id = ?`,[usr_id])

  return rows
}

async function getUserCreatedEvents(usr_id){
  const [rows] = await db.query(`SELECT Events.*
  FROM Events
  WHERE Events.usr_id_creator =  ?`,[usr_id])

  return rows
}



