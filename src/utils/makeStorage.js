
import multer from "multer";
import fs from "fs"
import crypto from "crypto"
import path from "path"

import { jwtUserFromToken } from "../utils/jwt.js";



export function makeStorageSingleFile(url,
  generateFilename=(extension,originalName,user)=>{
    return `${crypto.randomUUID()}${extension}`
  }
){

  //file saving configuracion
  return multer.diskStorage({
    destination: function (req, file, done) {
  
      //si no existe la carpeta, entonces crearla
      if (!fs.existsSync(url)) {
        fs.mkdirSync(url, { recursive: true });
      }
  
      done(null, url);
    },
    filename:async function (req, file, done) {
      //this 2 lines does the same as <jwtVerify>
      const user = await jwtUserFromToken(req.body.token)
      req.user = user


      if(!user) return done("No logged users cant upload images",null)
  
      //recuperamos la extension y generamos el nuevo nombre manteniendo la extension  
      const extension = path.extname(file.originalname)  

      try{
        let filename = await generateFilename({extension,originalname:file.originalname,file,user,req})
        //enviar los datos a la siguiente call
        req.originalFileName = file.originalname
        req.uniqueFilename = filename
        req.fileExtension = extension
        done(null, filename)

      }catch(err){
        return done(err.message,null)
      }
  



      



  
    },
  })

}