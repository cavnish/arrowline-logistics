import cloudinaryPkg from "cloudinary";

const { v2: cloudinary } = cloudinaryPkg;

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const ALLOWED_IMAGE_MAGIC = [
  { name: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { name: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { name: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { name: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46], tail: [0x57, 0x45, 0x42, 0x50] },
  { name: "image/avif", start: 4, bytes: [0x66, 0x74, 0x79, 0x70], tail: [0x61, 0x76, 0x69, 0x66] },
  { name: "image/heic", start: 4, bytes: [0x66, 0x74, 0x79, 0x70], tail: [0x68, 0x65, 0x69, 0x63] },
];

const ALLOWED_FOLDERS = new Set([
  "arrowline/general",
  "arrowline/services",
  "arrowline/sub-services",
  "arrowline/gallery",
  "arrowline/industries",
  "arrowline/clients",
  "arrowline/case-studies",
  "arrowline/locations",
  "arrowline/faqs",
  "arrowline/testimonials",
  "arrowline/blog",
  "arrowline/social-videos",
  "arrowline/statistics",
  "arrowline/trusted-network",
  "arrowline/site-content",
  "arrowline/site-settings",
  "arrowline/visual-showcase",
  "arrowline/cargo-applications",
  "arrowline/leadership",
  "arrowline/core-values",
  "arrowline/about",
]);

function detectImageFormat(buffer) {
  if (!Buffer.isBuffer(buffer)) throw new Error("Upload payload must be a buffer");
  if (buffer.length > MAX_IMAGE_BYTES) throw new Error("Image is too large (max 10 MB)");

  const svgPrefix = buffer.subarray(0, 64).toString("utf-8").trim();
  if (svgPrefix.startsWith("<?xml") || svgPrefix.startsWith("<svg")) return "image/svg+xml";

  for (const fmt of ALLOWED_IMAGE_MAGIC) {
    const start = fmt.start ?? 0;
    if (buffer.length < start + fmt.bytes.length) continue;
    const head = buffer.subarray(start, start + fmt.bytes.length);
    if (!head.every((b, i) => b === fmt.bytes[i])) continue;
    if (fmt.tail) {
      const tailStart = start + fmt.bytes.length;
      if (buffer.length < tailStart + fmt.tail.length) continue;
      const tail = buffer.subarray(tailStart, tailStart + fmt.tail.length);
      if (!tail.every((b, i) => b === fmt.tail[i])) continue;
    }
    return fmt.name;
  }
  throw new Error("Invalid or unsupported image file");
}

class CloudinaryService {
  constructor(cloudName, apiKey, apiSecret, allowedFolders = ALLOWED_FOLDERS) {
    this.allowedFolders = allowedFolders;
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  upload(fileBuffer, options = {}) {
    return new Promise((resolve, reject) => {
      const format = detectImageFormat(fileBuffer);
      const folder = options.folder || "arrowline/logistics/general";
      const isAllowed = Array.from(this.allowedFolders).some(
        (allowed) => folder === allowed || folder.startsWith(allowed + "/")
      );
      if (!isAllowed) {
        return reject(new Error(`Disallowed upload folder: ${folder}`));
      }

      const params = {
        folder,
        resource_type: "image",
        ...options,
      };

      cloudinary.uploader.upload_stream(
        params,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(fileBuffer);
    });
  }

  destroy(publicId) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async list({ folder, maxResults = 200 } = {}) {
    const expression =
      folder && folder !== "all"
        ? `resource_type:image AND folder:${JSON.stringify(folder)}`
        : "resource_type:image";
    const result = await cloudinary.search
      .expression(expression)
      .max_results(maxResults)
      .sort_by("created_at", "desc")
      .execute();
    return (result.resources || []).map((resource) => ({
      path: resource.public_id,
      public_id: resource.public_id,
      url: resource.secure_url || resource.url,
      name: (resource.public_id || "").split("/").pop(),
      width: resource.width,
      height: resource.height,
      format: resource.format,
      bytes: resource.bytes,
      created_at: resource.created_at,
      folder: resource.folder,
    }));
  }
}

export { MAX_IMAGE_BYTES, ALLOWED_FOLDERS, detectImageFormat };
export default CloudinaryService;
