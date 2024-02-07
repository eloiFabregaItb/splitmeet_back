import express from "express";

import db from "../../../db/db.js";
import { checkMailValidationUrl } from "../../../utils/signMail.js";
import { User } from "../../../models/User.js";
import { generateRepasswordUrl } from "../../../utils/recoverPassword.js";
import { sendEmail } from "../../../mail/mail.js";

const router = express.Router();
export default router;

// /auth/forgotten
router.post("/forgotten", async (req, res) => {

  try {
    const { email } = req.body;

    if(!email){
      return res.json({success:false, message:"Email is required"})
    }

    console.log(email)

    const [users] = await db.query("SELECT * FROM Users WHERE usr_mail = ?",[email])

    if(users.length===0){
      return res.json( { success : false ,message : "This user does not exist."} )
    }

    const user = new User(users[0])

    const repasswordUrl = generateRepasswordUrl(user.id)
    console.log(repasswordUrl)
    const templateData = {
      userName: user.name,
      validationLink: repasswordUrl
    }

    sendEmail("./src/mail/templates/forgotten-password.ejs",templateData)

    // //retornar un success
    return res.json({ success: true });
  } catch (err) {
    //en caso de error
    console.log(err);
    return res.json({ success: false, msg: "An error occurred" });
  }
});
