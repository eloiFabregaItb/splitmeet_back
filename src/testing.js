import db from './db/db.js'
import { User } from './models/User.js'
// import multer from "multer";







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









//JWT OF USER
// const [rows] = await db.query("SELECT * FROM Users WHERE usr_id =  ?",['1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'])
// const user = new User(rows[0])
// user.signJWT()
// console.log(user.name,user.jwt)