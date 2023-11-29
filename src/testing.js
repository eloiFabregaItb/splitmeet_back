import db from './db/db.js'
import { User } from './models/User.js'

// import multer from "multer";
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';
import { sendEmail } from './mail/mail.js';






//DB SELECT
// let [rows,fields] = await db.query("SELECT * FROM User_participation")

//DB SELECT EVENTS
// let [rows,fields] = await db.query("SELECT * FROM Events")
// console.log(rows.map(x=>new Event(x)))
// console.log(rows)


//DB UPDATE
// await db.query(`UPDATE Events SET evt_modification_timestamp = ${getNowTimestamp()}  WHERE evt_id = 'c86e47e7-0f88-424d-8ccb-2937c0535bc2'`)



//DB INSERT
// await db.query("INSERT INTO User_participation (evt_id,usr_id) VALUES (?,?);",
// ['c86e47e7-0f88-424d-8ccb-2937c0535bc2','1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'])



//DB DELETE
// await db.query(`DELETE FROM User_participation WHERE usr_id = ?`,['1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'])


// await db.query(`UPDATE FROM User_participation SET active = false WHERE evt_id = ?, usr_id = ? `,['c86e47e7-0f88-424d-8ccb-2937c0535bc2','1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'])







//JWT OF USER
// const [rows] = await db.query("SELECT * FROM Users WHERE usr_id =  ?",['1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'])
// const user = new User(rows[0])
// user.signJWT()
// console.log(user.name,user.jwt)


//MAILER

// console.log("TEST MAIler");

// import nodemailer from 'nodemailer'


// const transporter = nodemailer.createTransport({
//   port: process.env.MAILER_PORT,
//   secure:process.env.MAILER_SECURE,// true for 465, false for other ports
//   host:process.env.MAILER_HOST,
//   // service:"gmail",
//   auth: {
//     user: process.env.MAILER_USER,
//     pass: process.env.MAILER_PASS,
//   },
// });

// export async function service_sendMail({ to, subject, html }) {
//   const mailData = {
//     from:process.env.MAILER_USER,  // sender address
//     to: to,   // list of receivers
//     subject:subject,
//     html: html || 'no message provided',
//   };


//   return new Promise((resolve,reject)=>{
//     transporter.sendMail(mailData, function (err, info) {
//       if (err) {
//         reject({error:err,msg:"Problem sending the email"})
//       } else {
//         resolve(info)
//       }
//     });

//   })
// }

// const mailData = await service_sendMail({to:"orillad2003@gmail.com",subject:"Your request is being processed",html:`please be patient we will answer as soon as we can.<br>`})
// console.log(mailData);


// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.SMTP_MAIL, 
//       pass: process.env.SMTP_KEY  
//     }
//   });
  


// const templatePath = path.join(__dirname, 'splitmeet_back/src/mail/welcome-email.ejs');


