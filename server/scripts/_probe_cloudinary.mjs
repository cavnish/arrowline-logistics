import "dotenv/config";
import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const usage = await new Promise((resolve, reject) => {
  cloudinary.api.resources({ type: "upload", max_results: 200 }, (error, res) =>
    error ? reject(error) : resolve(res)
  );
});
console.log("total assets:", (usage.resources || []).length);
(usage.resources || []).forEach((r) => console.log(`- ${r.public_id} (${r.secure_url})`));
process.exit(0);