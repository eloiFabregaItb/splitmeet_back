import express from "express";


import { db_getUserByMailPassword } from "../../db/db_users.js";
import { jwtVerify } from "../../utils/jwt.js";



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

  try{

    const user = await db_getUserByMailPassword(usr_mail,usr_pass)

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
