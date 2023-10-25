import express from "express"
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { db_getOrRegisterUserGoogleOauth, db_getUserByGoogleId } from "../../../db/db_users.js";

 


const router = express.Router()
export default router

router.post("/test", (req, res) => {
  res.send("HOLA :)")
})


const GOOGLE_CALLBACK_URL = "https://qjkvldfn-5173.uks1.devtunnels.ms/"//://172.30.4.18:5173/home" //'http://localhost:3000/auth/google/callback'
// Configure the Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL, // Actualiza con tu URI de redirección
}, async (accessToken, refreshToken, profile, done) => {

  console.log(profile)
  //crea el objeto usuario a partir del perfil de google
  //hace el login, o lo registra si no lo estaba
  const user = await db_getOrRegisterUserGoogleOauth(profile)

  return done(null, user);
}));





passport.serializeUser((user, done) => {
  done(null, user.googleId);
});

passport.deserializeUser(async (googleId, done) => {
  const user = await db_getUserByGoogleId(googleId)
  user.signJWT()

  if (user) return done(null, user.publicData())

  return done("No user found", null)
});

// Route to initiate Google authentication
router.get('/', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login'],
}));

// Redirect route after successful authentication
router.get('/callback', passport.authenticate('google', {
  successRedirect: 'http://172.30.4.18:5173/home', // Redirect to the profile page (adjust as needed)
  failureRedirect: 'http://172.30.4.18:5173/login', // Redirect to the main page in case of failure
}));
