import "dotenv/config";
import cloudinaryPkg from "cloudinary";
import fs from "node:fs";

const { v2: cloudinary } = cloudinaryPkg;

// Safe diagnostic: never prints secrets.
const cfg = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "(missing)",
  api_key: process.env.CLOUDINARY_API_KEY ? "(set)" : "(missing)",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "(set)" : "(missing)",
};
console.log("Config:", JSON.stringify(cfg));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1) Ping the API for the configured cloud.
try {
  const ping = await cloudinary.api.ping();
  console.log("PING OK:", JSON.stringify(ping));
} catch (err) {
  console.log("PING FAILED:", err.error?.message || err.message || JSON.stringify(err));
}

// 2) Attempt an actual upload_stream with a tiny in-memory PNG payload, exactly
//    like the trusted-network route does.
try {
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "arrowline-logistics/diagnostics",
        public_id: "ping-test",
        resource_type: "image",
        overwrite: true,
      },
      (error, res) => (error ? reject(error) : resolve(res))
    ).end(png);
  });
  console.log(
    "UPLOAD OK:",
    JSON.stringify({
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      resource_type: result.resource_type,
      secure_url: result.secure_url ? "present" : "missing",
    })
  );
  // cleanup
  const del = await cloudinary.uploader.destroy(result.public_id);
  console.log("CLEANUP:", JSON.stringify(del));
} catch (err) {
  console.log("UPLOAD FAILED:", err.error?.message || err.message || JSON.stringify(err));
}

const exists = fs.existsSync(".env");
console.log("server/.env present:", exists);