import { jwtSign } from "../utils/jwt.js"


export class User {

  constructor({
    usr_id,
    usr_mail,
    usr_name,
    usr_password,
    usr_oauth,
    usr_img,
  }) {
    this.id = usr_id //private
    this.mail = usr_mail
    this.name = usr_name
    this.password = usr_password //private
    this.oauth = usr_oauth
    this.img = usr_img
  }


  publicData(){
    const result ={
      mail:this.mail,
      name:this.name,
      oauth:this.oauth,
      img:this.img,
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

