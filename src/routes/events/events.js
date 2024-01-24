import express from "express";

const router = express.Router();
export default router;

import db from "../../db/db.js";

import route_create from "./endpoints/create.js";
import route_getUsers from "./endpoints/getUsers.js";
import route_join from "./endpoints/join.js";
import route_leave from "./endpoints/join.js";
import route_image from "./endpoints/image.js";
import route_info from "./endpoints/info.js";
import route_exit from "./endpoints/exit.js";
import route_invite from "./endpoints/invite.js";

import route_expenses_new from "./expenses_endpoints/new.js"

import { Event } from "../../models/Event.js";
// import { db_getEventByID, db_getEventByUrl } from "../../db/db_events.js";

router.use(async (req, res, next) => {
  const ev = await makeEventFromBody(req.body);
  if (ev) {
    // req.body.event = ev
    req.event = ev;
  }
  next();
});

router.use("", route_create);
//      /event/create

router.use("", route_getUsers);
//      /event/getUsers

router.use("", route_join);
//      /event/join

router.use("", route_leave);
//      /event/leave

router.use("", route_image);
//      /event/img

router.use("", route_info);
//      /event/info

router.use("", route_exit);
//      /event/exit

router.use("", route_invite);
//      /event/exit


router.use("/expenses", route_expenses_new);
//      /event/expenses/new




export async function makeEventFromBody(body) {
  if (body.evt_url) {
    try {
      const [rows] = await db.query("SELECT * FROM Events WHERE evt_url = ?", [
        body.evt_url,
      ]);
      const ev = new Event(rows[0]);
      return ev;
    } catch {
      //url not found
      return undefined;
    }
  } else if (body.evt_id) {
    const ev = await db_getEventByID(body.evt_id);
    return ev;
  }
}
