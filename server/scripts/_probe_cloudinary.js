import "dotenv/config";
import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;

const candidates = ["arrowline", "arrowlinelogistics", "arrowline-logistics", "arrowline_logistics", "arrowline-logistics-ir", "arrowlineir"];
const key = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;

for (const name of candidates) {
  cloudinary.config({ cloud_name: name, api_key: key, api_secret: secret });
  try {
    const res = await new Promise((resolve, reject) => {
      cloudinary.api.ping((error, result) => (error ? reject(error) : resolve(result)));
    });
    console.log(`OK  ${name} => ${JSON.stringify(res)}`);
  } catch (e) {
    console.log(`ERR ${name} => ${e.http_code} ${e.message}`);
  }
}