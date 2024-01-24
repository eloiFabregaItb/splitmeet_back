import express from "express";
import multer from "multer";
import fs from "fs"
import crypto from "crypto"
import path from "path"

import axios from "axios";
import { makeStorageSingleFile } from "../../../utils/makeStorage.js";
import { makeEventFromBody } from "../events.js";
import {db_updateEventFields} from "../../../db/db_events.js"



const router = express.Router()
export default router




//----------------MULTER-CONFIG-----------------------
// configuracion de la creación del archivo para imagenes de perfil

//ruta de ceracion
const EVENT_IMG_URL = "public/evtPic/"
const storage = makeStorageSingleFile(EVENT_IMG_URL,async ({req,extension,user})=>{


  console.log(req.body,extension,user)
  
  const ev = await makeEventFromBody(req.body)
  if(!ev) throw new Error("No event identification")

  req.event = ev
  if(ev.imgUrl){
    //si ya tiene una imagen
    const oldExtension = path.extname(ev.imgUrl)
    if(oldExtension === extension){
      return user.img
    }else{
      //si el usuario tiene una imagen entonces la reemplazamos
      fs.unlinkSync(path.join(EVENT_IMG_URL,ev.imgUrl))
    }
  }
  

  return `${crypto.randomUUID()}${extension}`
})
  
// Initialize Multer with the storage configuration
const upload = multer({ storage });





//POST /event/img
router.post('/img',upload.single("img"),async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ success:false,msg: 'No file uploaded'});
  }

  const event = req.event
  event.imgUrl = req.uniqueFilename

  //actualizar los datos de usuario en la DB
  await db_updateEventFields(event,["evt_image_url"])
  
  //retornar un success
  return res.json({ success: true, filename:req.uniqueFilename });
      
})


//GET /user/profileImg
// gets the user image with the user id given by parammeter
// or also works localhost:3000/usrProfilePic/9e2017ed-721e-474e-857d-7220e905fe17.png
// router.get('/profileImg',async (req, res) => {
//   const usr_id = req.body.usr_id

//   if (!usr_id) {
//     return res.status(400).json({ success:false,msg: 'Data required'});
//   }

//   const user = await db_getUserByID(usr_id)

//   if(!user) return res.status(400).json({success:false,msg:"No user found"})

//   const absolutePath = path.resolve('public', 'usrProfilePic', user.img)
//   return res.sendFile(absolutePath)
  
// })















export async function downloadAndSaveUserImage(url) {
  try {
    // Make an HTTP GET request to the URL
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    const extension = response?.headers["content-type"]?.split("image/")[1] || "png"
    const newFilename = `${crypto.randomUUID()}.${extension}`

    // Specify the absolute path where the image will be saved
    const absolutePath = path.resolve('public', 'usrProfilePic', newFilename);

    // Write the image data to the specified path
    await fs.writeFileSync(absolutePath, response.data, 'binary');

    return newFilename
  } catch (error) {
    return undefined
  }
}
