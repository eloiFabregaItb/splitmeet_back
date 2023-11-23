import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import db from "../../../db/db.js";
import { Event } from "../../../models/Event.js";

const router = express.Router();
export default router;

//  /user/events
router.post("/events", jwtVerify, async (req, res) => {
  const [participatingEvents, createdEvents] = await Promise.all([
    getUserParticipatingEvents(req.user.id),
    getUserCreatedEvents(req.user.id),
  ]);

  const eventsParticipating = participatingEvents.map((x) => new Event(x));
  const eventsCreated = createdEvents.map((x) => new Event(x));
  const events = [...eventsCreated, ...eventsParticipating].sort((a, b) => {
    a.modification > b.modification ? 1 : -1;
  });

  for (const event of events) {
    await event.getUsers();
  }
  //retornar un success
  return res.json({ success: true, events: events.map((e) => e.publicData()) });
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

async function getUserCreatedEvents(usr_id) {
  const [rows] = await db.query(
    `SELECT Events.*
  FROM Events
  WHERE Events.usr_id_creator =  ?`,
    [usr_id]
  );

  return rows;
}
