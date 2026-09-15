import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = fs.readFileSync("C:/Users/AIS/Downloads/arrowline-logistics-frontend-development/server/.env", "utf8");
const get = (k) => { const m = env.split("\n").find(l => l.startsWith(k + "=")); return m ? m.split("=").slice(1).join("=").trim() : ""; };
const supabase = createClient(get("SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });

const { count } = await supabase.from("leadership").select("*", { count: "exact", head: true });
console.log("existing leadership rows:", count);

import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;
cloudinary.config({
  cloud_name: get("CLOUDINARY_CLOUD_NAME"),
  api_key: get("CLOUDINARY_API_KEY"),
  api_secret: get("CLOUDINARY_API_SECRET"),
});
const getUrl = (publicId) => cloudinary.url(publicId, { secure: true });

const leaders = [
  { name: "Vinay Kumar", role: "Director & Head of Multimodal Operations", location: "Mundra Headquarters", email: "info@arrowlinelogistics.in", publicId: "arrowline-logistics/leadership/member-01", image_alt: "Vinay Kumar — Director & Head of Multimodal Operations, Arrowline Logistics", bio: "Over 18 years of logistics expertise in the Kutch maritime belt. Vinay coordinates direct relationships with port authorities, custom houses, and shipping line alliances at Mundra and Kandla." },
  { name: "K. R. Nair", role: "Head of Project Logistics & ODC Operations", location: "Pan-India Route Survey Division", email: "info@arrowlinelogistics.in", publicId: "arrowline-logistics/leadership/member-02", image_alt: "K. R. Nair — Head of Project Logistics & ODC Operations, Arrowline Logistics", bio: "A veteran heavy lift logistics planner. K.R. Nair manages route surveys, bridges, multi-axle trailer allocations, and coordinates state approvals for complex infrastructural moves." },
  { name: "Rajesh Joshi", role: "Senior Customs Brokerage & CHA Lead", location: "Mundra Port Customs Office", email: "info@arrowlinelogistics.in", publicId: "arrowline-logistics/leadership/member-03", image_alt: "Rajesh Joshi — Senior Customs Brokerage & CHA Lead, Arrowline Logistics", bio: "An expert on custom tariffs, ICEGATE, and trade dispute resolution. Rajesh ensures smooth import-export approvals and minimizes demurrage exposures." },
  { name: "Ananya Sharma", role: "Client Relations & Supply Chain Strategist", location: "Corporate Office", email: "info@arrowlinelogistics.in", publicId: "arrowline-logistics/leadership/member-04", image_alt: "Ananya Sharma — Client Relations & Supply Chain Strategist, Arrowline Logistics", bio: "Ananya designs customized supply chain frameworks for large automotive and FMCG brands, focusing on multimodal conversions that optimize delivery costs." },
].map((l) => ({ ...l, image: getUrl(l.publicId), image_public_id: l.publicId }));

for (const [i, { publicId, ...leader }] of leaders.entries()) {
  const { error } = await supabase.from("leadership").insert({ ...leader, display_order: i, is_published: true });
  console.log("leadership", leader.name, error ? `ERR ${error.message}` : "OK");
}

const coreValues = [
  { title: "Customer Commitment", description: "We don't just meet expectations, we anticipate them and exceed them at every touchpoint.", icon: "Handshake" },
  { title: "Integrity", description: "Every shipment, every transaction, every handshake is grounded in honesty and transparency.", icon: "Shield" },
  { title: "Innovation", description: "We adopt, adapt, and scale technologies that simplify logistics and empower our customers.", icon: "Lightbulb" },
  { title: "Teamwork", description: "Our people are our biggest asset. We win when we work together across departments and geographies.", icon: "Users" },
  { title: "Sustainability", description: "From route optimization to green warehouses, we act responsibly for the long term.", icon: "Leaf" },
];
for (const [i, cv] of coreValues.entries()) {
  const { error } = await supabase.from("core_values").insert({ ...cv, display_order: i, is_published: true });
  console.log("core_value", cv.title, error ? `ERR ${error.message}` : "OK");
}

console.log("DONE");