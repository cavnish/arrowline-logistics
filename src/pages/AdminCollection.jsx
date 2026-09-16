import { useEffect, useMemo, useState, useCallback } from "react";
import adminApi from "../services/adminApi";
import {
  CASE_STUDIES,
  CLIENT_TESTIMONIALS,
  GALLERY_ITEMS,
  LOGISTICS_STATS,
  REGIONAL_HUBS,
  COMPANY_DETAILS,
  TEAM_MEMBERS,
  CORE_VALUES,
} from "../data/logisticsData";

const configs = {
  "case-studies": [
    "title", "slug", "client_name", "industry", "location",
    "description", "challenge", "solution", "results",
    "featured_image", "meta_title", "meta_description",
  ],
  gallery: ["title", "description", "category", "image", "alt_text"],
  locations: [
    "name", "slug", "state", "city", "description",
    "address", "image", "map_url", "meta_title", "meta_description",
  ],
  testimonials: [
    "customer_name", "company", "position", "testimonial",
    "photo", "rating",
  ],
  "social-videos": [
    "title", "video_url", "embed_url", "thumbnail",
    "description", "platform",
  ],
  statistics: ["value", "label", "description", "icon"],
  "site-settings": ["setting_key", "setting_value", "setting_type"],
  leadership: ["name", "role", "location", "email", "bio", "image", "image_alt"],
  "core-values": ["title", "description", "icon"],
};

const labels = (key) => key.replaceAll("_", " ");

const IMAGE_FIELDS = ["image", "photo", "featured_image", "thumbnail"];
const LONG_FIELDS = new Set([
  "description", "content", "answer", "challenge", "solution",
  "results", "testimonial", "excerpt", "address", "setting_value", "bio",
]);
const PUBLISHED_RESOURCES = [
  "case-studies", "gallery", "locations",
  "testimonials", "social-videos", "statistics",
  "leadership", "core-values",
];
const ORDER_RESOURCES = [
  "case-studies", "gallery", "locations",
  "testimonials", "social-videos", "statistics",
  "leadership", "core-values",
];

// Resources where an uploaded image should also persist its Cloudinary
// public_id so the old asset can be destroyed on replace/delete.
const PUBLIC_ID_FIELDS = {
  leadership: "image_public_id",
};

const staticRecords = {
  "case-studies": CASE_STUDIES.map((item, index) => ({
    id: item.id, title: item.title, slug: item.id, industry: item.clientSector,
    location: item.location, description: item.summary, challenge: item.challenge,
    solution: item.solution, results: item.result, featured_image: item.image,
    is_published: true, display_order: index,
  })),
  gallery: GALLERY_ITEMS.map((item, index) => ({
    id: item.id, title: item.title, description: item.caption, category: item.category,
    image: item.image, alt_text: item.alt, is_published: true, display_order: index,
  })),
  testimonials: CLIENT_TESTIMONIALS.map((item, index) => ({
    id: item.id, customer_name: item.clientName, company: item.company, position: item.role,
    testimonial: item.comment, photo: item.avatar, rating: item.rating,
    is_published: true, display_order: index,
  })),
  statistics: LOGISTICS_STATS.map((item, index) => ({
    id: item.id, value: item.number, label: item.label, description: item.sublabel,
    icon: item.iconName, is_published: true, display_order: index,
  })),
  locations: REGIONAL_HUBS.map((item, index) => ({
    id: item.id, name: item.name, slug: item.id, state: item.state,
    description: item.details, address: item.connectivity,
    is_published: true, display_order: index,
  })),
  "site-settings": Object.entries(COMPANY_DETAILS).map(([key, value]) => ({
    id: key, setting_key: key, setting_value: String(value), setting_type: "text",
  })),
  leadership: TEAM_MEMBERS.map((item, index) => ({
    id: `leader-${index}`, name: item.name, role: item.role, location: item.location,
    email: item.email || "", bio: item.bio, image: item.image, image_alt: item.name,
    is_published: true, display_order: index,
  })),
  "core-values": CORE_VALUES.map((item, index) => ({
    id: `cv-${index}`, title: item.title, description: item.desc, icon: item.icon,
    is_published: true, display_order: index,
  })),
};

export default function AdminCollection({ resource, title }) {
  const fields = configs[resource];
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [importing, setImporting] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const showToast = useCallback((text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => { setMessage(""); setMessageType("success"); }, 4000);
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.get(`/${resource}`, {
        params: { search, status: statusFilter, page: 1, limit: 100 },
      });
      setItems(response.data.data || []);
    } catch (err) {
      console.error(`Loading ${resource}:`, err?.response?.data || err);
      setError(
        err?.response?.data?.message ||
          `Unable to load ${title}. Check that the backend is running and you are signed in as an admin.`
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [resource, search, statusFilter]);

  useEffect(() => {
    if (!Object.keys(form).length) return undefined;
    const warn = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [form]);

  const websiteRecords = staticRecords[resource] || [];

  const importExisting = async () => {
    if (!websiteRecords.length) return;
    if (
      !window.confirm(
        `Import ${websiteRecords.length} ${title.toLowerCase()} record(s) from the website dataset into the database? Records that already exist will be skipped.`
      )
    ) {
      return;
    }
    setImporting(true);
    setError("");
    try {
      let created = 0;
      for (const record of websiteRecords) {
        const exists = items.some((item) =>
          resource === "site-settings"
            ? item.setting_key === record.setting_key
            : (record.slug && item.slug === record.slug) || String(item.id) === String(record.id)
        );
        if (exists) continue;
        const { id, ...payload } = record;
        await adminApi.post(`/${resource}`, payload);
        created += 1;
      }
      await load();
      showToast(
        created > 0
          ? `Imported ${created} ${title.toLowerCase()} record(s) into the database.`
          : "Nothing to import — records already exist in the database."
      );
    } catch (err) {
      console.error(`Importing ${resource}:`, err?.response?.data || err);
      showToast(`Import failed: ${err?.response?.data?.message || err?.message || "unexpected error"}`, "error");
    } finally {
      setImporting(false);
    }
  };

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const uploadImage = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      showToast("Use a JPG, PNG, or WEBP image up to 5 MB.", "error");
      return;
    }
    setUploadingField(field);
    const body = new FormData();
    body.append("file", file);
    body.append("folder", resource);
    try {
      const response = await adminApi.post("/media", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploaded = response.data.data;
      const updates = { [field]: uploaded.url };
      if (PUBLIC_ID_FIELDS[resource] && uploaded.public_id) {
        updates[PUBLIC_ID_FIELDS[resource]] = uploaded.public_id;
      }
      setForm((current) => ({ ...current, ...updates }));
      showToast("Image uploaded.");
    } catch (err) {
      console.error("Uploading image:", err?.response?.data || err);
      showToast(err?.response?.data?.message || "Unable to upload image.", "error");
    } finally {
      setUploadingField(null);
    }
  };

  const removeImage = (field) => {
    setForm((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = editingId
        ? await adminApi.patch(`/${resource}/${editingId}`, form)
        : await adminApi.post(`/${resource}`, form);
      if (editingId) {
        setItems((current) =>
          current.map((item) => (item.id === editingId ? response.data.data : item))
        );
      } else {
        setItems((current) => [response.data.data, ...current]);
      }
      setForm({});
      setEditingId(null);
      showToast(editingId ? "Updated successfully." : "Created successfully.");
    } catch (err) {
      console.error(`Saving ${resource}:`, err?.response?.data || err);
      showToast(err?.response?.data?.message || "Unable to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({});
  };

  const remove = async (id) => {
    try {
      await adminApi.delete(`/${resource}/${id}`);
      setItems((current) => current.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
      showToast("Deleted successfully.");
    } catch (err) {
      console.error(`Deleting ${resource}:`, err?.response?.data || err);
      showToast("Unable to delete.", "error");
    }
  };

  const getDisplayName = (item) => {
    return item.title || item.name || item.label || item.question ||
      item.customer_name || item.setting_key || "Untitled";
  };

  const getImageUrl = (item) => {
    for (const field of IMAGE_FIELDS) {
      if (item[field]) return item[field];
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-500">Manage website records stored in Supabase.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800 flex items-center justify-between gap-4">
          <span className="flex-1">{error}</span>
          <button
            onClick={load}
            className="text-sm font-semibold text-rose-700 underline whitespace-nowrap"
          >
            Retry
          </button>
        </div>
      )}

      {message && (
        <div
          className={`rounded-lg p-3 text-sm font-medium flex items-center justify-between gap-4 ${
            messageType === "error"
              ? "bg-rose-50 border border-rose-200 text-rose-800"
              : "bg-emerald-50 border border-emerald-200 text-emerald-800"
          }`}
        >
          <span>{message}</span>
          <button
            onClick={() => { setMessage(""); setMessageType("success"); }}
            className="text-xs font-semibold opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      <form
        onSubmit={save}
        className="bg-white border border-slate-200 rounded-xl p-5 grid gap-4 md:grid-cols-2"
      >
        {fields.map((field) => {
          const isLong = LONG_FIELDS.has(field);
          const isImage = IMAGE_FIELDS.includes(field);
          const isBoolean = field === "is_published";
          const isNumber = field === "display_order";
          const value = form[field] ?? "";

          return (
            <label
              key={field}
              className={isLong || isImage ? "md:col-span-2" : ""}
            >
              <span className="block text-sm font-semibold text-slate-700 mb-1">
                {labels(field)}
              </span>

              {isLong ? (
                <textarea
                  name={field}
                  value={value}
                  onChange={update}
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : isBoolean ? (
                <div className="flex items-center gap-2">
                  <input
                    name={field}
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={update}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">
                    {field === "is_published" ? "Published" : "Featured"}
                  </span>
                </div>
              ) : isNumber ? (
                <input
                  name={field}
                  type="number"
                  value={value}
                  onChange={update}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <input
                  name={field}
                  type="text"
                  value={value}
                  onChange={update}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}

              {isImage && (
                <div className="mt-2 space-y-2">
                  {form[field] ? (
                    <div className="relative inline-block">
                      <img
                        src={form[field]}
                        alt={labels(field)}
                        className="h-24 w-40 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(field)}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center hover:bg-red-600 shadow"
                        title="Remove image"
                      >
                        x
                      </button>
                    </div>
                  ) : null}
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                    {uploadingField === field ? "Uploading..." : "Upload image"}
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={(event) => {
                        uploadImage(event, field);
                        event.target.value = "";
                      }}
                      className="sr-only"
                      disabled={uploadingField === field}
                    />
                  </label>
                </div>
              )}
            </label>
          );
        })}

        {PUBLISHED_RESOURCES.includes(resource) && !fields.includes("is_published") && (
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              name="is_published"
              type="checkbox"
              checked={Boolean(form.is_published)}
              onChange={update}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Published
          </label>
        )}

        {ORDER_RESOURCES.includes(resource) && !fields.includes("display_order") && (
          <label className="text-sm font-semibold text-slate-700">
            Display order
            <input
              name="display_order"
              type="number"
              value={form.display_order || 0}
              onChange={update}
              className="mt-1 w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
        )}

        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Search ${title.toLowerCase()}`}
          className="border border-slate-300 rounded-lg p-2 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-500">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium">Loading {title.toLowerCase()}...</span>
          </div>
        </div>
      ) : items.length === 0 && !error && websiteRecords.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
          <p className="text-slate-500 font-medium">
            No {title.toLowerCase()} records in the database yet.
          </p>
          <button
            onClick={importExisting}
            disabled={importing}
            className="px-5 py-2.5 rounded-lg bg-[#1E3A8A] text-white text-sm font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? "Importing..." : `Import ${websiteRecords.length} website record(s)`}
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {items.length === 0 ? (
            <p className="p-6 text-slate-500 text-sm">No records found.</p>
          ) : (
            items.map((item) => {
              const imageUrl = getImageUrl(item);
              return (
                <div
                  key={item.id}
                  className="p-4 border-b last:border-b-0 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-slate-800 truncate">
                        {getDisplayName(item)}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.is_published !== undefined && (
                          <span
                            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                              item.is_published === false
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {item.is_published === false ? "Draft" : "Published"}
                          </span>
                        )}
                        {item.display_order !== undefined && (
                          <span className="text-xs text-slate-400">
                            Order: {item.display_order}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500">Delete?</span>
                        <button
                          onClick={() => remove(item.id)}
                          className="px-2 py-1 rounded text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 rounded text-xs font-semibold border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => edit(item)}
                          className="text-sm font-semibold text-[#1E3A8A] hover:text-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
