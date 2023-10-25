import { jwtSign } from "../utils/jwt.js"


export class User {
  constructor({
    usr_id,
    usr_mail,
    usr_name,
    usr_password,
    usr_oauth,
    usr_img,
    usr_date_creation,
    usr_google_id,
    usr_mail_validated = false
  }) {
    this.id = usr_id //private
    this.mail = usr_mail
    this.name = usr_name
    this.password = usr_password //private
    this.oauth = usr_oauth
    this.img = usr_img
    this.dateCreation = usr_date_creation //private
    this.googleId = usr_google_id  //private
    this.mailValidated = usr_mail_validated
  }

  //create a user from google credentials
  // const user = new User.fromGoogle()
  static fromGoogle(usr_id,googleId, displayName, imgUrl) {
    // Create a User object for Google login
    return new User({
      usr_id: usr_id,
      usr_mail: null,
      usr_name: displayName,
      usr_password: null,
      usr_oauth: true,
      usr_img: imgUrl,
      usr_date_creation: null,
      usr_google_id: googleId,
      usr_mail_validated: true,
    });
  }



  //esta funcion se llama en las respuestas para mandar
  //el objeto user a frontend sin enviar datos comprometidos
  publicData(){
    const result ={
      mail:this.mail,
      name:this.name,
      oauth:this.oauth,
      img:this.img === "NULL" || !null ? "default.png" : this.img,
      mailValidated:this.mailValidated
    }

    if(this.jwt){
      result.jwt=this.jwt
    }

    return result
  }

  signJWT(){
    this.jwt = jwtSign({mail:this.mail,usr_id:this.id})
    return this.jwt
  }
}

