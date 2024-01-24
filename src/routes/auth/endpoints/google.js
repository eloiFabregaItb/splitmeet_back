// Importa los módulos y dependencias necesarios
import express from "express";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db_getOrRegisterUserGoogleOauth, db_getUserByGoogleId } from "../../../db/db_users.js";
import axios from "axios";
import { jwtVerify } from "../../../utils/jwt.js";

// Inicializa el enrutador de Express
const router = express.Router();

// Ruta de prueba
router.post("/test", (req, res) => {
  res.send("¡HOLA! :)");
});

// Determina la URL de retorno según el entorno
const isProduction = process.env.NODE_ENV === 'production';
const GOOGLE_CALLBACK_URL = isProduction
  ? "https://api.split-meet.com:4433/auth/google/callback"
  : "http://localhost:3000/auth/google/callback";

// Inicializa Passport en la aplicación principal
router.use(passport.initialize());
router.use(passport.session());

// Serializa y deserializa las funciones del usuario
passport.serializeUser((user, done) => {
  user.signJWT();
  console.log('Serialized user:', user);
  done(null, user.googleId);
});

passport.deserializeUser(async (googleId, done) => {
  try {
    const user = await db_getUserByGoogleId(googleId);
    if (user) {
      user.signJWT();
      return done(null, user.publicData());
    } else {
      throw new Error("No se encontró al usuario");
    }
  } catch (error) {
    console.error(error);
    done(error, null);
  }
});

// Ruta de autenticación de Google
router.get('/', passport.authenticate('google', { scope: ['email'] }));

// Ruta de retorno después de la autenticación exitosa

router.get('/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      req.user.signJWT();
      console.log("Autenticación exitosa");

      // Guardar la información en localStorage
      const userInformation = {
        success: true,
        ...req.user.publicData()
      };

      // Convierte el objeto a cadena JSON y guárdalo en localStorage
      localStorage.setItem('userInformation', JSON.stringify(userInformation));

      // Enviar la información como JSON
      return res.json(userInformation);
    } catch (error) {
      console.error('Error durante la autenticación:', error);
      return res.json({ success: false, msg: "An error occurred" });
    }
  }
);



// Función que realiza la autenticación con el token JWT

// Configuración de la estrategia de Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await db_getOrRegisterUserGoogleOauth(profile);
    return done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

export default router;
