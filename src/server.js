
// ----------- MODULES -----------
import {} from 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import logger from 'morgan'
import os from "os"

// own modules
import router_test from "./routes/template.js"
import router_auth from "./routes/auth/router_auth.js"
import userRoutes from './routes/user.js'; // Importa el archivo de rutas de usuario

import socketRecieverManager from './sockets/socketReciverManager.js'

//oauth modules
import session from 'express-session';
import passport from 'passport'

// ----------- CONFIG -----------


//api
const PORT = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)


//socket.io
export const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "*"//"https://apps.fabrega.cat/fileUpload/"//'http://localhost:5173',
  }
})


// ----------- MIDLEWARE -----------

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'))
}

app.use(session({
  secret: 'secret_session',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


// ----------- ENDPOINTS -----------
app.use("/test",router_test)
app.use("/auth",router_auth)
app.use('/user', userRoutes);

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
  
    console.clear()
    console.log(`API running at:`)
    console.log(`- Local:   ${localUrl}`)
    console.log(`- Network: ${networkUrl}`)
  }

});
