import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";
import { CORE_SERVICES } from "../data/logisticsData";

const emptyService = {
  slug: "",
  title: "",
  short_description: "",
  full_description: "",
  icon: "",
  hero_image: "",
  is_published: false,
  display_order: 0,
  meta_title: "",
  meta_description: "",
  canonical_url: "",
  og_image: "",
  cta_text: "",
  cta_url: "",
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyService);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("database");

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await adminApi.get("/services");
      setServices(response.data.data || []);
    } catch (error) {
      console.error("Loading services:", error?.response?.data || error);
      setServices(CORE_SERVICES.map((service, index) => ({
        id: service.id,
        slug: service.slug,
        title: service.title,
        short_description: service.shortDesc,
        full_description: service.longDesc,
        icon: "",
        hero_image: service.image,
        is_published: true,
        display_order: index,
        meta_title: service.seoTitle,
        meta_description: service.seoDesc,
      })));
      setSource("static");
      setMessage("Showing existing website services from logisticsData.ts. Apply the services migration to enable database editing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, []);

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      const response = editingId
        ? await adminApi.patch(`/services/${editingId}`, form)
        : await adminApi.post("/services", form);
      setServices((current) => editingId
        ? current.map((item) => item.id === editingId ? response.data.data : item)
        : [...current, response.data.data]);
      setForm(emptyService);
      setEditingId(null);
      setMessage("Service saved.");
    } catch (error) {
      console.error("Saving service:", error?.response?.data || error);
      setMessage(error?.response?.data?.message || "Unable to save service.");
    }
  };

  const edit = (service) => {
    setEditingId(service.id);
    setForm({ ...emptyService, ...service });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await adminApi.delete(`/services/${id}`);
      setServices((current) => current.filter((item) => item.id !== id));
      setMessage("Service deleted.");
    } catch (error) {
      console.error("Deleting service:", error?.response?.data || error);
      setMessage("Unable to delete service.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Services</h1>
        <p className="text-sm text-slate-500">Manage published service content and SEO fields.</p>
      </div>
      {source === "static" && <p className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">These are the existing public website records. They are read-only until the services table migration is applied.</p>}
      {message && <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
      <form onSubmit={save} className="bg-white border border-slate-200 rounded-xl p-5 grid gap-4 md:grid-cols-2">
        {["title", "slug", "icon", "hero_image", "short_description", "full_description", "meta_title", "meta_description", "canonical_url", "og_image", "cta_text", "cta_url"].map((name) => (
          <label key={name} className={name.includes("description") && name !== "meta_description" ? "md:col-span-2" : ""}>
            <span className="block text-sm font-semibold text-slate-700 mb-1">{name.replaceAll("_", " ")}</span>
            {name.includes("description") || name === "full_description"
              ? <textarea name={name} value={form[name] || ""} onChange={updateForm} className="w-full border rounded-lg p-2 min-h-20" />
              : <input name={name} value={form[name] || ""} onChange={updateForm} className="w-full border rounded-lg p-2" />}
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input name="is_published" type="checkbox" checked={form.is_published} onChange={updateForm} /> Published
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Display order
          <input name="display_order" type="number" value={form.display_order} onChange={updateForm} className="mt-1 w-full border rounded-lg p-2" />
        </label>
        <div className="md:col-span-2 flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white">{editingId ? "Update service" : "Create service"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyService); }} className="px-4 py-2 rounded-lg border">Cancel</button>}
        </div>
      </form>
      {loading ? <p className="text-slate-500">Loading services...</p> : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {services.length === 0 ? <p className="p-6 text-slate-500">No services found.</p> : services.map((service) => (
            <div key={service.id} className="p-4 border-b last:border-b-0 flex items-center justify-between gap-4">
              <div><p className="font-semibold">{service.title}</p><p className="text-sm text-slate-500">/{service.slug} - {service.is_published ? "Published" : "Draft"}</p></div>
              <div className="flex gap-2"><button onClick={() => edit(service)} className="text-sm font-semibold text-[#1E3A8A]">Edit</button><button onClick={() => remove(service.id)} className="text-sm font-semibold text-red-600">Delete</button></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
