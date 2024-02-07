import express from 'express';
import { jwtVerify } from "../../../utils/jwt.js";
import { db_getUserByJWT, db_updateUserFields } from '../../../db/db_users.js';
import { hashPassword } from '../../../utils/crypto.js';

const router = express.Router();



// Update user's name endpoint

// Update user's name endpoint
router.post('/updateUser', jwtVerify, async (req, res) => {
  const userId = req.user.id;
  const updatedFields = req.body;

  try {
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - You do not have permission to update this user' });
    }

    const user = req.user;

    const fieldMappings = {
      'name': 'usr_name',
      'mail': 'usr_mail',
      'password': 'usr_password',
    };

    const fieldsToUpdate = Object.keys(updatedFields).map(key => {
      const dbFieldName = fieldMappings[key] || key;
      return dbFieldName;
    });

    for (const key in updatedFields) {
      if (updatedFields.hasOwnProperty(key)) {
        if (user.hasOwnProperty(key)) {
          if(key == "password"){
            user[key] = hashPassword(updatedFields[key])

          }else{
            user[key] = updatedFields[key];
          }
        }
        
      }
    }

    await db_updateUserFields(user, fieldsToUpdate);
    // console.log(user);

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;