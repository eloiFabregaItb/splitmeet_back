import express from "express"


import { jwtVerify } from "../../../utils/jwt.js"
import { sendEmail } from "../../../mail/mail.js"
import { generateMailValidationUrl } from "../../../utils/signMail.js"




const router = express.Router()
export default router

// /auth/resendValidate
router.post("/resendValidate", jwtVerify, async (req,res)=>{
  const user = req.user

  // send email
  
  const templateData = {
    userName: user.name,
    validationLink: generateMailValidationUrl(user.id),
  };

  sendEmail('./src/mail/templates/validation-email.ejs', user.mail, "Welcome", templateData)

  //retornar un success
  return res.json({ success: true });
  
})