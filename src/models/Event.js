import db from "../db/db.js";
import { jwtSign } from "../utils/jwt.js";
import { Expenses } from "./Expenses.js";
import { User } from "./User.js";

export class Event {
  constructor({
    evt_id,
    usr_id_creator,
    evt_name,
    evt_url,
    evt_image_url,
    evt_creation_timestamp,
    evt_modification_timestamp,
  }) {
    this.id = evt_id;
    this.cretorId = usr_id_creator;
    this.name = evt_name;
    this.url = evt_url;
    this.imgUrl = evt_image_url;
    this.creation = evt_creation_timestamp;
    this.modification = evt_modification_timestamp;
  }

  async getUsers() {
    if (this.users) return this.users;

    const [usersRows] = await db.query(
      `SELECT Users.* FROM Users
    JOIN User_participation ON Users.usr_id = User_participation.usr_id
    JOIN Events ON User_participation.evt_id = Events.evt_id
    WHERE Events.evt_id = ? AND User_participation.active = 1`,
      [this.id]
    );

    if (usersRows.length <= 0) return undefined;

    const self = this;

    const users = usersRows.map(function (x) {
      const user = new User(x);
      if (user.id === self.cretorId) {
        user.isCreator = true;
      }
      return user;
    });

    this.users = users;
    this.creator = users.find((x) => x.isCreator);
    // console.log(this.users);

    return users;
  }

  publicData() {
    const result = {
      id: this.id,
      creatorId: this.cretorId,
      name: this.name,
      url: this.url,
      imgUrl: this.imgUrl,
      creation: this.creation,
      modification: this.modification,
    };

    if (this.users) {
      result.users = this.users.map((x) => x.publicData());
    }
    if (this.creator) {
      result.creator = this.creator.publicData();
    }

    return result;
  }



  async getExpenses(){
    let [rows, fields] = await db.query(`SELECT *
    FROM Expensses
    JOIN Expensses_transaction ON Expensses.exp_id = Expensses_transaction.exp_id
    WHERE Expensses.evt_id = ?`,[this.id]);
    this.expenses = new Expenses(rows)
    return this.expenses
  }

  async getBalances(){
    if(!this.expenses) await this.getExpenses()
    if(!this.users) await this.getUsers()

    this.expenses.getBalance(this.users)
  }
}
