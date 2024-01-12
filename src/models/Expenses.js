export class Expenses{
  constructor(rows){
    this.list = [] //las lista de expenses

    //datos comunes entre todas las transactions

    const expensesList = Object.values(Object.groupBy(rows,v=>v.exp_id))
    this.list = expensesList.map(x=>new Expense(x))
    // console.log(this.list)
    // console.log(this.list[0])
    // console.log(this.list[1])

  }

  getBalance(users){

    /*
    GENERA MATRIZ DE PRESTAMOS
    las filas representan los usuarios que han prestado,
    las columnas representan los usuarios que han pedido
    
    */
    const userIds = users.map(x=>x.id)
    
    const balanceMatrix = Array.from({length:users.length}).map(_=>Array.from({length:users.length}))
    console.log(userIds)
    console.log(balanceMatrix)

    for (const exp of this.list) {
      const i = userIds.indexOf(exp.usrLenderId)
      //esta es la index del prestador (fila)

      // for (const transaction of exp.list) {
      // const j = userIds.indexOf(transaction.usrBorrowerId)
      // balanceMatrix[i][j]+=transaction.amout
      // }
    }


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
