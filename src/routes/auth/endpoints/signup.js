import express from "express"

import db from "../../../db/db.js"
import crypto from "crypto"


import { jwtSign } from "../../../utils/jwt.js"



const router = express.Router()
export default router




// SIGNUP
router.post('/signup', async (req, res) => {

  //comprueba que se han recibido todos los datos requeridos
  const { usr_mail, usr_pass, usr_name } = req.body
  if (!usr_mail || !usr_pass || !usr_name) {
    return res.status(409).json({ success: false, msg: 'Campos requeridos' })
  }

  const usr_id = crypto.randomUUID()
  const encryptedPassword = usr_pass // TODO await crypto.hash(usr_pass, 10);

  try {
    const [rows] = await db.query(
      "INSERT INTO Users (usr_id,usr_mail,usr_name,usr_password,usr_oauth,usr_img) VALUES (?,?,?,?,?,?);",
      [usr_id, usr_mail.toLowerCase(), usr_name, encryptedPassword, 0, "NULL"]
    )

    console.log(rows)


    // Create token
    const token = jwtSign({ usr_mail, usr_id })


    //retornar un success
    return res.json({ success: true, jwt: token });


  } catch (err) {

    if (err?.code === 'ER_DUP_ENTRY') {
      return res.json({ success: false, msg: "Mail duplicated" });
    }

    //en caso de error
    console.log(err)
    return res.json({ success: false, msg: "An error occurred" });
  }

})