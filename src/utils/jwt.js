import jwt from "jsonwebtoken";


function jwtSign(userKey,seconds){
    return jwt.sign({user_key:userKey}, process.env.JWT_SECRET, { expiresIn:`${seconds}s` });
  }
  

export function jwtVerify (req, res, next){
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({success:false,msg:"A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({success:false,msg:"Invalid Token"});
  }
  return next();
};
