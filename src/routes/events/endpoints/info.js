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

  const [users] = await db.query(
    `SELECT User_participation.active, Users.usr_id, Users.usr_mail, Users.usr_name, Users.usr_img
  FROM Events
  INNER JOIN User_participation ON Events.evt_id = User_participation.evt_id
  INNER JOIN Users ON User_participation.usr_id = Users.usr_id
  WHERE Events.evt_url = ?;`,
    [ev.url]
  );

  //TODO comprobar que el request es de un usuario interno al grupo
  // if (!users.some((x) => x.id !== req.user.id)) {
  //   return res.status(400).json({
  //     success: false,
  //     msg: "You are not joined",
  //     error_code: "UNAUTHORIZED",
  //   });
  // }

  //expenses sin agrupar, todas en un array_flat
  const [expenses_db] = await db.query(
    `SELECT *
    FROM Events
    INNER JOIN Expensses ON Events.evt_id = Expensses.evt_id
    INNER JOIN Expensses_transaction ON Expensses.exp_id = Expensses_transaction.exp_id
    WHERE Events.evt_url = ?`,
    [ev.url]
  );

  //UNFLAT EXPENSES
  const expenses_group = Object.groupBy(expenses_db, (e) => e.exp_id);

  const event = ev.publicData();

  const expenses = Object.values(expenses_group).map((exp) => {
    const currentExpense = {
      exp_id: exp[0]?.exp_id,
      exp_concept: exp[0]?.exp_concept,
      exp_description: exp[0]?.exp_description,
      exp_data: exp[0]?.exp_data,
      exp_coords: exp[0]?.exp_coords,
      exp_foto1: exp[0]?.exp_foto1,
      exp_foto2: exp[0]?.exp_foto2,
      exp_foto3: exp[0]?.exp_foto3,
      usr_id_lender: exp[0]?.usr_id_lender,
    };

    return {
      total: exp.reduce((acc, v) => acc + v.tra_amount, 0),
      status:
        currentExpense.usr_id_lender === req.user.id ? "PAID" : "RECEIVED", // TODO "NONE"if no participated in this transaction

      ...currentExpense,

      transactions: exp.map((x) => ({
        tra_amount: x.tra_amount,
        usr_id_borrower: x.usr_id_borrower,
        tra_id: x.tra_id,
      })),
    };
  });

  try {
    //retornar un success
    return res.json({ success: true, users, expenses, event });
  } catch {
    return res.json({ success: false, msg: "An error occurred" });
  }
});
