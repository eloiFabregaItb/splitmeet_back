
// ----------- MODULES -----------
import express from 'express'
import dotenv from "dotenv"
// import { createClient } from '@libsql/client' //BBDD
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import logger from 'morgan'
import os from "os"

// own modules
import templateRouter from "./routes/template.js"
import socketRecieverManager from './sockets/socketReciverManager.js'

// ----------- CONFIG -----------

dotenv.config()

const PORT = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)

export const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "*"//"https://apps.fabrega.cat/fileUpload/"//'http://localhost:5173',
  }
})


// ----------- MIDLEWARE -----------

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'))
}

// ----------- ENDPOINTS -----------
app.use("/test",templateRouter)

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