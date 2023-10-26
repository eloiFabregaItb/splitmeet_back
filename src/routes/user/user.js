import express from 'express';


import route_profileImg from "./endpoints/profileImg.js"
import route_events from "./endpoints/evetns.js"

const router = express.Router();
export default router;

router.use("",route_profileImg)
//  /user/profileImg


router.use("",route_events)
//  /user/events



router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, msg: 'Usuario no autenticado' });
  }
});


router.post("/profileImg",async (req,res)=>{
  
})