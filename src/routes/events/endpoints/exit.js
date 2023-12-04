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
