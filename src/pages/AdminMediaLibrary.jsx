import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

export default function AdminMediaLibrary() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [folder, setFolder] = useState("general");

  const loadMedia = async () => {
    setLoading(true);
    try {
      // Note: This endpoint needs to be created in the backend
      const response = await adminApi.get("/media/list");
      setMedia(response.data.data || []);
    } catch (error) {
      console.error("Loading media:", error?.response?.data || error);
      setMessage("Unable to load media library. Please ensure the media list endpoint is implemented.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setMessage(`${file.name}: Invalid file type. Use JPG, PNG, or WEBP.`);
        errorCount++;
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage(`${file.name}: File is too large. Maximum 5 MB.`);
        errorCount++;
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await adminApi.post("/media", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setMedia((current) => [
          ...current,
          {
            path: response.data.data.path,
            url: response.data.data.url,
            filename: file.name,
          },
        ]);

        successCount++;
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error?.response?.data || error);
        errorCount++;
      }
    }

    setUploading(false);

    if (successCount > 0) {
      setMessage(`Uploaded ${successCount} image(s) successfully.`);
      event.target.value = "";
    }
    if (errorCount > 0) {
      setMessage((current) => `${current} ${errorCount} image(s) failed to upload.`);
    }
  };

  const deleteMedia = async (path) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await adminApi.delete("/media", { params: { path } });
      setMedia((current) => current.filter((item) => item.path !== path));
      setMessage("Image deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error?.response?.data || error);
      setMessage("Unable to delete image.");
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setSelectedUrl(url);
      setMessage("Image URL copied to clipboard!");
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Media Library</h1>
        <p className="text-sm text-slate-500">Upload and manage website images.</p>
      </div>

      {message && (
        <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700 border border-slate-200">
          {message}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Upload Folder
          </label>
          <select
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="border rounded-lg p-2 w-full md:w-64"
          >
            <option value="general">General</option>
            <option value="services">Services</option>
            <option value="industries">Industries</option>
            <option value="case-studies">Case Studies</option>
            <option value="gallery">Gallery</option>
            <option value="locations">Locations</option>
            <option value="testimonials">Testimonials</option>
            <option value="blog">Blog</option>
            <option value="social-videos">Social Videos</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Select Images to Upload
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="block w-full border border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 cursor-pointer disabled:opacity-50"
          />
          <p className="text-xs text-slate-500 mt-2">
            Supported: JPG, PNG, WEBP (up to 5 MB each)
          </p>
        </div>

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-[#1E3A8A] rounded-full animate-spin" />
            Uploading...
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-slate-500">Loading media library...</p>
      ) : (
        <div>
          {media.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
              <p className="text-sm mb-2">No images uploaded yet.</p>
              <p className="text-xs">Upload images to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {media.map((item) => (
                <div
                  key={item.path}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-slate-100 aspect-square overflow-hidden flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-xs font-medium text-slate-700 truncate" title={item.filename}>
                      {item.filename || item.path.split("/").pop()}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyToClipboard(item.url)}
                        className="flex-1 text-xs py-1 px-2 rounded bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 truncate"
                        title="Copy URL"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => deleteMedia(item.path)}
                        className="flex-1 text-xs py-1 px-2 rounded border border-red-300 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
