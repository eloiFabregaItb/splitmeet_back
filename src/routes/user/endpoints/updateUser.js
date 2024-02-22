import express from 'express';
import { jwtVerify } from "../../../utils/jwt.js";
import { db_updateUserFields } from '../../../db/db_users.js';
import { hashPassword } from '../../../utils/crypto.js';

const router = express.Router();

//public : DB
const fieldMappings = {
  'name': 'usr_name',
  'mail': 'usr_mail',
  'password': 'usr_password',
  //'oldPassword'
};

// Update user's name endpoint
// POST /user/updateUser
router.post('/updateUser', jwtVerify, async (req, res) => {
  const updatedFields = req.body;

  const user = req.user;  

  try {

    const fieldsToUpdate = []

    for (const field in updatedFields) {
      
      if (user.hasOwnProperty(field) && updatedFields[field] && field !== "token" ) { // usuario tiene el campo

        fieldsToUpdate.push(fieldMappings[field])

        if(field === "password"){

          if(!updatedFields.hasOwnProperty("oldPassword")){
            return res.json({success: false, message:"Missing oldPassword"});
          }

          const oldHash = hashPassword(updatedFields.oldPassword)
          const newPassword = hashPassword(updatedFields[field])

          if(newPassword === user.password){
            return res.json({success:false,message:"Password cannot be the same as current password."})
          }

          if(oldHash !== user.password){
            return res.json({success:false, message:"Wrong Password!"})
          }

          user[field] = newPassword

          
        }else{
          user[field] = updatedFields[field];
        }
        
      }
    }

    if(fieldsToUpdate.length === 0){
      return res.json({success:false,message:"Ningun campo"})
    }

    await db_updateUserFields(user, fieldsToUpdate );
    // console.log(user);

    res.json({ success:true, message: 'User updated successfully', user:user.publicData() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, error: 'Internal server error' });
  }
});

export default router;