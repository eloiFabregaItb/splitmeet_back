import db from "./db/db.js";
import {
  checkMailValidationUrl,
  generateMailValidationUrl,
} from "./utils/signMail.js";
import { User } from "./models/User.js";
import { Event } from "./models/Event.js";
import { sendEmail } from "./mail/mail.js";
import axios from "axios";
import { hashPassword } from "./utils/crypto.js";
// import multer from "multer";
console.log("__________________________");
console.log("THIS IS TESTING");


//TABLES
// const tables = await db.query("SHOW TABLES");
// console.log(tables[0].map((x) => x.Tables_in_splitmeet).join(" | "));

// //DB SELECT
// let [rows, fields] = await db.query("SELECT * FROM User_participation");
// console.log(rows);


// //DB SELECT
// let [rows, fields] = await db.query("SELECT * FROM Users");
// console.log(rows);

// let [rowsEvent] = await db.query("SELECT * FROM Events WHERE evt_id = ?",["c86e47e7-0f88-424d-8ccb-2937c0535bc2"]);
// const ev = new Event(rowsEvent[0])
// // console.log(ev)
// ev.getBalances()

//DB SELECT EVENTS
// let [rows, fields] = await db.query("SELECT * FROM Events");
// console.log(rows.map((x) => new Event(x)));
// console.log(rows);

//DB EVENT INFO
// let [rows, fields] = await db.query("SELECT * FROM Events WHERE evt_url = ?", [
//   "7CKK1dlQ",
// ]);
// const ev = rows[0];
// console.log(ev);
// let [rows2] = await db.query("SELECT * FROM Expensses WHERE evt_id = ?", [
//   ev.evt_id,
// ]);
// const exp = rows2[0];
// console.log(exp);
// let [tra] = await db.query(
//   "SELECT * FROM Expensses_transaction WHERE exp_id = ?",
//   [exp.exp_id]
// );
// console.log(tra);

//DB UPDATE
// await db.query(`UPDATE Events SET evt_modification_timestamp = ${getNowTimestamp()}  WHERE evt_id = 'c86e47e7-0f88-424d-8ccb-2937c0535bc2'`)

//DB INSERT
// await db.query("INSERT INTO User_participation (evt_id,usr_id) VALUES (?,?);",
// ['c86e47e7-0f88-424d-8ccb-2937c0535bc2','1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'])

//DB DELETE
// await db.query(`DELETE FROM User_participation WHERE usr_id = ?`,['1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'])

// ALL PARTICIPATE
// await db.query("UPDATE User_participation SET active = 1 WHERE active = 0");




//JWT OF USER
// const [rows] = await db.query("SELECT * FROM Users WHERE usr_name =  ?", ["user4"]);
// const user = new User(rows[0]);
// console.log(user)
// user.signJWT();
// console.log(user.name, user.jwt);
// const token = user.jwt
// console.log("TOEKN");
// console.log();


// const updatedFields = {
//   name: "NuevoNombre",
//   mail: "nuevo@mail.com",
//   password: hashPassword("a"),
// };

// const [users] = await db.query("SELECT usr_mail FROM Users");
// console.log(users)


// const [rows] = await db.query("SELECT * FROM Users WHERE usr_name =  ?", [
//   "user3",
// ]);
// const user = new User(rows[0]);
// const token = generateMailValidationUrl(user);
// console.log(token);
// const userFromMail = await checkMailValidationUrl(token);
// console.log(userFromMail);

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

// const templateData = {
//   usr_name: "orillad",
//   ivitator_name: "test",
//   evnt_name: "Esquiada",
//   evnt_image: "https://media.istockphoto.com/id/1309988966/es/foto/esqu%C3%AD-en-polvo.jpg?s=612x612&w=0&k=20&c=l4wgeZPX_6o2CI64QbtY2pxvzljRJwHGWJYvTSowIys=",
//   sing_mail: "efsdfdsf",
// };

// sendEmail('/home/orillad/splitmeet/splitmeet_back/src/mail/templates/invitation-event-email.ejs', 'orillad2003@gmail.com', "Invitation", templateData)


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





function simplifyDebts(debtMatrix) {
  // Check if the debt matrix is valid
  if (!validateDebtMatrix(debtMatrix)) {
    throw new Error('Invalid debt matrix');
  }

  // Initialize variables
  let maxTransactionValue = Infinity;
  let optimalTransactions = [];

  // Iterate through all possible pairs of debtors and creditors
  for (let debtor = 0; debtor < debtMatrix.length; debtor++) {
    for (let creditor = 0; creditor < debtMatrix.length; creditor++) {
      if (debtMatrix[debtor][creditor] > 0 && debtor !== creditor) {
        // Check if the remaining debt is less than the current maximum transaction value
        let remainingDebt = debtMatrix[debtor][creditor];
        if (remainingDebt < maxTransactionValue) {
          maxTransactionValue = remainingDebt;
          optimalTransactions = [];
        }

        // Check if there's a way to simplify the debt using a single transaction
        if (isDebtSimplifiable(debtMatrix, debtor, creditor)) {
          const simplifiedDebtMatrix = simplifyDebtUsingSingleTransaction(debtMatrix, debtor, creditor);

          // Check if the simplified debt matrix has no remaining debts
          if (!hasRemainingDebts(simplifiedDebtMatrix)) {
            // Found an optimal solution
            optimalTransactions.push([debtor, creditor]);
          }
        }
      }
    }
  }

  // Return the optimal transactions
  return optimalTransactions;
}

function validateDebtMatrix(debtMatrix) {
  if (!Array.isArray(debtMatrix) || debtMatrix.length === 0) {
    return false;
  }

  for (let i = 0; i < debtMatrix.length; i++) {
    if (!Array.isArray(debtMatrix[i]) || debtMatrix[i].length !== debtMatrix.length) {
      return false;
    }
  }

  // Check if the matrix is symmetric with opposite signs in the upper and lower triangle
  for (let i = 0; i < debtMatrix.length; i++) {
    for (let j = 0; j < debtMatrix.length; j++) {
      if (debtMatrix[i][j] !== -debtMatrix[j][i] || debtMatrix[i][i] !== 0) {
        return false;
      }
    }
  }

  return true;
}

function isDebtSimplifiable(debtMatrix, debtor, creditor) {
  // Check if the debtor's remaining debt is equal to the creditor's debt
  const debtorRemainingDebt = debtMatrix[debtor][debtor];
  const creditorRemainingDebt = debtMatrix[creditor][creditor];
  return debtorRemainingDebt === debtMatrix[debtor][creditor] === creditorRemainingDebt;
}

function simplifyDebtUsingSingleTransaction(debtMatrix, debtor, creditor) {
  const simplifiedDebtMatrix = debtMatrix.slice();

  // Transfer the remaining debt from debtor to creditor
  simplifiedDebtMatrix[debtor][debtor] -= debtMatrix[debtor][creditor];
  simplifiedDebtMatrix[creditor][creditor] += debtMatrix[debtor][creditor];
  simplifiedDebtMatrix[debtor][creditor] = 0;
  simplifiedDebtMatrix[creditor][debtor] = 0;

  return simplifiedDebtMatrix;
}

function hasRemainingDebts(debtMatrix) {
  for (let i = 0; i < debtMatrix.length; i++) {
    for (let j = 0; j < debtMatrix.length; j++) {
      if (debtMatrix[i][j] !== 0) {
        return true;
      }
    }
  }

  return false;
}



const debtMatrix = [[0, -5, -6], [5, 0, 7], [6, -7, 0]];
const optimalTransactions = simplifyDebts(debtMatrix);
// console.log(optimalTransactions)





console.log("__________________________");
