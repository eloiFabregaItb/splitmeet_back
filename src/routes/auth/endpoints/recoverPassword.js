import express from 'express';
import { db_updateUserFields } from '../../../db/db_users.js';
import { hashPassword } from '../../../utils/crypto.js';
import { checkRepasswordUrl } from '../../../utils/recoverPassword.js';

const router = express.Router();


// Update user's name endpoint
// POST /user/recoverPassword
router.post('/recoverPassword', async (req, res) => {
  try {

    const repasswordToken = req.body.token
    const newPassword = req.body.password

    if(!newPassword){
      return res.json({success:false,message:"password necesario"})
    }

    if(!repasswordToken ){
      return res.json({success:false,message:"token necesario"})
    }

    const user = await checkRepasswordUrl(repasswordToken)
    
    if(!user){
      return res.json({success:false,message:"acceso no autorizado"})
    }

    
    
    const encryptedPassword = hashPassword(user.password)
    console.log("OLD PASSWORD", user.password)
    console.log("NEW PASSWORD", encryptedPassword)
    user.password = encryptedPassword

    await db_updateUserFields(user,["usr_password"])

    res.json({ success:true, message: 'User updated successfully', user:user.publicData() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, error: 'Internal server error' });
  }
});

export default router;