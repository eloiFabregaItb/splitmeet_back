
// ----------- MODULES -----------
import {} from 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import logger from 'morgan'
import os from "os"
import { db } from './db/db.js'
import cors from "cors"

// own modules
import router_test from "./routes/template.js"
import router_auth from "./routes/auth.js"

import socketRecieverManager from './sockets/socketReciverManager.js'

// ----------- CONFIG -----------


//api
const PORT = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)



//DATABASE CONNECTION
// const [rows] = await db.query("SELECT * FROM Users")
// // const [rows] = await db.query("INSERT INTO Users (usr_id,usr_mail,usr_name,usr_password,usr_oauth,usr_img) VALUES (?,?,?,?,?,?);",
// // ["6c1fbd83-9e4a-45f2-8d84-17f74289eloi","elgrefa@gmail.com","elioputo","miau",0,"default.img"])
// console.log(rows)







//socket.io
export const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "*"//"https://apps.fabrega.cat/fileUpload/"//'http://localhost:5173',
  }
})


// ----------- MIDLEWARE -----------
if(process.env.NODE_ENV === 'development'){
  app.use(cors({
    origin: '*'
  }))
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'))
}

// ----------- ENDPOINTS -----------
app.use("/test",router_test)
app.use("/auth",router_auth)

// ----------- SOCKET.IO -----------
io.on('connection', socketRecieverManager)


// ----------- SERVER -----------
server.listen(PORT, () => {
  // Find the IPv4 addresses for internal network interfaces
  if(process.env.NODE_ENV === 'development'){
    const interfaces = os.networkInterfaces();
    const addresses = Object.values(interfaces)
      .flat()
      .filter(iface => iface.family === 'IPv4' && !iface.internal)
      .map(iface => iface.address);
  
    const localUrl = `http://localhost:${PORT}`;
    const networkUrl = `http://${addresses.length > 0 ? addresses[0] : 'localhost'}:${PORT}`;
  
    console.log(`API running at:`)
    console.log(`- Local:   ${localUrl}`)
    console.log(`- Network: ${networkUrl}`)
  }

});