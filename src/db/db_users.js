import { User } from "../models/User.js";
import db from "./db.js";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import { triggerAsyncId } from "async_hooks";
import { downloadAndSaveUserImage } from "../routes/user/endpoints/profileImg.js";

const JWT_SECRET = process.env.JWT_SECRET || "secretJWT"

export async function db_getUserByMailPassword(usr_mail,usr_pass) {
  const [rows,fields] = await db.query(
    "SELECT * FROM Users WHERE usr_mail = ? AND usr_password = ?",
    [usr_mail,usr_pass]
  )

  if(rows && rows[0]){
    return new User(rows[0])
  }

  return undefined
}


export async function db_getUserByID(id){
  if(!id) return

  try{
    const [rows] = await db.query(
      "SELECT * FROM Users WHERE usr_id = ?",
      [id]
    )

    if(rows && rows[0]){
      return( new User(rows[0]))
    }
  }catch(err){
    console.error(err)
  }
}



export async function db_getUserByJWT(token){
  if (!token) return
  const {mail,usr_id,iat,exp} = jwt.verify(token, JWT_SECRET);
  return await db_getUserByID(usr_id)   
}





//this function searches in the DB for a user with googleId and OAUTH
//it returns an object <User> or undefined
export async function db_getUserByGoogleId(googleId){
  if (!googleId) return
  
  try {
    const [rows,fields] = await db.query(
      "SELECT * FROM Users WHERE usr_google_id = ? AND usr_oauth = 1",
      [googleId]
    )

    if(rows && rows[0]){
      return new User(rows[0])
    }
    
  } catch (err) {
    console.error(err)
  }
}





//this function is called by the google oauth method
//it try to get a user from the DB with the google profile
//if the user is not in the DB it will register 
//this function returns an object <User>
export async function db_getOrRegisterUserGoogleOauth(googleProfile){

  const googleId = googleProfile.id
  const displayName = googleProfile.displayName
  const picture = googleProfile._json.picture

  try {

    const user = await db_getUserByGoogleId(googleId)
    if(user) return user

    const usr_id =  crypto.randomUUID()//usr_id

    const filename = await downloadAndSaveUserImage(picture)

    if(filename){
      await db.query(
        "INSERT INTO Users (usr_id,usr_mail,usr_name,usr_oauth,usr_img,usr_google_id,usr_mail_validated) VALUES (?,?,?,?,?,?,?);",
        [usr_id, "", displayName, true, filename,googleId,true]
      )
    }else{
      await db.query(
        "INSERT INTO Users (usr_id,usr_mail,usr_name,usr_oauth,usr_google_id,usr_mail_validated) VALUES (?,?,?,?,?,?);",
        [usr_id, "", displayName, true,googleId,true]
      )
    }


    return User.fromGoogle(usr_id,googleId,displayName,picture)

  } catch (err) {
    console.error(err)
  }
}






export async function db_updateUserFields(user,fields){

  const allFields = {
    usr_mail_validated:user.mailValidated,
    usr_mail:user.mail,
    usr_name:user.name,
    usr_password:user.password,
    usr_oauth:user.oauth,
    usr_img:user.img,
    usr_google_id:user.googleId,
    usr_date_creation:user.dateCreation,
  }

  const syntax = `UPDATE Users SET 
  ${fields.map(x=>allFields[x] ? x + " = ? ":"").join(",")}
  WHERE usr_id = ?`
    
  const values = fields.flatMap(x=>allFields[x]?allFields[x]:[])
  values.push(user.id)

  try{
    await db.query(syntax,values)
  }catch(err){
    console.log(err)
  }
}