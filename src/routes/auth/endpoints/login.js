import express from "express";


import { db_getUserByMailPassword } from "../../../db/db_users.js";
import { jwtVerify } from "../../../utils/jwt.js";
import { hashPassword } from "../../../utils/crypto.js";



const router = express.Router()
export default router










// LOGIN with JWT
router.post('/loginjwt',jwtVerify, async (req, res) => {
  // Create token
  req.user.signJWT()
  
  //retornar un success
  return res.json({ success: true, ...req.user.publicData()});
      
})






// LOGIN
router.post('/login', async (req, res) => {
  
  //comprueba que se han recibido todos los datos requeridos
  const {usr_mail,usr_pass} = req.body
  if(!usr_mail || !usr_pass){
    return res.status(400).json({success:false,msg:'Usuario o contraseña no presente'})
  }

  // console.log("PASSWORD",usr_pass) //5c6f51c9b50b7550deeda3abc25889237972c11c28560a9ab6dd99f9dc817cb7 user3@example.com
  const pswdHash = hashPassword(usr_pass)

  try{

    const user = await db_getUserByMailPassword(usr_mail,pswdHash)

    console.log(user)

    //si no hay resultados
    if (!user) {
      // No user found, send a response with success:false
      return res.json({ success: false, msg:"User/Password combo doesn't match"});
    }

    // Create token
    user.signJWT()

    //retornar un success
    return res.json({ success: true, ...user.publicData()});

  }catch(err){

    //en caso de error
    console.log(err)
    return res.json({ success: false, msg:"An error occurred" });
  }
      
})
