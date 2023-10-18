import express from "express";
// import { io } from "../server";

import { db_connection } from "../server.js";

const router = express.Router()
export default router

router.get('/', (req, res) => {
  res.json({test:true})
  // io.emmit("")
})





router.post('/login', (req, res) => {
  
  if(!req.body.usr_mail || !req.body.password){
    return res.status(401).json({success:false,msg:'Usuario o contraseña no presente'})
  }

  db_connection.connect();
  
  db_connection.query(
    'SELECT usr_id FROM Users WHERE usr_mail = ? AND usr_password = ?',
    [req.body.usr_mail,req.body.password],
    function (error, results, fields) {
      

      console.log(results)
      
      if (results.length === 0) {
        // No user found, send a response with success:false
        return res.json({ success: false });
      } else {
        // User found, send a response with success:true
        return res.json({ success: true });
      }
    }
  )
    
  db_connection.end();
      
  res.json({
    success:true
  })
})




