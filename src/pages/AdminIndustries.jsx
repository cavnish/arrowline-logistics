import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import { INDUSTRIES_SERVED } from "../data/logisticsData";
import { Upload } from "lucide-react";

const emptyIndustry = {
  slug: "", title: "", description: "", icon: "", cargo_types: [],
  image: "", is_published: false, display_order: 0,
};

export default function AdminIndustries() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyIndustry);
  const [editingId, setEditingId] = useState(null);
  const [cargoText, setCargoText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.get("/industries");
      setItems(response.data.data || []);
    } catch (err) {
      console.error("Loading industries:", err?.response?.data || err);
      setError(
        err?.response?.data?.message ||
          "Unable to load industries. Check that the backend is running and you are signed in as an admin."
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const importExisting = async () => {
    if (
      !window.confirm(
        `Import ${INDUSTRIES_SERVED.length} industries from the website dataset into the database? Industries that already exist (same slug) will be skipped.`
      )
    ) {
      return;
    }
    setImporting(true);
    setError("");
    try {
      let created = 0;
      for (const [index, industry] of INDUSTRIES_SERVED.entries()) {
        if (items.some((item) => (item.slug || item.id) === industry.id)) continue;
        await adminApi.post("/industries", {
          slug: industry.id,
          title: industry.title,
          description: industry.description,
          icon: industry.icon,
          cargo_types: industry.cargoTypes,
          image: industry.image,
          is_published: true,
          display_order: index,
        });
        created += 1;
      }
      await load();
      setMessage(
        created > 0
          ? `Imported ${created} industries into the database.`
          : "Nothing to import — industries already exist in the database."
      );
    } catch (err) {
      console.error("Importing industries:", err?.response?.data || err);
      setMessage(`Import failed: ${err?.response?.data?.message || err?.message || "unexpected error"}`);
    } finally {
      setImporting(false);
    }
  };

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const save = async (event) => {
    event.preventDefault();
    const payload = { ...form, cargo_types: cargoText.split(",").map((item) => item.trim()).filter(Boolean) };
    try {
      const response = editingId
        ? await adminApi.patch(`/industries/${editingId}`, payload)
        : await adminApi.post("/industries", payload);
      setItems((current) => editingId
        ? current.map((item) => item.id === editingId ? response.data.data : item)
        : [...current, response.data.data]);
      setForm(emptyIndustry);
      setCargoText("");
      setEditingId(null);
      setMessage("Industry saved.");
    } catch (error) {
      console.error("Saving industry:", error?.response?.data || error);
      setMessage(error?.response?.data?.message || "Unable to save industry.");
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({ ...emptyIndustry, ...item });
    setCargoText((item.cargo_types || []).join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this industry?")) return;
    try {
      await adminApi.delete(`/industries/${id}`);
      setItems((current) => current.filter((item) => item.id !== id));
      setMessage("Industry deleted.");
    } catch (error) {
      console.error("Deleting industry:", error?.response?.data || error);
      setMessage("Unable to delete industry.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-800">Industries</h1><p className="text-sm text-slate-500">Manage industry pages and cargo categories.</p></div>
      {error && <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800 flex items-center justify-between gap-4">{error}<button onClick={load} className="text-sm font-semibold text-rose-700 underline whitespace-nowrap">Retry</button></div>}
      {message && <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
      <form onSubmit={save} className="bg-white border border-slate-200 rounded-xl p-5 grid gap-4 md:grid-cols-2">
        {["title", "slug", "icon"].map((name) => <label key={name}><span className="block text-sm font-semibold text-slate-700 mb-1">{name}</span><input name={name} value={form[name] || ""} onChange={update} className="w-full border rounded-lg p-2" /></label>)}
        <label className="md:col-span-2">
          <span className="block text-sm font-semibold text-slate-700 mb-1">Image</span>
          <div className="flex gap-2">
            <input name="image" value={form.image || ""} onChange={update} className="flex-1 border rounded-lg p-2 font-mono text-xs" placeholder="Image URL" />
            <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap">
              <Upload className="w-3.5 h-3.5" /> Upload
              <input type="file" accept="image/*" className="sr-only" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const body = new FormData();
                  body.append("file", file);
                  body.append("folder", "industries");
                  const res = await adminApi.post("/media", body, { headers: { "Content-Type": "multipart/form-data" } });
                  if (res.data?.data?.url) {
                    setForm((prev) => ({ ...prev, image: res.data.data.url }));
                    setMessage("Image uploaded to Cloudinary. Save to publish.");
                  } else {
                    setMessage("Upload did not return a URL.");
                  }
                } catch (err) {
                  setMessage(err?.response?.data?.message || "Upload failed.");
                } finally {
                  setUploading(false);
                  e.target.value = "";
                }
              }} />
            </label>
          </div>
          {form.image && <img src={form.image} alt="Industry preview" className="mt-2 h-28 w-48 rounded-lg object-cover border border-slate-200 bg-slate-50" />}
          {uploading && <p className="text-xs text-slate-400 mt-1">Uploading...</p>}
        </label>
        <label className="md:col-span-2"><span className="block text-sm font-semibold text-slate-700 mb-1">Description</span><textarea name="description" value={form.description} onChange={update} className="w-full border rounded-lg p-2 min-h-24" /></label>
        <label className="md:col-span-2"><span className="block text-sm font-semibold text-slate-700 mb-1">Cargo types (comma separated)</span><input value={cargoText} onChange={(event) => setCargoText(event.target.value)} className="w-full border rounded-lg p-2" /></label>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input name="is_published" type="checkbox" checked={form.is_published} onChange={update} /> Published</label>
        <label className="text-sm font-semibold text-slate-700">Display order<input name="display_order" type="number" value={form.display_order} onChange={update} className="mt-1 w-full border rounded-lg p-2" /></label>
        <div className="md:col-span-2 flex gap-2"><button className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white">{editingId ? "Update industry" : "Create industry"}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyIndustry); setCargoText(""); }} className="px-4 py-2 rounded-lg border">Cancel</button>}</div>
      </form>
      {loading ? <p className="text-slate-500">Loading industries...</p> : items.length === 0 && !error ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
          <p className="text-slate-500 font-medium">No industries in the database yet.</p>
          <button
            onClick={importExisting}
            disabled={importing}
            className="px-5 py-2.5 rounded-lg bg-[#1E3A8A] text-white text-sm font-semibold flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {importing ? "Importing..." : `Import website industries (${INDUSTRIES_SERVED.length})`}
          </button>
        </div>
      ) : <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">{items.length === 0 ? <p className="p-6 text-slate-500">No industries found.</p> : items.map((item) => <div key={item.id} className="p-4 border-b last:border-b-0 flex items-center justify-between gap-4"><div><p className="font-semibold">{item.title}</p><p className="text-sm text-slate-500">/{item.slug} - {item.is_published ? "Published" : "Draft"}</p></div><div className="flex gap-2"><button onClick={() => edit(item)} className="text-sm font-semibold text-[#1E3A8A]">Edit</button><button onClick={() => remove(item.id)} className="text-sm font-semibold text-red-600">Delete</button></div></div>)}</div>}
    </div>
  );
}
