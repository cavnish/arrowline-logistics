import cloudinaryPkg from "cloudinary";

const { v2: cloudinary } = cloudinaryPkg;

class CloudinaryService {
  constructor(cloudName, apiKey, apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  upload(fileBuffer, options = {}) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: options.folder || "arrowline-logistics/general",
          resource_type: "auto",
          ...options,
        },
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

export default CloudinaryService;