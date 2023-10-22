import express from "express";
// import { io } from "../server";

import { jwtVerify } from "../../utils/jwt.js";

const router = express.Router()
export default router


import loginRouter from "./endpoints/login.js"
import signupRouter from "./endpoints/signup.js"
import googleRouter from "./endpoints/google.js"

router.use('',loginRouter)
//        /auth/login
//        /auth/loginjwt

router.use('',signupRouter)
//        /auth/signup

router.use('/google',googleRouter)
//        /auth/google
//        /auth/google/callback


//test protected route
router.post("/protected",jwtVerify,async(req,res)=>{
  const {user} = req
  res.json({success:true,msg:"authentificated",...user.publicData()})
})





