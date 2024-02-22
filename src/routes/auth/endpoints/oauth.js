import express from 'express';
import axios from  'axios'
const router = express.Router();

console.log("TEST");
// Nuevo endpoint que llama a /auth/google
router.get('/oauth', async (req, res) => {
    try {
      // Realizar la solicitud al endpoint /auth/google
      const response = await axios.post('http://localhost:3000/auth/google', req.body);
  
      // Puedes hacer algo con la respuesta, como enviarla de vuelta al cliente
      res.json(response.data);
    } catch (error) {
      console.error(error);
      console.log("MEC");
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  export default router;