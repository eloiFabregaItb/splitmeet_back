
// ----------- MODULES -----------
import {} from 'dotenv/config'

import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import logger from 'morgan'
import os from "os"
import cors from "cors"

// own modules
import router_auth from "./routes/auth/auth.js"
import router_user from './routes/user/user.js'
import router_events from "./routes/events/events.js"
import router_test from "./routes/test/test.js"

import socketRecieverManager from './sockets/socketReciverManager.js'
//oauth modules
import session from 'express-session';
import passport from 'passport'
import { getNowTimestamp } from './utils/time.js'

import "./testing.js"

// ----------- CONFIG -----------

const NODE_ENV = process.env.NODE_ENV || "production"
const NODE_ENV_PRODUCTION = process.env.NODE_ENV_PRODUCTION || "production"
const NODE_ENV_DEVELOPMENT = process.env.NODE_ENV_DEVELOPMENT || "development"


export const IS_IN_PRODUCTION = NODE_ENV !== NODE_ENV_DEVELOPMENT






//api
const PORT = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)





// ----------- SOCKET.IO -----------
export const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "*"//"https://apps.fabrega.cat/fileUpload/"//'http://localhost:5173',
  }
})
io.on('connection', socketRecieverManager)




// ----------- MIDLEWARE -----------
if(!IS_IN_PRODUCTION){
  app.use(cors({origin: '*'}))
  app.use(logger('dev'))
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


//google oauth
app.use(session({
  secret: 'secret_session',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());






// ----------- ENDPOINTS -----------
app.use("/auth",router_auth)
app.use('/user',router_user)
app.use('/event',router_events)
if(!IS_IN_PRODUCTION){
  app.use("/test",router_test)
}











// ----------- SERVER -----------
server.listen(PORT, () => {
  // Find the IPv4 addresses for internal network interfaces
  if(!IS_IN_PRODUCTION){
    const interfaces = os.networkInterfaces();
    const addresses = Object.values(interfaces)
      .flat()
      .filter(iface => iface.family === 'IPv4' && !iface.internal)
      .map(iface => iface.address);
  
    const localUrl = `http://localhost:${PORT}`;
    const networkUrl = `http://${addresses.length > 0 ? addresses[0] : 'localhost'}:${PORT}`;
  
    // console.clear()
    console.log(`API running at:`)
    console.log(`- Local:   ${localUrl}`)
    console.log(`- Network: ${networkUrl}`)
  }

});
