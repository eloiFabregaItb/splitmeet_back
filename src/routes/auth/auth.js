import express from "express";
// import { io } from "../server";

import { jwtVerify } from "../../utils/jwt.js";

const router = express.Router();
export default router;

import loginRouter from "./endpoints/login.js";
import signupRouter from "./endpoints/signup.js";
import googleRouter from "./endpoints/google.js";
import validateMailRouter from "./endpoints/validateMail.js";
import resendValidate from "./endpoints/resendValidate.js"
import forgotten from "./endpoints/forgotten.js"
import recoverPassword from "./endpoints/recoverPassword.js"

router.use("", loginRouter);
//        /auth/login
//        /auth/loginjwt

router.use("", signupRouter);
//        /auth/signup

router.use("/google", googleRouter);
//        /auth/google
//        /auth/google/callback

router.use("cod", validateMailRouter);
//        /auth/validateMail

router.use("",resendValidate);
//        /auth/resendValidate

router.use("",forgotten);
//        /auth/forgotten


router.use("",recoverPassword);
//        /auth/recoverPassword

//test protected route
router.post("/protected", jwtVerify, async (req, res) => {
  const { user } = req;
  res.json({ success: true, msg: "authentificated", ...user.publicData() });
});
