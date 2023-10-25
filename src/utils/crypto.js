
import crypto from "crypto"


// Function to hash a password with a salt
export function hashPassword(password) {
  
  const salt = process.env.PASSWORD_SALT || "splitmeet_salt"
  const iterations = 10000;
  const keylen = 64; // Key length in bytes
  const digest = 'sha512'; // Cryptographic digest algorithm
  
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
  const result = hash.toString('hex');
  return result
}


export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}




export function generateAlphaNumeric(length = 8){
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const codeArray = Array.from({ length }, () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters[randomIndex];
  });

  return codeArray.join("");
  
}

export function generateAlphaNumericNonRepeated(existingCodes,length=8){
  let code;
  
  //TODO every 10 attempts add 1 to the length
  do {
    code = generateAlphaNumeric(length)
  } while (existingCodes.includes(code))
  return code;
}
