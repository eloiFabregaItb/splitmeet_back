
function jwtSign(userKey,seconds){
    return jwt.sign({user_key:userKey}, process.env.JWT_SECRET, { expiresIn:`${seconds}s` });
  }
  