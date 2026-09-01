import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import { INDUSTRIES_SERVED } from "../data/logisticsData";

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
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("database");

  const load = async () => {
    try {
      const response = await adminApi.get("/industries");
      setItems(response.data.data || []);
    } catch (error) {
      console.error("Loading industries:", error?.response?.data || error);
      setItems(INDUSTRIES_SERVED.map((industry, index) => ({
        id: industry.id,
        slug: industry.id,
        title: industry.title,
        description: industry.description,
        icon: industry.icon,
        cargo_types: industry.cargoTypes,
        image: industry.image,
        is_published: true,
        display_order: index,
      })));
      setSource("static");
      setMessage("Showing existing website industries from logisticsData.ts. Apply the industries migration to enable database editing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
      {source === "static" && <p className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">These are the existing public website records. They are read-only until the industries table migration is applied.</p>}
      {message && <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
      <form onSubmit={save} className="bg-white border border-slate-200 rounded-xl p-5 grid gap-4 md:grid-cols-2">
        {["title", "slug", "icon", "image"].map((name) => <label key={name}><span className="block text-sm font-semibold text-slate-700 mb-1">{name}</span><input name={name} value={form[name] || ""} onChange={update} className="w-full border rounded-lg p-2" /></label>)}
        <label className="md:col-span-2"><span className="block text-sm font-semibold text-slate-700 mb-1">Description</span><textarea name="description" value={form.description} onChange={update} className="w-full border rounded-lg p-2 min-h-24" /></label>
        <label className="md:col-span-2"><span className="block text-sm font-semibold text-slate-700 mb-1">Cargo types (comma separated)</span><input value={cargoText} onChange={(event) => setCargoText(event.target.value)} className="w-full border rounded-lg p-2" /></label>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input name="is_published" type="checkbox" checked={form.is_published} onChange={update} /> Published</label>
        <label className="text-sm font-semibold text-slate-700">Display order<input name="display_order" type="number" value={form.display_order} onChange={update} className="mt-1 w-full border rounded-lg p-2" /></label>
        <div className="md:col-span-2 flex gap-2"><button className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white">{editingId ? "Update industry" : "Create industry"}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyIndustry); setCargoText(""); }} className="px-4 py-2 rounded-lg border">Cancel</button>}</div>
      </form>
      {loading ? <p className="text-slate-500">Loading industries...</p> : <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">{items.length === 0 ? <p className="p-6 text-slate-500">No industries found.</p> : items.map((item) => <div key={item.id} className="p-4 border-b last:border-b-0 flex items-center justify-between gap-4"><div><p className="font-semibold">{item.title}</p><p className="text-sm text-slate-500">/{item.slug} - {item.is_published ? "Published" : "Draft"}</p></div><div className="flex gap-2"><button onClick={() => edit(item)} className="text-sm font-semibold text-[#1E3A8A]">Edit</button><button onClick={() => remove(item.id)} className="text-sm font-semibold text-red-600">Delete</button></div></div>)}</div>}
    </div>
  );
}
