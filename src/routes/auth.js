import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from "../db/db.js";

const router = express.Router();

// Configure the Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: '384807507489-0u90koe30ia44ibbtqitqloipk193i8h.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3000/auth/google/callback', // Actualiza con tu URI de redirección
}, (accessToken, refreshToken, profile, done) => {
  // Save or retrieve user information as needed.
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Route to initiate Google authentication
router.get('/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/plus.login'],
}));

// Redirect route after successful authentication
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/user/profile', // Redirect to the profile page (adjust as needed)
  failureRedirect: '/', // Redirect to the main page in case of failure
}));

// Route to log in with username and password
router.post('/login', async (req, res) => {
  const { usr_mail, password } = req.body;
  if (!usr_mail || !password) {
    return res.status(401).json({ success: false, msg: 'User or password not provided' });
  }

  try {
    const [rows, fields] = await db.query(
      "SELECT * FROM Users WHERE usr_mail = ? AND usr_password = ?",
      [usr_mail, password]
    );

    if (!rows || rows.length === 0) {
      return res.json({ success: false, msg: "User/Password combination doesn't match" });
    }

    const { usr_password, usr_id, ...publicUser } = rows[0];

    return res.json({ success: true, usr_data: publicUser });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, msg: "An error occurred" });
  }
});

export default router;
