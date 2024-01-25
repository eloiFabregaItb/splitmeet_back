import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";

import db from "../../../db/db.js";

const router = express.Router();
export default router;

//POST /event/balance
router.post("/balance", jwtVerify, async (req, res) => {
  // Create token
  if (!req.event) {
    return res.status(400).json({ success: false, msg: "No event found" });
  }
  try {
    await req.event.getBalances()
    const {list,balance} = req.event.expenses

    //retornar un success
    return res.json({ success: true , balance, history:list});
  } catch {
    return res.json({ success: false, msg: "An error occurred" });
  }
});
