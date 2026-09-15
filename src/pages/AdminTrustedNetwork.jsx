import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import adminApi from "../services/adminApi";
import { getOptimizedImageUrl } from "../utils/imageUrl";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Building2,
  CheckCircle2,
  Clock,
  Cloud,
  ExternalLink,
  Handshake,
  Image as ImageIcon,
  Link2,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  website: "",
  logo_alt: "",
  display_order: 0,
  is_published: true,
};

function initialsOf(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function LogoThumb({ item, className = "h-12 w-12" }) {
  const [broken, setBroken] = useState(false);

  if (item.logo && !broken) {
    return (
      <img
        src={getOptimizedImageUrl(item.logo, { width: 160 })}
        alt={item.logo_alt || `${item.name} logo`}
        loading="lazy"
        onError={() => setBroken(true)}
        className={`${className} rounded-lg bg-white object-contain p-1 ring-1 ring-slate-200`}
      />
    );
  }

  return (
    <div className={`${className} flex items-center justify-center rounded-lg bg-[#1E3A8A] text-sm font-bold text-white`}>
      {initialsOf(item.name)}
    </div>
  );
}

export default function AdminTrustedNetwork() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("order");
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [removeLogo, setRemoveLogo] = useState(false);
  const [fileError, setFileError] = useState("");
  const [movingId, setMovingId] = useState(null);
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
      if (sort !== "order") params.set("sort", sort);
      const query = params.toString();
      const response = await adminApi.get(`/trusted-network${query ? `?${query}` : ""}`);
      setItems(response.data.data || []);
    } catch (error) {
      console.error("Loading trusted network:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to load trusted network. Check the backend is running and you are signed in.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [status, sort, showToast]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const debouncedSearch = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    if (!debouncedSearch) return undefined;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await adminApi.get(`/trusted-network?search=${encodeURIComponent(debouncedSearch)}${status !== "all" ? `&status=${status}` : ""}${sort !== "order" ? `&sort=${sort}` : ""}`);
        setItems(response.data.data || []);
      } catch (error) {
        console.error("Searching trusted network:", error?.response?.data || error);
        showToast("error", "Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [debouncedSearch, status, sort, showToast]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setLogoFile(null);
    setLogoUrl("");
    setRemoveLogo(false);
    setFileError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
      website: item.website || "",
      logo_alt: item.logo_alt || "",
      display_order: item.display_order ?? 0,
      is_published: item.is_published ?? true,
    });
    setEditingId(item.id);
    setLogoFile(null);
    setLogoUrl("");
    setRemoveLogo(false);
    setFileError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setFileError("");
    setLogoFile(null);
    setLogoUrl("");
    setRemoveLogo(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"].includes(file.type)) {
      setFileError("Please choose a JPEG, PNG, WEBP, GIF, AVIF or SVG image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setFileError("File is too large (max 15 MB).");
      return;
    }
    setFileError("");
    setRemoveLogo(false);
    setLogoUrl("");
    setLogoFile(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setFileError("");
      showToast("error", "Company name is required.");
      return;
    }
    if (!isValidUrl(form.website)) {
      showToast("error", "Website must be a valid http(s) URL.");
      return;
    }
    if (logoUrl && !logoFile && !isValidUrl(logoUrl)) {
      showToast("error", "Logo URL must be a valid http(s) URL.");
      return;
    }
    if (!editingId && !logoFile && !logoUrl.trim()) {
      showToast("error", "A logo is required (upload a file or paste an image URL).");
      return;
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("category", form.category);
    payload.append("description", form.description);
    payload.append("website", form.website.trim());
    payload.append("logo_alt", form.logo_alt);
    payload.append("display_order", String(Number(form.display_order) || 0));
    payload.append("is_published", form.is_published ? "true" : "false");

    if (logoFile) {
      payload.append("logo", logoFile);
    } else if (removeLogo) {
      payload.append("clear_logo", "true");
    } else if (logoUrl.trim()) {
      const currentLogo = editingId ? items.find((item) => item.id === editingId)?.logo : "";
      if (logoUrl.trim() !== currentLogo) {
        payload.append("logo", logoUrl.trim());
      }
    }

    setSaving(true);
    try {
      const multipart = { headers: { "Content-Type": "multipart/form-data" } };
      const response = editingId
        ? await adminApi.put(`/trusted-network/${editingId}`, payload, multipart)
        : await adminApi.post("/trusted-network", payload, multipart);
      await loadItems();
      closeModal();
      showToast("success", editingId ? "Company updated." : "Company added to the trusted network.");
      return response.data;
    } catch (error) {
      console.error("Saving trusted-network entry:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to save. Please try again.");
    } finally {
      setSaving(false);
    }
    return undefined;
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}" from the trusted network?`)) return;
    try {
      const response = await adminApi.delete(`/trusted-network/${item.id}`);
      const cleanupLabel = response.data?.data?.cleanup === "asset-cleaned" ? " Logo removed from Cloudinary." : "";
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      showToast("success", `Deleted "${item.name}".${cleanupLabel}`);
    } catch (error) {
      console.error("Deleting trusted-network entry:", error?.response?.data || error);
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
          adminApi.patch(`/trusted-network/${update.id}/reorder`, { display_order: update.display_order })
        )
      );
      await loadItems();
      showToast("success", "Display order updated.");
    } catch (error) {
      console.error("Reordering trusted network:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to reorder. Please try again.");
    } finally {
      setMovingId(null);
    }
  };

  const currentLogoPreview = useMemo(() => {
    if (logoFile) return URL.createObjectURL(logoFile);
    if (logoUrl) return logoUrl;
    if (editingId) {
      const current = items.find((item) => item.id === editingId);
      return removeLogo ? "" : current?.logo || "";
    }
    return "";
  }, [logoFile, logoUrl, editingId, items, removeLogo]);

  const logoMeta = useMemo(() => {
    if (!logoFile) return null;
    return {
      name: logoFile.name,
      size: logoFile.size > 1024 * 1024 ? `${(logoFile.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(logoFile.size / 1024)} KB`,
      type: logoFile.type.replace("image/", "").toUpperCase(),
    };
  }, [logoFile]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E3A8A] text-white">
            <Handshake size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Trusted Network</h1>
            <p className="text-sm text-slate-500">Companies shown in the public “Trusted by Industry Leaders” section. Logos are stored on Cloudinary, details in the database.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition"
        >
          <Plus size={17} />
          Add Company
        </button>
      </div>

      {/* TOOLS */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by company or subtitle…"
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
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-[#1E3A8A] focus:outline-none"
            aria-label="Sort entries"
          >
            <option value="order">Sort: order</option>
            <option value="name">Sort: name A–Z</option>
            <option value="updated">Sort: recently updated</option>
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

      {/* DESKTOP TABLE */}
      {!loading && items.length > 0 && (
        <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white md:block">
          <table className="min-w-[860px] divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Company</th>
                <th className="px-4 py-3.5">Subtitle</th>
                <th className="px-4 py-3.5">Website</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Order</th>
                <th className="px-4 py-3.5">Logo</th>
                <th className="px-4 py-3.5">Updated</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <LogoThumb item={item} />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        {item.logo_alt && <p className="truncate max-w-56 text-xs text-slate-400" title={item.logo_alt}>Alt: {item.logo_alt}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.category || "—"}</td>
                  <td className="px-4 py-3">
                    {item.website ? (
                      <a href={item.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#1E3A8A] hover:underline">
                        {new URL(item.website).hostname.replace(/^www\./, "")}
                        <ExternalLink size={12} />
                      </a>
                    ) : "—"}
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
                        aria-label={`Move ${item.name} up`}
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
                        aria-label={`Move ${item.name} down`}
                        title="Move down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {item.logo ? (item.logo_public_id ? <Cloud size={12} className="text-[#1E3A8A]" /> : <Link2 size={12} className="text-slate-500" />) : <ImageIcon size={12} className="text-slate-400" />}
                      {item.logo ? (item.logo_public_id ? "Cloudinary" : "External") : "None"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(item.updated_at)}</td>
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

      {/* MOBILE CARD LIST */}
      {!loading && items.length > 0 && (
        <div className="space-y-3 md:hidden">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-start gap-3">
                <LogoThumb item={item} className="h-12 w-12" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.category || "No subtitle"}</p>
                  <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {item.is_published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  {item.logo ? (item.logo_public_id ? <Cloud size={12} className="text-[#1E3A8A]" /> : <Link2 size={12} />) : <ImageIcon size={12} />}
                  {item.logo ? (item.logo_public_id ? "Cloudinary logo" : "External logo") : "No logo"}
                </span>
                <span className="inline-flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => reorderItem(item, "up")}
                    disabled={!canMoveUp(item.id) || movingId === item.id}
                    className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={`Move ${item.name} up`}
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
                    aria-label={`Move ${item.name} down`}
                    title="Move down"
                  >
                    <ArrowDown size={13} />
                  </button>
                </span>
                <span>Updated {formatDate(item.updated_at)}</span>
                {item.website && (
                  <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-[#1E3A8A]">
                    Visit site
                  </a>
                )}
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

      {/* LOADING */}
      {loading && (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 md:p-5">
              <div className="h-12 w-12 animate-pulse rounded-lg bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && items.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Building2 size={26} />
          </div>
          <p className="font-semibold text-slate-700">{search || status !== "all" ? "No matching companies." : "No trusted-network companies yet."}</p>
          {!search && status === "all" && (
            <p className="text-sm text-slate-500">Add your first partner company — it will appear on the public website immediately when published.</p>
          )}
          <button type="button" onClick={openCreate} className="mx-auto inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition">
            <Plus size={16} />
            Add Company
          </button>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={editingId ? "Edit company" : "Add company"}>
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white sm:max-w-2xl sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
              <h2 className="text-lg font-bold text-slate-800">{editingId ? "Edit company" : "Add a company"}</h2>
              <button type="button" onClick={closeModal} disabled={saving} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition" aria-label="Close">
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="block text-sm font-semibold text-slate-700 mb-1">
                    Company name <span className="text-red-500">*</span>
                  </span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Adani"
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  />
                </label>

                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Subtitle</span>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Mundra Port Alliance"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  />
                </label>

                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Website</span>
                  <input
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Description</span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Short description of the partnership or the company's role."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                  />
                </label>
              </div>

              {/* LOGO */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    Logo <span className="text-red-500">*</span>
                  </span>
                  {currentLogoPreview && (
                    <button type="button" onClick={() => { setLogoFile(null); setRemoveLogo(true); setLogoUrl(""); }} className="text-xs font-semibold text-red-600 hover:underline">
                      Remove logo
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {currentLogoPreview ? (
                    <img
                      src={currentLogoPreview}
                      alt="Logo preview"
                      className="h-16 w-16 rounded-lg bg-white object-contain p-1 ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                      <ImageIcon size={24} />
                    </div>
                  )}

                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-medium text-slate-700">
                      {logoFile ? logoMeta.name : removeLogo ? "No logo will be shown publicly unless a logo image is uploaded." : editingId ? "Existing logo kept." : "No logo selected."}
                    </p>
                    <p className="text-xs text-slate-500">
                      {logoMeta ? `Type: ${logoMeta.type} · Size: ${logoMeta.size}` : "Upload JPEG, PNG, WEBP, GIF, AVIF or SVG (max 15 MB)."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                    <Upload size={15} />
                    Choose file
                    <input ref={uploadInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml" className="hidden" onChange={handleFile} />
                  </label>
                  <div className="flex flex-1 items-center gap-2">
                    <span className="hidden text-xs text-slate-400 sm:inline">or</span>
                    <input
                      value={logoUrl}
                      onChange={(event) => { setLogoUrl(event.target.value); if (event.target.value) { setLogoFile(null); setRemoveLogo(false); } }}
                      placeholder="Paste an image URL instead…"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                    />
                  </div>
                </div>

                {fileError && (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                    <AlertCircle size={13} />
                    {fileError}
                  </p>
                )}
              </div>

              {/* SEO ALT */}
              <label>
                <span className="block text-sm font-semibold text-slate-700 mb-1">SEO logo alt text</span>
                <input
                  name="logo_alt"
                  value={form.logo_alt}
                  onChange={handleChange}
                  placeholder="e.g. Adani logo – Arrowline Logistics partner"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
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
                  <span className="mt-1 block text-xs text-slate-400">Lower numbers appear first on the website.</span>
                </label>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input name="is_published" type="checkbox" checked={form.is_published} onChange={handleChange} className="h-4 w-4 accent-[#FF7A00]" />
                    Active (visible on website)
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
                  {saving ? "Saving…" : editingId ? "Save changes" : "Add company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl border px-4 py-3 shadow-lg text-sm flex items-start gap-2.5 ${toast.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          {toast.type === "error" ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}