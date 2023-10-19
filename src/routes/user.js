import express from 'express';

const router = express.Router();

router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, msg: 'Usuario no autenticado' });
  }
});

export default router;
