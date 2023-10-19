import express from "express";
// import { io } from "../server";
import jwt  from "jsonwebtoken";
import { db } from "../db/db.js";
import crypto from "crypto"
import { jwtSign, jwtVerify } from "../utils/jwt.js";


const router = express.Router()
export default router




router.get('/', (req, res) => {
  res.json({test:true})
  // io.emmit("")
})



router.post("/protected",jwtVerify,async(req,res)=>{
  const {usr_id} = req
  res.json({success:true,msg:"authentificated",user:req.by})
})


// LOGIN with JWT
router.post('/loginjwt',jwtVerify, async (req, res) => {
  try{
    const {usr_id} = req

    //query a la DB
    const [rows,fields] = await db.query(
      "SELECT * FROM Users WHERE usr_id = ?",
      [req.usr_id]
    )

    //si no hay resultados
    if (!rows || rows.length === 0) {
      // No user found, send a response with success:false
      return res.json({ success: false, msg:"User/Password combo doesn't match"});
    }

    //separar informacion sensible
    const {usr_password,usr_id:usr_id2, ...publicUser} = rows[0]
    // Create token
    const token = jwtSign({usr_mail:publicUser.usr_mail, usr_id })
    //retornar un success
    return res.json({ success: true, ...publicUser,jwt:token});
  }catch(err){
    //en caso de error
    console.log(err)
    return res.json({ success: false, msg:"An error occurred" });
  }
      
})


// LOGIN
router.post('/login', async (req, res) => {
  
  //comprueba que se han recibido todos los datos requeridos
  const {usr_mail,usr_pass} = req.body
  if(!usr_mail || !usr_pass){
    return res.status(400).json({success:false,msg:'Usuario o contraseña no presente'})
  }

  try{

    //query a la DB
    const [rows,fields] = await db.query(
      "SELECT * FROM Users WHERE usr_mail = ? AND usr_password = ?",
      [usr_mail,usr_pass]
    )

    //si no hay resultados
    if (!rows || rows.length === 0) {
      // No user found, send a response with success:false
      return res.json({ success: false, msg:"User/Password combo doesn't match"});
    }



    //separar informacion sensible
    const {usr_password,usr_id, ...publicUser} = rows[0]


        // Create token
        const token = jwtSign({usr_mail, usr_id })
    

    //retornar un success
    return res.json({ success: true, ...publicUser,jwt:token});
    

  }catch(err){

    //en caso de error
    console.log(err)
    return res.json({ success: false, msg:"An error occurred" });
  }
      
})





// LOGIN
router.post('/signup', async (req, res) => {
  
  //comprueba que se han recibido todos los datos requeridos
  const {usr_mail,usr_pass,usr_name} = req.body
  if(!usr_mail || !usr_pass || !usr_name){
    return res.status(409).json({success:false,msg:'Campos requeridos'})
  }

  const usr_id = crypto.randomUUID()
  const encryptedPassword = usr_pass // TODO await crypto.hash(usr_pass, 10);

  try{
    const [rows] = await db.query("INSERT INTO Users (usr_id,usr_mail,usr_name,usr_password,usr_oauth,usr_img) VALUES (?,?,?,?,?,?);",
    [usr_id,usr_mail.toLowerCase(),usr_name,encryptedPassword,0,"default.img"])

    console.log(rows)


    // Create token
    const token = jwtSign({usr_mail, usr_id })


    //retornar un success
    return res.json({ success: true, jwt:token});
    

  }catch(err){

    if (err?.code === 'ER_DUP_ENTRY') {
      return res.json({ success: false, msg:"Mail duplicated" });
    }

    //en caso de error
    console.log(err)
    return res.json({ success: false, msg:"An error occurred" });
  }
      
})




