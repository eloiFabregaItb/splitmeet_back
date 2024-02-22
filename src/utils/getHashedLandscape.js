import axios from "axios"

const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY
 
const unsplashApi = axios.create({
  baseURL: 'https://api.unsplash.com',
});
const unsplashEndpoint = `/search/photos?query=landscape&orientation=landscape&client_id=${UNSPLASH_API_KEY}&per_page=30&page=1`;

export async function getHashedLandscape(seed) {

  try{
    const response = await unsplashApi.get(unsplashEndpoint)
    // console.log(response.data.results[0].urls)
    const n = hashStringToNumber(seed,30)
    return response.data.results[n].urls.regular
  }catch(error){
    console.error(error)
  }
}







export async function getHashedLandscapeMultiple(size = "regular"){
  //raw full regular small thumb small_s3

  try{
    const response = await unsplashApi.get(unsplashEndpoint)
    // console.log(response.data.results[0].urls)
    return (seed)=>{
      const n = hashStringToNumber(seed,30)
      return response.data.results[n].urls[size]
    }
  }catch(error){
    console.error(error)
  }
}





function hashStringToNumber(str, N) {
  let hash = 0;

  if(!str) return hash

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
  }

  // Ensure the result is non-negative
  hash = Math.abs(hash);

  // Perform modulo N operation
  const result = hash % (N + 1);

  return result;
}


export function hegHashColor(str){
  const hue = hashStringToNumber(str,260)
  return `hsl(${hue}, 92%, 47%)`
}
