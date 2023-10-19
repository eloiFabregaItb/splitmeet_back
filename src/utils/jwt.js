import jwt from "jsonwebtoken";

const JWT_TIMEOUT = process.env.JWT_TIMEOUT || "48h"
const JWT_SECRET = process.env.JWT_SECRET || "secretJWT"

export function jwtSign(data){
    return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_TIMEOUT });
}
  










/**
 * Esta funcion 
 * 
 
EJEMPLO:                 _________
router.post("/protected",jwtVerify,async(req,res)=>{
  const {usr_id} = req
  res.json({success:true,msg:"authentificated",user:req.by})
})


 */
export function jwtVerify (req, res, next){
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({success:false,msg:"A token is required for authentication"});
  }
  try {
    const {usr_id,...decoded} = jwt.verify(token, JWT_SECRET);
    req.by = decoded;
    req.usr_id = usr_id
  } catch (err) {
    return res.status(401).json({success:false,msg:"Invalid Token"});
  }
  return next();
};
