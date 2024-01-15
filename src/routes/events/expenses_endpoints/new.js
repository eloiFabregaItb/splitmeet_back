import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { generateAlphaNumericNonRepeated } from "../../../utils/crypto.js";

import crypto from "crypto";
import db from "../../../db/db.js";
import { getNowTimestamp } from "../../../utils/time.js";

const router = express.Router();
export default router;



//   /event/expenses/new
router.post("/new", jwtVerify, async (req, res) => {
  const creator = req.user
  const event = req.event

  const { concept,lenderId,description,date,coords,transactions } = req.body;

  if(!concept) return res.status(400).json({ success: false, msg:"Missing concept"});
  if(!lenderId) return res.status(400).json({ success: false, msg:"Missing lenderId"});
  if(typeof description !== "string") return res.status(400).json({ success: false, msg:"Missing description"});
  if(!date) return res.status(400).json({ success: false, msg:"Missing date"});
  if(typeof coords !== "string") return res.status(400).json({ success: false, msg:"Missing coords"});
  if(!transactions || transactions.length===0) return res.status(400).json({ success: false, msg:"Missing transactions array"});

  for (const tra of transactions) {
    if(!tra.borrowerId) return res.status(400).json({ success: false, msg:"Missing transaction/borrowerId"});
    if(!tra.amount) return res.status(400).json({ success: false, msg:"Missing transaction/amount"}); 
  }


  const [{insertId: exp_id}] = await db.query(`INSERT INTO Expensses (
    evt_id,
    usr_id_creator,
    exp_concept,
    exp_description,
    exp_data,
    exp_coords,
    usr_id_lender
  ) VALUES (?,?,?,?,?,?,?)`,[
    event.id,
    creator.id,
    concept,
    description,
    date,
    coords,
    lenderId,
  ])

  const valuesTemplate = "(?,?,?)"

  const [rows] = await db.query(`INSERT INTO Expensses_transaction (exp_id, usr_id_borrower, tra_amount) 
  VALUES ${transactions.map(_=>valuesTemplate).join(",")}`
  ,transactions.flatMap(tra=>[exp_id,tra.borrowerId,tra.amount]))


  console.log(rows)

  res.json({
    evt_id:event.id,
    usr_id_creator:creator.id,
    exp_concept:concept,
    exp_description:description,
    exp_data:date,
    exp_coords:coords,
    usr_id_lender:lenderId,
    exp_transaction: transactions,
    rows
  })

})