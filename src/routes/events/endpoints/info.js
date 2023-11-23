import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";

import db from "../../../db/db.js";

const router = express.Router();
export default router;

//POST /event/info
router.post("/info", jwtVerify, async (req, res) => {
  // Create token
  if (!req.event) {
    return res.status(400).json({ success: false, msg: "No event found" });
  }
  const ev = req.event;
  const users = await ev.getUsers();

  if (users.some((x) => x.id !== req.user.id)) {
    return res
      .status(400)
      .json({
        success: false,
        msg: "You are not joined",
        error_code: "ALREADY_DONE",
      });
  }

  console.log(ev);

  try {
    //retornar un success
    return res.json({ success: true });
  } catch {
    return res.json({ success: false, msg: "An error occurred" });
  }
});
