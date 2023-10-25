import mysql from "mysql2"


//DATABASE CONNECTION
const db_pool = mysql.createPool({
    host: process.env.DB_URL || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "1234",
    database: process.env.DB_DATABASE || "splitmeet",
    port: process.env.DB_PORT || 3306
});

const db = db_pool.promise();
export default db

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