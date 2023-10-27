import express from "express";

const router = express.Router()
export default router

import route_create from "./endpoints/create.js"
import route_getUsers from "./endpoints/getUsers.js"
import route_join from "./endpoints/join.js"
import route_leave from "./endpoints/join.js"
import route_image from "./endpoints/image.js"
import { db_getEventByID, db_getEventByUrl } from "../../db/db_events.js";


router.use(async (req,res,next)=>{
  const ev = await makeEventFromBody(req.body)
  if(ev) req.event = ev
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


router.use('',route_image)
//      /event/img



export async function makeEventFromBody(body){
  if(body.evt_url){
    const ev = await db_getEventByUrl(body.evt_url)
    return ev
  }else if(body.evt_id){
    const ev = await db_getEventByID(body.evt_id)
    return ev
  }
}