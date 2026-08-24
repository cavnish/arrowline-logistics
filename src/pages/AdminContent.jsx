import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

const DEFAULT_FIELDS = [
  ["hero_title", "Hero", "Logistics & Transportation Services Across India"],
  ["hero_description", "Hero", "Arrowline provides reliable road transportation, freight, multimodal logistics and specialized cargo solutions for businesses across India — all anchored at Mundra Port, Gujarat."],
  ["hero_cta", "Hero", "Get a Free Quote"],
  ["about_description", "About", "Arrowline Logistics provides integrated logistics and transportation solutions designed to move cargo efficiently from origin to destination."],
  ["footer_description", "Footer", "Moving Possibilities. Delivering Trust."],
];

export default function AdminContent() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get("/content")
      .then((response) => setItems(response.data.data))
      .catch(() => setMessage("Unable to load content. Apply the site_content migration first."))
      .finally(() => setLoading(false));
  }, []);

  const fields = DEFAULT_FIELDS.map(([key, section, fallback]) => ({
    content_key: key,
    section,
    content_value: items.find((item) => item.content_key === key)?.content_value || fallback,
    is_published: items.find((item) => item.content_key === key)?.is_published !== false,
  }));

  const save = async (field) => {
    try {
      const response = await adminApi.put(`/content/${field.content_key}`, {
        content_value: value,
        section: field.section,
        content_type: "text",
        is_published: true,
      });
      setItems((current) => [...current.filter((item) => item.content_key !== field.content_key), response.data.data]);
      setEditing(null);
      setMessage("Content saved.");
    } catch {
      setMessage("Unable to save content.");
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading content...</div>;
  return <div className="p-6 max-w-4xl mx-auto space-y-5">
    <div><h1 className="text-2xl font-bold text-slate-800">Website Content</h1><p className="text-sm text-slate-500">Controlled text overrides. The public site keeps its built-in copy if this service is unavailable.</p></div>
    {message && <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
    {fields.map((field) => <div key={field.content_key} className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-xs font-semibold uppercase text-[#1E3A8A]">{field.section}</p><p className="font-medium mt-1">{field.content_key}</p>
      {editing === field.content_key ? <><textarea value={value} onChange={(event) => setValue(event.target.value)} className="mt-3 w-full min-h-28 border rounded-lg p-3" />
        <div className="mt-3 flex gap-2"><button onClick={() => save(field)} className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white">Save</button><button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border">Cancel</button></div></> : <><p className="mt-3 text-slate-600 whitespace-pre-wrap">{field.content_value}</p><button onClick={() => { setEditing(field.content_key); setValue(field.content_value); }} className="mt-3 text-sm font-semibold text-[#1E3A8A]">Edit</button></>}
    </div>)}
  </div>;
}
