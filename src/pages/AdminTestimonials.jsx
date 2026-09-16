import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import adminApi from "../services/adminApi";
import { getOptimizedImageUrl } from "../utils/imageUrl";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Loader2,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const AVATAR_COLORS = ["bg-orange-600","bg-emerald-600","bg-blue-600","bg-purple-600","bg-slate-700","bg-rose-600","bg-cyan-600","bg-amber-600"];

function getAvatarColor(name) {
  let hash = 0;
  const str = String(name || "");
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initialsOf(name) {
  return String(name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const emptyForm = { customer_name: "", company: "", position: "", testimonial: "", photo: "", rating: 5, is_verified: true, is_published: true, display_order: 0 };

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
        />
      ))}
    </div>
  );
}

function PhotoThumb({ photo, name, className = "h-12 w-12" }) {
  const [broken, setBroken] = useState(false);

  if (photo && !broken) {
    return (
      <img
        src={getOptimizedImageUrl(photo, { width: 160 })}
        alt={name || "Customer photo"}
        loading="lazy"
        onError={() => setBroken(true)}
        className={`${className} rounded-full bg-white object-cover ring-1 ring-slate-200`}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center rounded-full ${getAvatarColor(name)} text-sm font-bold text-white`}>
      {initialsOf(name)}
    </div>
  );
}

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [removePhoto, setRemovePhoto] = useState(false);
  const [fileError, setFileError] = useState("");
  const [movingId, setMovingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);
  const uploadInputRef = useRef(null);

  const showToast = useCallback((type, text) => {
    setToast({ type, text });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      const query = params.toString();
      const response = await adminApi.get(`/testimonials${query ? `?${query}` : ""}`);
      setItems(response.data.data || []);
    } catch (error) {
      console.error("Loading testimonials:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to load testimonials. Check the backend is running and you are signed in.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [status, showToast]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const debouncedSearch = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    if (!debouncedSearch) return undefined;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await adminApi.get(`/testimonials?search=${encodeURIComponent(debouncedSearch)}${status !== "all" ? `&status=${status}` : ""}`);
        setItems(response.data.data || []);
      } catch (error) {
        console.error("Searching testimonials:", error?.response?.data || error);
        showToast("error", "Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [debouncedSearch, status, showToast]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPhotoFile(null);
    setPhotoUrl("");
    setRemovePhoto(false);
    setFileError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({
      customer_name: item.customer_name || "",
      company: item.company || "",
      position: item.position || "",
      testimonial: item.testimonial || "",
      photo: item.photo || "",
      rating: item.rating ?? 5,
      is_verified: item.is_verified ?? true,
      is_published: item.is_published ?? true,
      display_order: item.display_order ?? 0,
    });
    setEditingId(item.id);
    setPhotoFile(null);
    setPhotoUrl("");
    setRemovePhoto(false);
    setFileError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setFileError("");
    setPhotoFile(null);
    setPhotoUrl("");
    setRemovePhoto(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"].includes(file.type)) {
      setFileError("Please choose a JPEG, PNG, WEBP, GIF, AVIF or SVG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File is too large (max 5 MB).");
      return;
    }
    setFileError("");
    setRemovePhoto(false);
    setUploadingField("photo");
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "testimonials");
    try {
      const response = await adminApi.post("/media", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploaded = response.data.data;
      setForm((current) => ({ ...current, photo: uploaded.url }));
      setPhotoFile(null);
      showToast("success", "Photo uploaded.");
    } catch (error) {
      console.error("Uploading photo:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to upload photo.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const customerName = form.customer_name.trim();
    const testimonialText = form.testimonial.trim();
    if (!customerName) {
      showToast("error", "Customer name is required.");
      return;
    }
    if (!testimonialText) {
      showToast("error", "Testimonial text is required.");
      return;
    }

    const payload = {
      customer_name: customerName,
      company: form.company.trim(),
      position: form.position.trim(),
      testimonial: testimonialText,
      photo: removePhoto ? null : form.photo || null,
      rating: Number(form.rating) || 5,
      is_verified: form.is_verified,
      is_published: form.is_published,
      display_order: Number(form.display_order) || 0,
    };

    setSaving(true);
    try {
      const response = editingId
        ? await adminApi.patch(`/testimonials/${editingId}`, payload)
        : await adminApi.post("/testimonials", payload);
      await loadItems();
      closeModal();
      showToast("success", editingId ? "Testimonial updated." : "Testimonial added.");
      return response.data;
    } catch (error) {
      console.error("Saving testimonial:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to save. Please try again.");
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete testimonial from "${item.customer_name}"?`)) return;
    try {
      await adminApi.delete(`/testimonials/${item.id}`);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      showToast("success", `Deleted testimonial from "${item.customer_name}".`);
    } catch (error) {
      console.error("Deleting testimonial:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to delete. Please try again.");
    }
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }, [items]);

  const indexOfItem = useCallback(
    (id) => sortedItems.findIndex((entry) => entry.id === id),
    [sortedItems]
  );

  const canMoveUp = useCallback((id) => indexOfItem(id) > 0, [indexOfItem]);
  const canMoveDown = useCallback((id) => {
    const index = indexOfItem(id);
    return index >= 0 && index < sortedItems.length - 1;
  }, [indexOfItem, sortedItems.length]);

  const reorderItem = async (item, direction) => {
    const at = indexOfItem(item.id);
    const to = direction === "up" ? at - 1 : at + 1;
    if (at < 0 || to < 0 || to >= sortedItems.length) return;

    const next = [...sortedItems];
    [next[at], next[to]] = [next[to], next[at]];
    const updates = next.map((entry, index) => ({ id: entry.id, display_order: index + 1 }));

    setMovingId(item.id);
    try {
      await Promise.all(
        updates.map((update) =>
          adminApi.patch(`/testimonials/${update.id}`, { display_order: update.display_order })
        )
      );
      await loadItems();
      showToast("success", "Display order updated.");
    } catch (error) {
      console.error("Reordering testimonials:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to reorder. Please try again.");
    } finally {
      setMovingId(null);
    }
  };

  const currentPhotoPreview = useMemo(() => {
    if (photoFile) return URL.createObjectURL(photoFile);
    if (photoUrl) return photoUrl;
    if (editingId) {
      const current = items.find((item) => item.id === editingId);
      return removePhoto ? "" : current?.photo || "";
    }
    return "";
  }, [photoFile, photoUrl, editingId, items, removePhoto]);

  const photoMeta = useMemo(() => {
    if (!photoFile) return null;
    return {
      name: photoFile.name,
      size: photoFile.size > 1024 * 1024 ? `${(photoFile.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(photoFile.size / 1024)} KB`,
      type: photoFile.type.replace("image/", "").toUpperCase(),
    };
  }, [photoFile]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E3A8A] text-white">
            <MessageSquare size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Testimonials</h1>
            <p className="text-sm text-slate-500">Customer reviews and testimonials shown on the public website. Photos are stored on Cloudinary, details in the database.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition"
        >
          <Plus size={17} />
          Add Testimonial
        </button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by customer name or company…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1E3A8A] focus:outline-none"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button
            type="button"
            onClick={() => { setSearch(""); loadItems(); }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </div>

      {!loading && items.length > 0 && (
        <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white lg:block">
          <table className="min-w-[900px] divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Company</th>
                <th className="px-4 py-3.5">Position</th>
                <th className="px-4 py-3.5">Review</th>
                <th className="px-4 py-3.5">Rating</th>
                <th className="px-4 py-3.5">Verified</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Order</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <PhotoThumb photo={item.photo} name={item.customer_name} />
                      <p className="font-semibold text-slate-800">{item.customer_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.company || "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{item.position || "—"}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="truncate text-slate-600" title={item.testimonial}>{item.testimonial || "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StarRating rating={item.rating} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_verified ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                      {item.is_verified ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {item.is_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {item.is_published ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {item.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => reorderItem(item, "up")}
                        disabled={!canMoveUp(item.id) || movingId === item.id}
                        className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Move ${item.customer_name} up`}
                        title="Move up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <span className="w-6 text-center text-slate-600">{item.display_order ?? 0}</span>
                      <button
                        type="button"
                        onClick={() => reorderItem(item, "down")}
                        disabled={!canMoveDown(item.id) || movingId === item.id}
                        className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Move ${item.customer_name} down`}
                        title="Move down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={() => openEdit(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] hover:bg-slate-50 transition">
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition">
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-3 lg:hidden">
          {sortedItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-start gap-3">
                <PhotoThumb photo={item.photo} name={item.customer_name} className="h-12 w-12" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{item.customer_name}</p>
                  <p className="text-xs text-slate-500">{item.company || "No company"}{item.position ? ` · ${item.position}` : ""}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StarRating rating={item.rating} size={12} />
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.is_verified ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                      {item.is_verified ? "Verified" : "Unverified"}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {item.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>
              {item.testimonial && (
                <p className="text-sm text-slate-600 line-clamp-3">{item.testimonial}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => reorderItem(item, "up")}
                    disabled={!canMoveUp(item.id) || movingId === item.id}
                    className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Move ${item.customer_name} up`}
                    title="Move up"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <span>Order: {item.display_order ?? 0}</span>
                  <button
                    type="button"
                    onClick={() => reorderItem(item, "down")}
                    disabled={!canMoveDown(item.id) || movingId === item.id}
                    className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Move ${item.customer_name} down`}
                    title="Move down"
                  >
                    <ArrowDown size={13} />
                  </button>
                </span>
                <span>Updated {formatDate(item.updated_at)}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => openEdit(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#1E3A8A]">
                  <Pencil size={14} />
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-red-600">
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 md:p-5">
              <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <MessageSquare size={26} />
          </div>
          <p className="font-semibold text-slate-700">{search || status !== "all" ? "No matching testimonials." : "No testimonials yet."}</p>
          {!search && status === "all" && (
            <p className="text-sm text-slate-500">Add your first customer testimonial — it will appear on the public website when published.</p>
          )}
          <button type="button" onClick={openCreate} className="mx-auto inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition">
            <Plus size={16} />
            Add Testimonial
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={editingId ? "Edit testimonial" : "Add testimonial"}>
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white sm:max-w-2xl sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
              <h2 className="text-lg font-bold text-slate-800">{editingId ? "Edit testimonial" : "Add a testimonial"}</h2>
              <button type="button" onClick={closeModal} disabled={saving} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition" aria-label="Close">
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="block text-sm font-semibold text-slate-700 mb-1">
                    Customer name <span className="text-red-500">*</span>
                  </span>
                  <input
                    name="customer_name"
                    value={form.customer_name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Kumar"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  />
                </label>

                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Company</span>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="e.g. Tata Logistics"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  />
                </label>

                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Position / Designation</span>
                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="e.g. Head of Supply Chain"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="block text-sm font-semibold text-slate-700 mb-1">
                    Testimonial <span className="text-red-500">*</span>
                  </span>
                  <textarea
                    name="testimonial"
                    value={form.testimonial}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What the customer said about your service…"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  />
                </label>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Photo</span>
                  {currentPhotoPreview && (
                    <button type="button" onClick={() => { setPhotoFile(null); setRemovePhoto(true); setPhotoUrl(""); }} className="text-xs font-semibold text-red-600 hover:underline">
                      Remove photo
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {currentPhotoPreview ? (
                    <img
                      src={currentPhotoPreview}
                      alt="Photo preview"
                      className="h-16 w-16 rounded-full bg-white object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${getAvatarColor(form.customer_name)} text-lg font-bold text-white`}>
                      {initialsOf(form.customer_name)}
                    </div>
                  )}

                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium text-slate-700">
                      {photoMeta ? photoMeta.name : removePhoto ? "Photo will be removed publicly." : editingId ? "Existing photo kept." : "No photo selected."}
                    </p>
                    <p className="text-xs text-slate-500">
                      {photoMeta ? `Type: ${photoMeta.type} · Size: ${photoMeta.size}` : "Upload JPEG, PNG, WEBP, GIF, AVIF or SVG (max 5 MB)."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                    {uploadingField === "photo" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <Upload size={15} />
                        Choose file
                      </>
                    )}
                    <input ref={uploadInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml" className="hidden" onChange={handlePhotoUpload} disabled={uploadingField === "photo"} />
                  </label>
                </div>

                {fileError && (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <AlertCircle size={13} />
                    {fileError}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Rating</span>
                  <select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Display order</span>
                  <input
                    name="display_order"
                    type="number"
                    min="0"
                    step="1"
                    value={form.display_order}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  />
                  <span className="mt-1 block text-xs text-slate-400">Lower numbers appear first.</span>
                </label>

                <div className="flex flex-col justify-center gap-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input name="is_verified" type="checkbox" checked={form.is_verified} onChange={handleChange} className="h-4 w-4 accent-[#1E3A8A]" />
                    Verified customer
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input name="is_published" type="checkbox" checked={form.is_published} onChange={handleChange} className="h-4 w-4 accent-[#FF7A00]" />
                    Published
                  </label>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end sm:border-t sm:border-slate-100 sm:pt-4">
                <button type="button" onClick={closeModal} disabled={saving} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition disabled:opacity-60"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? "Saving…" : editingId ? "Save changes" : "Add testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl border px-4 py-3 shadow-lg text-sm flex items-start gap-2.5 ${toast.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          {toast.type === "error" ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}
