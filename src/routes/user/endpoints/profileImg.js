import express from "express";
import multer from "multer";
import fs from "fs"
import crypto from "crypto"
import path from "path"

import { db_getUserByID, db_getUserByMailPassword, db_updateUserFields } from "../../../db/db_users.js";
import { jwtUserFromToken, jwtVerify } from "../../../utils/jwt.js";
import axios from "axios";




const router = express.Router()
export default router



//----------------MULTER-CONFIG-----------------------
// configuracion de la creación del archivo para imagenes de perfil

//ruta de ceracion
const PROFILE_IMG_URL = "public/usrProfilePic/"

//file saving configuracion
const storage = multer.diskStorage({
  destination: function (req, file, done) {

    //si no existe la carpeta, entonces crearla
    if (!fs.existsSync(PROFILE_IMG_URL)) {
      fs.mkdirSync(PROFILE_IMG_URL, { recursive: true });
    }

    done(null, PROFILE_IMG_URL);
  },
  filename:async function (req, file, done) {
    //this 2 lines does the same as <jwtVerify>
    const user = await jwtUserFromToken(req.body.token)
    req.user = user

    if(user.oauth) return done("Oauth users cant change profile img",null)

    //recuperamos la extension y generamos el archivo original manteniendo la extension  
    const extension = path.extname(file.originalname)
    const uniqueFilename = `${crypto.randomUUID()}${extension}`


    let filename = uniqueFilename
    if(user.img){
      //si ya tiene una imagen
      const oldExtension = path.extname(user.img)
      if(oldExtension === extension){
        filename = user.img
      }else{
        //si el usuario tiene una imagen entonces la reemplazamos
        fs.unlinkSync(path.join(PROFILE_IMG_URL,user.img))
      }
    }

    //enviar los datos a la siguiente call
    req.originalFileName = file.originalname
    req.uniqueFilename = filename
    req.fileExtension = extension
    done(null, filename)
  },
});
  
// Initialize Multer with the storage configuration
const upload = multer({ storage });





//POST /user/profileImg
router.post('/profileImg',upload.single("img"),async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ success:false,msg: 'No file uploaded'});
  }

  const user = req.user
  user.img = req.uniqueFilename

  //actualizar los datos de usuario en la DB
  db_updateUserFields(user,["usr_img"])
  
  //retornar un success
  return res.json({ success: true});
      
})


//GET /user/profileImg
// gets the user image with the user id given by parammeter
// or also works localhost:3000/usrProfilePic/9e2017ed-721e-474e-857d-7220e905fe17.png
router.get('/profileImg',async (req, res) => {
  const usr_id = req.body.usr_id

  if (!usr_id) {
    return res.status(400).json({ success:false,msg: 'Data required'});
  }

  const user = await db_getUserByID(usr_id)

  if(!user) return res.status(400).json({success:false,msg:"No user found"})

  const absolutePath = path.resolve('public', 'usrProfilePic', user.img)
  return res.sendFile(absolutePath)
  
})















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
