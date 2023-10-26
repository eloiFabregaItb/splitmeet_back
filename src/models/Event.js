import { jwtSign } from "../utils/jwt.js"


export class Event {
  constructor({
    evt_id,
    usr_id_creator,
    evt_name,
    evt_url,
    evt_img_url,
  }) {
    this.id = evt_id
    this.cretorId = usr_id_creator
    this.name = evt_name
    this.url = evt_url
    this.imgUrl = evt_img_url
  }


}

