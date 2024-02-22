// Import necessary modules and dependencies
import express from "express";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db_getOrRegisterUserGoogleOauth, db_getUserByGoogleId } from "../../../db/db_users.js";

import loginRouter from "./login.js";
import axios from "axios";



// Initialize Express Router
const router = express.Router();
export default router;
let globalEvtUrl;

// Test route
router.post("/test", (req, res) => {
  res.send("HOLA :)");
});



// Determine the callback URL based on the environment

const isProduction = process.env.NODE_ENV === 'production';

const GOOGLE_CALLBACK_URL = isProduction
  ? "https://api.split-meet.com:4433/auth/google/callback"
  : "http://localhost:3000/auth/google/callback";

console.log(GOOGLE_CALLBACK_URL);

router.get('/', (req, res, next) => {
  // Obtener el valor del parámetro llamado 'parametro' de la URL
  const evtUrl = req.query.evt_url;
  console.log(evtUrl);
  if (evtUrl) {
    // Guardar evtUrl en la sesión
    globalEvtUrl = evtUrl;
  }

  next();
});

// app.use(passport.initialize());
// app.use(passport.session());

// Serialize and deserialize user functions
passport.serializeUser((user, done) => {
  console.log('Serialized user:', user);

  done(null, user.googleId);
});

passport.deserializeUser(async (googleId, done) => {
  console.log("entyra jaaaa");
  try {
    const user = await db_getUserByGoogleId(googleId);

    if (user) {
      user.signJWT();
      return done(null, user.publicData());
    } else {
      throw new Error("No user found");
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    done(error, null);
  }
});


// Google authentication route
router.get('/', passport.authenticate('google', {
  scope: ['email'],
}));

// Callback route after successful authentication
router.get('/callback',
  passport.authenticate('google', { failureRedirect: 'https://www.split-meet.com:4433/login' }),
  async (req, res) => {
    req.user.signJWT();
    console.log(req.user);

    // Ejecutar el código después de iniciar sesión y redirigir al usuario a la página de destino
    console.log(globalEvtUrl);
    if (globalEvtUrl) {
      try {
        const response = await axios.post("https://api.split-meet.com:4433/event/join", {
          token: req.user.jwt,
          evt_url: globalEvtUrl,
        });
        if (response.data) {
          console.log(response.data);
          return res.redirect(`https://www.split-meet.com:4433`);
        }
      } catch (error) {
        console.error('Error al unirse al evento:', error);
        // Manejar el error de unirse al evento según sea necesario
        return res.redirect(`https://www.split-meet.com:4433`);
      }
    } else {
      // Si no se proporciona evt_url, redirige a la página predeterminada
      return res.redirect(`https://www.split-meet.com:4433`);
    }
  }
);


// Función que realiza la autenticación con el token JWT
async function authenticateWithJWT(jwt) {
  try {
    const response = await axios.post("/auth/loginjwt", {
      token: jwt,
    });

    if (response.data) {
      return response.data;
    }
  } catch (e) {
    console.error('Error during JWT authentication:', e);
    throw e; // Re-lanza el error para que sea manejado por el controlador de callback
  }
}

// Google OAuth strategy configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {

    const user = await db_getOrRegisterUserGoogleOauth(profile);
    // Update user object with email or other necessary information
    return done(null, user);
  } catch (error) {
    done(error, null);
  }
}));
