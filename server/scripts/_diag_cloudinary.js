import "dotenv/config";
import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const buf = Buffer.from(b64, "base64");

try {
  const res = await cloudinary.uploader.upload_stream(
    { folder: "arrowline/_diag", resource_type: "auto", public_id: "diag-pixel" },
    (err, result) => err ? Promise.reject(err) : Promise.resolve(result)
  );
  // The callback form doesn't return a promise; redo with promise form.
} catch (e) {
  console.log("STREAM ERR:", e.message);
}

// Promise form
const result = await new Promise((resolve, reject) => {
  cloudinary.uploader.upload_stream(
    { folder: "arrowline/_diag", resource_type: "auto", public_id: "diag-pixel" },
    (error, res) => (error ? reject(error) : resolve(res))
  ).end(buf);
});
console.log("UPLOAD OK public_id=", result.public_id, "secure_url=", result.secure_url);

const del = await cloudinary.uploader.destroy(result.public_id);
console.log("DESTROY:", JSON.stringify(del));

const usage = await new Promise((resolve, reject) => {
  cloudinary.api.resources({ type: "upload", prefix: "arrowline/", max_results: 50 }, (error, res) =>
    error ? reject(error) : resolve(res)
  );
});
console.log("== existing arrowline/ assets ==");
(usage.resources || []).forEach((r) => console.log(`- ${r.public_id} (${r.width}x${r.height}, ${Math.round((r.bytes || 0) / 1024)}KB)`));
console.log("total:", (usage.resources || []).length);