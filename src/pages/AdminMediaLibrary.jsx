import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

const PROVIDER_LABEL = { cloudinary: "Cloudinary", supabase: "Storage" };

function formatBytes(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaLibrary() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [folder, setFolder] = useState("general");
  const [search, setSearch] = useState("");
  const [usage, setUsage] = useState(null);
  const [usageLoading, setUsageLoading] = useState(false);

  const loadMedia = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.get("/media/list", {
        params: query ? { search: query } : {},
      });
      setMedia(response.data.data || []);
    } catch (e) {
      console.error("Loading media:", e?.response?.data || e);
      setError("Unable to load media library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadMedia(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const handleUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    let successCount = 0;
    let errorCount = 0;
    const problems = [];

    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        problems.push(`${file.name}: Invalid file type. Use JPG, PNG, or WEBP.`);
        errorCount++;
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        problems.push(`${file.name}: File is too large. Maximum 5 MB.`);
        errorCount++;
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        await adminApi.post("/media", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        successCount++;
      } catch (e) {
        console.error(`Upload error for ${file.name}:`, e?.response?.data || e);
        problems.push(`${file.name}: Upload failed.`);
        errorCount++;
      }
    }

    setUploading(false);
    event.target.value = "";

    if (successCount > 0) {
      setMessage(`Uploaded ${successCount} image(s) successfully.`);
      loadMedia(search.trim());
    }
    if (errorCount > 0) {
      setError(problems.join(" "));
    }
  };

  const checkUsage = async (item) => {
    setUsageLoading(true);
    setError("");
    try {
      const params = item.public_id ? { public_id: item.public_id } : { url: item.url };
      const response = await adminApi.get("/image-usage", { params });
      setUsage({ item, matches: response.data.data || [] });
    } catch (e) {
      console.error("Usage error:", e?.response?.data || e);
      setError("Unable to check image usage.");
    } finally {
      setUsageLoading(false);
    }
  };

  const deleteMedia = async (item) => {
    const confirmed = window.confirm(
      "Delete this image? This cannot be undone."
    );
    if (!confirmed) return;

    setError("");
    try {
      const params = item.provider === "cloudinary" && item.public_id
        ? { public_id: item.public_id }
        : { path: item.path };
      await adminApi.delete("/media", { params });
      setMedia((current) => current.filter((m) => m.id !== item.id && m.path !== item.path));
      setUsage(null);
      setMessage("Image deleted successfully.");
    } catch (e) {
      console.error("Delete error:", e?.response?.data || e);
      setError("Unable to delete image.");
    }
  };

  const handleDeleteClick = async (item) => {
    setUsageLoading(true);
    setError("");
    try {
      const params = item.public_id ? { public_id: item.public_id } : { url: item.url };
      const response = await adminApi.get("/image-usage", { params });
      const matches = response.data.data || [];
      setUsage({ item, matches });

      if (matches.length > 0) {
        const labels = matches.map((m) => `${m.entityLabel}: ${m.title}`).join(", ");
        if (!window.confirm(`This image is used by: ${labels}. Deleting it will break those references. Continue?`)) return;
      }
      await deleteMedia(item);
    } catch (e) {
      console.error("Usage/delete error:", e?.response?.data || e);
      setError("Unable to check usage and delete image.");
    } finally {
      setUsageLoading(false);
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setMessage("Image URL copied to clipboard!");
    });
  };

  const filename = (item) => item.name || item.filename || (item.path || "").split("/").pop();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Media Library</h1>
        <p className="text-sm text-slate-500">Upload and manage website images.</p>
      </div>

      {message && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 border border-emerald-200">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Upload Folder
            </label>
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="border rounded-lg p-2"
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

          <div className="flex-1 min-w-56">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, path, or folder..."
              className="w-full border rounded-lg p-2"
            />
          </div>
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

      {usage && (
        <div className="bg-slate-900 text-slate-100 border border-slate-700 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">
              Image usage for "{filename(usage.item)}"
            </h2>
            <button
              onClick={() => setUsage(null)}
              className="text-xs px-2 py-1 rounded hover:bg-slate-700"
            >
              Close
            </button>
          </div>
          {usage.matches.length === 0 ? (
            <p className="text-xs text-slate-300">Not referenced anywhere on the site.</p>
          ) : (
            <ul className="space-y-1 text-xs text-slate-200 max-h-40 overflow-y-auto">
              {usage.matches.map((m, i) => (
                <li key={`${m.entity}-${m.id}-${m.field}-${i}`}>
                  {m.entityLabel}: <strong>{m.title}</strong>{" "}
                  <span className="text-slate-400">({m.field})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {usageLoading && (
        <p className="text-sm text-slate-500">Checking usage...</p>
      )}

      {loading ? (
        <p className="text-slate-500">Loading media library...</p>
      ) : (
        <div>
          {media.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
              <p className="text-sm mb-2">
                {search ? "No images match your search." : "No images uploaded yet."}
              </p>
              <p className="text-xs">
                {search ? "Try a different keyword." : "Upload images to get started."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {media.map((item, index) => (
                <div
                  key={item.id || item.path || `m-${index}`}
                  className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-slate-100 aspect-square overflow-hidden flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={filename(item)}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-xs font-medium text-slate-700 truncate" title={filename(item)}>
                      {filename(item)}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          item.provider === "cloudinary"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {PROVIDER_LABEL[item.provider] || item.provider}
                      </span>
                      {item.width && item.height && (
                        <span>{item.width}×{item.height}</span>
                      )}
                      <span>{formatBytes(item.size)}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => copyToClipboard(item.url)}
                        className="flex-1 text-xs py-1 px-2 rounded bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 truncate"
                        title="Copy URL"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => checkUsage(item)}
                        className="flex-1 text-xs py-1 px-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
                        title="Where is this image used?"
                      >
                        Used by
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
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