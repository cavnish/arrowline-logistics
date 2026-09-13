import { useEffect, useMemo, useState } from "react";
import adminApi from "../services/adminApi";
import {
  BLOG_POSTS,
  CASE_STUDIES,
  CLIENT_LOGOS,
  CLIENT_TESTIMONIALS,
  FAQ_ITEMS,
  GALLERY_ITEMS,
  LOGISTICS_STATS,
  REGIONAL_HUBS,
  COMPANY_DETAILS,
} from "../data/logisticsData";

const configs = {
  "case-studies": ["title", "slug", "client_name", "industry", "location", "description", "challenge", "solution", "results", "featured_image", "meta_title", "meta_description"],
  gallery: ["title", "description", "category", "image", "alt_text"],
  locations: ["name", "slug", "state", "city", "description", "address", "image", "map_url", "meta_title", "meta_description"],
  clients: ["name", "logo", "category", "website", "is_featured"],
  faqs: ["question", "answer", "category"],
  testimonials: ["customer_name", "company", "position", "testimonial", "photo", "rating"],
  "blog-categories": ["name", "slug", "description"],
  "blog-posts": ["title", "slug", "author", "featured_image", "excerpt", "content", "meta_title", "meta_description", "keywords", "published_at"],
  "social-videos": ["title", "video_url", "embed_url", "thumbnail", "description", "platform"],
  statistics: ["value", "label", "description", "icon"],
  "site-settings": ["setting_key", "setting_value", "setting_type"],
};

const labels = (key) => key.replaceAll("_", " ");

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
  faqs: FAQ_ITEMS.map((item, index) => ({
    id: item.id, question: item.question, answer: item.answer, category: item.category,
    is_published: true, display_order: index,
  })),
  testimonials: CLIENT_TESTIMONIALS.map((item, index) => ({
    id: item.id, customer_name: item.clientName, company: item.company, position: item.role,
    testimonial: item.comment, photo: item.avatar, rating: item.rating, is_published: true, display_order: index,
  })),
  "blog-posts": BLOG_POSTS.map((item, index) => ({
    id: item.id, title: item.title, slug: item.slug, author: item.author,
    featured_image: item.image, excerpt: item.summary, content: item.summary, published_at: item.date,
    is_published: true, display_order: index,
  })),
  statistics: LOGISTICS_STATS.map((item, index) => ({
    id: item.id, value: item.number, label: item.label, description: item.sublabel, icon: item.iconName,
    is_published: true, display_order: index,
  })),
  locations: REGIONAL_HUBS.map((item, index) => ({
    id: item.id, name: item.name, slug: item.id, state: item.state, description: item.details,
    address: item.connectivity, is_published: true, display_order: index,
  })),
  clients: CLIENT_LOGOS.map((item, index) => ({
    id: `client-${index}`, name: item.name, logo: "", category: item.logoType,
    website: "", is_featured: true, is_published: true, display_order: index,
  })),
  "site-settings": Object.entries(COMPANY_DETAILS).map(([key, value]) => ({
    id: key, setting_key: key, setting_value: String(value), setting_type: "text",
  })),
};

export default function AdminCollection({ resource, title }) {
  const fields = configs[resource];
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.get(`/${resource}`, { params: { search, status, page: 1, limit: 100 } });
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

  useEffect(() => { load(); }, [resource, search, status]);
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
      setMessage(
        created > 0
          ? `Imported ${created} ${title.toLowerCase()} record(s) into the database.`
          : "Nothing to import — records already exist in the database."
      );
    } catch (err) {
      console.error(`Importing ${resource}:`, err?.response?.data || err);
      setMessage(`Import failed: ${err?.response?.data?.message || err?.message || "unexpected error"}`);
    } finally {
      setImporting(false);
    }
  };

  const isLong = useMemo(() => new Set(["description", "content", "answer", "challenge", "solution", "results", "testimonial", "excerpt", "address", "setting_value"]), []);
  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };
  const save = async (event) => {
    event.preventDefault();
    try {
      const response = editingId ? await adminApi.patch(`/${resource}/${editingId}`, form) : await adminApi.post(`/${resource}`, form);
      setItems((current) => editingId ? current.map((item) => item.id === editingId ? response.data.data : item) : [response.data.data, ...current]);
      setForm({});
      setEditingId(null);
      setMessage("Saved successfully.");
    } catch (error) {
      console.error(`Saving ${resource}:`, error?.response?.data || error);
      setMessage(error?.response?.data?.message || "Unable to save.");
    }
  };
  const uploadImage = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage("Use a JPG, PNG, or WEBP image up to 5 MB.");
      return;
    }
    const body = new FormData();
    body.append("file", file);
    body.append("folder", resource);
    try {
      const response = await adminApi.post("/media", body, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((current) => ({ ...current, [field]: response.data.data.url }));
      setMessage("Image uploaded.");
    } catch (error) {
      console.error("Uploading image:", error?.response?.data || error);
      setMessage(error?.response?.data?.message || "Unable to upload image.");
    }
  };
  const edit = (item) => { setEditingId(item.id); setForm({ ...item }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = async (id) => {
    if (!window.confirm(`Delete this ${title.toLowerCase()} record?`)) return;
    try { await adminApi.delete(`/${resource}/${id}`); setItems((current) => current.filter((item) => item.id !== id)); setMessage("Deleted successfully."); }
    catch (error) { console.error(`Deleting ${resource}:`, error?.response?.data || error); setMessage("Unable to delete."); }
  };

  return <div className="p-6 max-w-6xl mx-auto space-y-6">
    <div><h1 className="text-2xl font-bold text-slate-800">{title}</h1><p className="text-sm text-slate-500">Manage website records stored in Supabase.</p></div>
    {error && <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800 flex items-center justify-between gap-4">{error}<button onClick={load} className="text-sm font-semibold text-rose-700 underline whitespace-nowrap">Retry</button></div>}
    {message && <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
    <form onSubmit={save} className="bg-white border border-slate-200 rounded-xl p-5 grid gap-4 md:grid-cols-2">
      {fields.map((field) => <label key={field} className={isLong.has(field) ? "md:col-span-2" : ""}><span className="block text-sm font-semibold text-slate-700 mb-1">{labels(field)}</span>{isLong.has(field) ? <textarea name={field} value={form[field] || ""} onChange={update} className="w-full border rounded-lg p-2 min-h-20" /> : <input name={field} value={form[field] || ""} onChange={update} className="w-full border rounded-lg p-2" />}{["image", "photo", "featured_image", "thumbnail", "logo"].includes(field) && <><input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(event) => uploadImage(event, field)} className="mt-2 text-sm" />{form[field] && <img src={form[field]} alt="" className="mt-2 h-20 w-32 object-cover rounded" />}</>}</label>)}
      {["case-studies", "gallery", "locations", "clients", "faqs", "testimonials", "blog-categories", "blog-posts", "social-videos", "statistics"].includes(resource) && <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input name="is_published" type="checkbox" checked={Boolean(form.is_published)} onChange={update} /> Published</label>}
      {["case-studies", "gallery", "locations", "clients", "faqs", "testimonials", "social-videos", "statistics"].includes(resource) && <label className="text-sm font-semibold text-slate-700">Display order<input name="display_order" type="number" value={form.display_order || 0} onChange={update} className="mt-1 w-full border rounded-lg p-2" /></label>}
      {resource === "clients" && <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input name="is_featured" type="checkbox" checked={Boolean(form.is_featured)} onChange={update} /> Featured partner</label>}
      <div className="md:col-span-2 flex gap-2"><button className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white">{editingId ? "Update" : "Create"}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm({}); }} className="px-4 py-2 rounded-lg border">Cancel</button>}</div>
    </form>
    <div className="flex gap-3"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} className="border rounded-lg p-2 flex-1" /><select value={status} onChange={(event) => setStatus(event.target.value)} className="border rounded-lg p-2"><option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select></div>
    {loading ? <p className="text-slate-500">Loading...</p> : items.length === 0 && !error && websiteRecords.length > 0 ? (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
        <p className="text-slate-500 font-medium">No {title.toLowerCase()} records in the database yet.</p>
        <button
          onClick={importExisting}
          disabled={importing}
          className="px-5 py-2.5 rounded-lg bg-[#1E3A8A] text-white text-sm font-semibold disabled:opacity-50"
        >
          {importing ? "Importing..." : `Import ${websiteRecords.length} website record(s)`}
        </button>
      </div>
    ) : <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">{items.length === 0 ? <p className="p-6 text-slate-500">No records found.</p> : items.map((item) => <div key={item.id} className="p-4 border-b last:border-b-0 flex items-center justify-between gap-4"><div><p className="font-semibold">{item.title || item.name || item.label || item.question || item.customer_name || item.setting_key}</p><p className="text-sm text-slate-500">{item.is_published === false ? "Draft" : "Published"}</p></div><div className="flex gap-2"><button onClick={() => edit(item)} className="text-sm font-semibold text-[#1E3A8A]">Edit</button><button onClick={() => remove(item.id)} className="text-sm font-semibold text-red-600">Delete</button></div></div>)}</div>}
  </div>;
}
