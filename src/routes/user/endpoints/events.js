import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import db from "../../../db/db.js";
import { Event } from "../../../models/Event.js";

const router = express.Router();
export default router;

//  /user/events
router.post("/events", jwtVerify, async (req, res) => {
  const participatingEvents = await getUserParticipatingEvents(req.user.id);

  const eventsParticipating = participatingEvents.map((x) => new Event(x));

  for (const event of eventsParticipating) {
    await event.getUsers();
  }
  //retornar un success
  return res.json({
    success: true,
    events: eventsParticipating.map((e) => e.publicData()),
  });
});

async function getUserParticipatingEvents(usr_id) {
  const [rows] = await db.query(
    `SELECT Events.*
  FROM Events
  JOIN User_participation ON Events.evt_id = User_participation.evt_id
  WHERE User_participation.usr_id = ?`,
    [usr_id]
  );

  return rows;
}
