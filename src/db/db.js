import mysql from "mysql2"

const db_pool = mysql.createPool({
    host: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

export const db = db_pool.promise();


/*++++++++ EXAMPLE USAGE +++++++++++


  try{

    const [rows,fields] = await db.query(
      "SELECT * FROM Users WHERE usr_mail = ? AND usr_password = ?",
      [usr_mail,password]
    )

    if (!rows || rows.length === 0) {
      // No user found, send a response with success:false
      return res.json({ success: false, msg:"User/Password combo doesn't match"});
    }

    const {usr_password,usr_id, ...publicUser} = rows[0]

    return res.json({ success: true, usr_data:publicUser});
    

  }catch(err){
    console.log(err)
    return res.json({ success: false, msg:"An error occurred" });
  }


*/