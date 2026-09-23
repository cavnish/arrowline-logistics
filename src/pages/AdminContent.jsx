import { useEffect, useState } from "react";
import adminApi from "../services/adminApi";

const DEFAULT_FIELDS = [
  ["hero_title", "Hero", "Logistics & Transportation Services Across India", "text"],
  ["hero_description", "Hero", "Arrowline provides reliable road transportation, freight, multimodal logistics and specialized cargo solutions for businesses across India — all anchored at Mundra Port, Gujarat.", "text"],
  ["hero_cta", "Hero", "Get a Free Quote", "text"],
  ["hero_image", "Hero", "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", "image"],
  ["hero_video", "Hero", "", "video"],
  ["about_description", "About", "Arrowline Logistics provides integrated logistics and transportation solutions designed to move cargo efficiently from origin to destination.", "text"],
  ["about_image", "About", "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg", "image"],
  ["about_secondary_image", "About", "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg", "image"],
  ["about_hero_video", "About", "", "video"],
  ["services_image", "Services", "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg", "image"],
  ["why_choose_us_image", "Why Choose Us", "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg", "image"],
  ["process_image", "Process", "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg", "image"],
  ["industries_image", "Industries", "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg", "image"],
  ["coverage_map_image", "Coverage Map", "https://res.cloudinary.com/uorctww6/raw/upload/v1789377040/arrowline/general/india-map", "image"],
  ["testimonials_image", "Testimonials", "https://res.cloudinary.com/uorctww6/image/upload/v1789377036/arrowline/general/business-handshake.jpg", "image"],
  ["faq_image", "FAQ", "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg", "image"],
  ["cta_image", "Final CTA", "https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg", "image"],
  ["footer_description", "Footer", "Moving Possibilities. Delivering Trust.", "text"],
  ["contact_phone", "Contact", "+91 99222 04446", "text"],
  ["contact_whatsapp", "Contact", "+91 97662 62612", "text"],
  ["contact_email", "Contact", "mundra@arrowlinelogistics.in", "text"],
  ["contact_secondary_email", "Contact", "info@arrowlinelogistics.in", "text"],
  ["contact_secondary_phone", "Contact", "+91 9766262612", "text"],
  ["contact_address", "Contact", "Office No. 124, 1st Floor, Bhinde Business Hub, Survey No. 76, Plot No. 1, Pragpar, Mundra Port Highway, Near Mahadev Mandir, Mundra, Gujarat - 370421, India", "text"],
  ["social_facebook", "Social Links", "", "text"],
  ["social_instagram", "Social Links", "", "text"],
  ["social_linkedin", "Social Links", "", "text"],
  ["social_youtube", "Social Links", "", "text"],
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

  const fields = DEFAULT_FIELDS.map(([key, section, fallback, contentType]) => ({
    content_key: key,
    section,
    content_value: items.find((item) => item.content_key === key)?.content_value || fallback,
    is_published: items.find((item) => item.content_key === key)?.is_published !== false,
    content_type: contentType,
  }));

  const save = async (field) => {
    try {
      const response = await adminApi.put(`/content/${field.content_key}`, {
        content_value: value,
        section: field.section,
        content_type: field.content_type,
        is_published: true,
      });
      setItems((current) => [...current.filter((item) => item.content_key !== field.content_key), response.data.data]);
      setEditing(null);
      setMessage("Content saved.");
    } catch {
      setMessage("Unable to save content.");
    }
  };

  const uploadImage = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (field.content_type === "video") {
      if (!["video/mp4", "video/webm", "video/ogg", "video/quicktime"].includes(file.type) || file.size > 100 * 1024 * 1024) {
        setMessage("Use an MP4, WEBM, OGG, or QuickTime video up to 100 MB.");
        return;
      }
    } else if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage("Use a JPG, PNG, or WEBP image up to 5 MB.");
      return;
    }
    const body = new FormData();
    body.append("file", file);
    body.append("folder", "site-content");
    try {
      const response = await adminApi.post("/media", body, { headers: { "Content-Type": "multipart/form-data" } });
      const nextValue = response.data.data.url;
      setItems((current) => [...current.filter((item) => item.content_key !== field.content_key), {
        ...field,
        content_value: nextValue,
        content_type: field.content_type,
      }]);
      setMessage(`${field.section} ${field.content_type === "video" ? "video" : "image"} uploaded. Save it to publish the change.`);
      setEditing(field.content_key);
      setValue(nextValue);
    } catch (error) {
      console.error("Uploading section media:", error?.response?.data || error);
      setMessage(error?.response?.data?.message || "Unable to upload media.");
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading content...</div>;
  return <div className="p-6 max-w-4xl mx-auto space-y-5">
    <div><h1 className="text-2xl font-bold text-slate-800">Website Content</h1><p className="text-sm text-slate-500">Controlled text overrides. The public site keeps its built-in copy if this service is unavailable.</p></div>
    {message && <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
    {fields.map((field) => <div key={field.content_key} className="bg-white border border-slate-200 rounded-xl p-5 transition-shadow hover:shadow-md">
      <p className="text-xs font-semibold uppercase text-[#1E3A8A]">{field.section}</p><p className="font-medium mt-1">{field.content_key}</p>
      {field.content_type === "image" && <div className="mt-3 flex flex-wrap items-center gap-4"><img src={field.content_value} alt={`${field.section} preview`} className="h-24 w-40 rounded-lg object-cover border border-slate-200 bg-slate-50" /><label className="cursor-pointer rounded-lg border border-dashed border-[#1E3A8A]/40 px-4 py-3 text-sm font-semibold text-[#1E3A8A] hover:bg-blue-50">Upload image<input type="file" accept=".jpg,.jpeg,.png,.webp,.svg" onChange={(event) => uploadImage(event, field)} className="sr-only" /></label></div>}
      {field.content_type === "video" && <div className="mt-3 flex flex-wrap items-center gap-4">{field.content_value ? <video src={field.content_value} className="h-24 w-40 rounded-lg object-cover border border-slate-200 bg-slate-50" muted playsInline /> : <div className="flex h-24 w-40 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-400">No video set</div>}{field.content_value && <p className="text-xs text-slate-500 break-all">{field.content_value}</p>}<label className="cursor-pointer rounded-lg border border-dashed border-[#FF6B1A]/40 px-4 py-3 text-sm font-semibold text-[#FF6B1A] hover:bg-orange-50">Upload video<input type="file" accept=".mp4,.webm,.ogg,.mov" onChange={(event) => uploadImage(event, field)} className="sr-only" /></label></div>}
      {editing === field.content_key ? <><textarea value={value} onChange={(event) => setValue(event.target.value)} className="mt-3 w-full min-h-28 border rounded-lg p-3" />
        <div className="mt-3 flex gap-2"><button onClick={() => save(field)} className="px-4 py-2 rounded-lg bg-[#1E3A8A] text-white">Save</button><button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border">Cancel</button></div></> : <><p className="mt-3 text-slate-600 whitespace-pre-wrap">{field.content_value}</p><button onClick={() => { setEditing(field.content_key); setValue(field.content_value); }} className="mt-3 text-sm font-semibold text-[#1E3A8A]">Edit</button></>}
    </div>)}
  </div>;
}