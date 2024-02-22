import { simplifyTransactionMatrix } from "../../algorithm/splitmeet.js"

export class Expenses{
  constructor(rows){
    this.list = [] //las lista de expenses

    //datos comunes entre todas las transactions

    const expensesList = Object.values(Object.groupBy(rows,v=>v.exp_id))
    this.list = expensesList.map(x=>new Expense(x))

  }

  getBalance(users){

    this.users = users

    /*
    GENERA MATRIZ DE PRESTAMOS
    las filas representan los usuarios que han prestado,
    las columnas representan los usuarios que han pedido
    
    */

    const userIds = users.map(x=>x.id)
    
    const balanceMatrix = Array.from({length:users.length}).map(_=>Array.from({length:users.length}).fill(0))

    for (const exp of this.list) {
      const i = userIds.indexOf(exp.usrLenderId)
      //esta es la index del prestador (fila)

      for (const transaction of exp.list) {
        const j = userIds.indexOf(transaction.usrBorrowerId)
        //este es el index del adeudado (columna)

        //keep the graph matrix symetric so A>B debt cancels with B>A
        if(i!==j){
          balanceMatrix[j][i]-= transaction.amount
          balanceMatrix[i][j]+= transaction.amount
        }
      }
    }

    this.balance = balanceMatrix
    return balanceMatrix

  }


  publicData(){
    const result = {
      list:this.list,
      
    }
    if(this.balance){
      result.balance=this.balance
      result.simply = simplifyTransactionMatrix(this.balance,this.users)    

    }

    return result
  }

}

export class Expense{
  constructor(rows){

    this.id = rows[0].exp_id
    this.usrCreatorId = rows[0].usr_id_creator
    this.usrLenderId = rows[0].usr_id_lender

    this.concept = rows[0].exp_concept
    this.description = rows[0].exp_description
    this.date = rows[0].exp_data
    this.coords = rows[0].exp_coords.split(", ")

    this.photos = []
    if(rows[0].exp_foto1){
      this.photos.push(rows[0].exp_foto1)
    }
    if(rows[0].exp_foto2){
      this.photos.push(rows[0].exp_foto2)
    }
    if(rows[0].exp_foto3){
      this.photos.push(rows[0].exp_foto3)
    }


    //las transactions de una expense
    this.list = rows.map(x=>({
      id: x.tra_id,
      usrBorrowerId: x.usr_id_borrower,
      amount:x.tra_amount
    }))

    this.total = rows.reduce((acc,v)=>acc+v.tra_amount,0)
  }

}



/*
[
  [0,-5,-6],
  [5,0,7],
  [6,-7,0]
]

user0 -(5$)-> user1
user0 -(6$)-> user2
user2 -(7$)-> user1

user0 -(11$)-> user2
user2 -(12$)-> user1

user0 -(11$)-> user1
user2 -(1$)-> user1


*/