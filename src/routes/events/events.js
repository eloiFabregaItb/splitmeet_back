import express from "express";

const router = express.Router()
export default router

import db from "../../db/db.js";
import { Event } from "../../models/Event.js";

import route_create from "./endpoints/create.js"
import route_getUsers from "./endpoints/getUsers.js"
import route_join from "./endpoints/join.js"
import route_leave from "./endpoints/join.js"



router.use(async (req,res,next)=>{
  if(req.body.evt_url){
    const [rows] = await db.query("SELECT * FROM Events WHERE evt_url = ?",[req.body.evt_url])
    const ev = new Event(rows[0])
    req.event = ev
  }else if(req.body.evt_id){
    const [rows] = await db.query("SELECT * FROM Events WHERE evt_id = ?",[req.body.evt_id])
    const ev = new Event(rows[0])
    req.event = ev
  }
  next()
})





router.use('',route_create)
//      /event/create


router.use('',route_getUsers)
//      /event/getUsers


router.use('',route_join)
//      /event/join


router.use('',route_leave)
//      /event/leave


