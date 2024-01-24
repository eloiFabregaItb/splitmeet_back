import express from "express";

import { jwtVerify } from "../../../utils/jwt.js";
import { sendEmail } from "../../../mail/mail.js";
import { db_getUserByEmail } from "../../../db/db_users.js";


const router = express.Router();
export default router;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//POST /event/invite
router.post("/invite", jwtVerify, async (req, res) => {
  // Create token
  if (!req.event) {
    return res.status(400).json({ success: false, msg: "No event found" });
  }

  if(!req.body.emails){
    return res.status(400).json({success:false,msg:"emails array is required"})
  }

  const ev = req.event;

  const emails = req.body.emails

  const invalidEmails = emails.filter(x=>!emailRegex.test(x))
  const validEmails = emails.filter(x=>emailRegex.test(x))



  try {

    if(validEmails.length>0){
      //todo, send emails
      console.log(validEmails)
      for (const email of validEmails) {
        const usrEmail = await db_getUserByEmail(email)
        await sendEmail(
          "./src/mail/templates/invitation-event-email.ejs",
          email,
          `Invitation to event: ${ev.name}`,
          {
            email,
            usr_name:usrEmail?.name || email,
            ivitator_name:req.user.name,
            evnt_image:`172.30.4.55:3000/public/evtPic/${ev.imgUrl}`,
            // evnt_image:`api.split-meet.com/public/evtPic/${ev.imgUrl}`,
            string_mail:email,
            evnt_name:ev.name,
            evt_url:ev.url
          }
        )
      }  
    }



    //retornar un success
    return res.json({ success: true, validEmails, invalidEmails});
  } catch(err) {
    console.log(err)
    return res.json({ success: false, msg: "An error occurred" });
  }
});
