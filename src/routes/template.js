import express from "express";
// import { io } from "../server";

const router = express.Router()
export default router

router.get('/', (req, res) => {
  res.json({test:true})
  // io.emmit("")
})



