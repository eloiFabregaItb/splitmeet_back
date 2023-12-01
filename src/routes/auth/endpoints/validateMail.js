import express from "express";

import db from "../../../db/db.js";
import { checkMailValidationUrl } from "../../../utils/signMail.js";

const router = express.Router();
export default router;

// /auth/validateMail
router.post("/validateMail", async (req, res) => {
  //comprueba que se han recibido todos los datos requeridos
  const { token } = req.body;

  if (!token) {
    return res.status(409).json({ success: false, msg: "Campos requeridos" });
  }

  console.log(token);

  try {
    const usr_id = await checkMailValidationUrl(token);
    console.log(usr_id);

    if (!usr_id) return res.json({ success: false, msg: "Error" });

    console.log("validating user ");

    const [rows] = await db.query(
      "UPDATE Users SET usr_mail_validated = 1 WHERE usr_id = ?;",
      [usr_id]
    );

    //retornar un success
    return res.json({ success: true });
  } catch (err) {
    //en caso de error
    console.log(err);
    return res.json({ success: false, msg: "An error occurred" });
  }
});
