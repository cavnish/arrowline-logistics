import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;
import fs from "node:fs";

const env = fs.readFileSync("C:/Users/AIS/Downloads/arrowline-logistics-frontend-development/server/.env", "utf8");
const get = (k) => { const m = env.split("\n").find(l => l.startsWith(k + "=")); return m ? m.split("=").slice(1).join("=").trim() : ""; };

const supabase = createClient(get("SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
cloudinary.config({
  cloud_name: get("CLOUDINARY_CLOUD_NAME"),
  api_key: get("CLOUDINARY_API_KEY"),
  api_secret: get("CLOUDINARY_API_SECRET"),
});

const uploadUrl = (url, publicId) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      url,
      { folder: "arrowline-logistics/leadership", public_id: publicId, overwrite: true },
      (err, res) => (err ? reject(err) : resolve(res))
    );
  });

// ---------- 1. SITE CONTENT image keys (upsert) ----------
const contentImages = {
  hero_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg",
  about_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
  services_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
  why_choose_us_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg",
  process_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg",
  industries_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg",
  testimonials_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377036/arrowline/general/business-handshake.jpg",
  faq_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg",
  cta_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg",
  milestones_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377036/arrowline/general/business-handshake.jpg",
  differentiators_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg",
  core_values_image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg",
};
const sections = {
  hero_image: "Hero", about_image: "About", services_image: "Services", why_choose_us_image: "Why Choose Us",
  process_image: "Process", industries_image: "Industries", testimonials_image: "Testimonials", faq_image: "FAQ",
  cta_image: "Final CTA", milestones_image: "About", differentiators_image: "About", core_values_image: "About",
};
for (const [key, url] of Object.entries(contentImages)) {
  const { error } = await supabase.from("site_content").upsert(
    { content_key: key, content_value: url, content_type: "image", section: sections[key], is_published: true, updated_at: new Date().toISOString() },
    { onConflict: "content_key" }
  );
  console.log("site_content", key, error ? `ERR ${error.message}` : "OK");
}

// ---------- 2. INDUSTRIES from static dataset ----------
const industries = [
  { slug: "automotive", title: "Automotive", description: "High-precision JIT linehaul for Tier-1/Tier-2 component makers and OEM assembly plants across Gujarat, Maharashtra, Haryana and Tamil Nadu.", icon: "Car", cargo_types: ["Engine components", "Chassis parts", "Finished vehicles", "Tires & batteries"], image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg" },
  { slug: "fmcg-retail", title: "FMCG & Retail", description: "High-velocity primary and secondary distribution connecting manufacturing hubs with regional distribution centers nationwide.", icon: "ShoppingBag", cargo_types: ["Packaged foods", "Beverages", "Consumer goods", "Personal care"], image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg" },
  { slug: "manufacturing-engineering", title: "Manufacturing & Engineering", description: "End-to-end transportation of industrial equipment, raw steel coils, structural assemblies, precision machinery and foundry castings.", icon: "Cog", cargo_types: ["Heavy machinery", "Castings & forgings", "Pumps & turbines", "Industrial assemblies"], image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
  { slug: "pharmaceutical", title: "Pharmaceutical", description: "Time-critical, compliant transportation for APIs, medical products and laboratory equipment adhering to strict QA criteria.", icon: "ShieldAlert", cargo_types: ["APIs & bulk chemicals", "Medical equipment", "Packaging materials", "Formulations"], image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg" },
  { slug: "chemical", title: "Chemical", description: "Compliant containerized logistics for industrial polymers, specialty chemicals, liquid ISO tanks, and raw resins imported through Mundra and Kandla.", icon: "FlaskConical", cargo_types: ["Polymers & resins", "Specialty chemicals", "Bulk liquid containers", "Fertilizers"], image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg" },
  { slug: "infrastructure-steel", title: "Infrastructure & Steel", description: "High-tonnage movement of steel coils, TMT rebars, structural girders, pipes, cement and heavy construction equipment.", icon: "HardHat", cargo_types: ["Steel coils & sheets", "TMT bars & pipes", "Cement & gypsum", "Earthmoving machines"], image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg" },
  { slug: "solar-energy", title: "Solar Energy", description: "Specialized logistics and rapid port clearance for solar PV modules, central inverters, mounting structures, and high-voltage power transformers.", icon: "Sun", cargo_types: ["Solar PV modules", "Inverter skids", "Power transformers", "Wind turbine parts"], image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg" },
  { slug: "e-commerce-retail", title: "E-Commerce & Retail", description: "Consumer electronics, telecom equipment, apparel and bulk parcel linehaul with strict door-delivery windows.", icon: "Layers", cargo_types: ["Consumer electronics", "Telecom equipment", "Apparel & textiles", "Bulk parcel linehaul"], image: "https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg" },
];
for (const [i, ind] of industries.entries()) {
  const { error } = await supabase.from("industries").upsert(
    { ...ind, display_order: i, is_published: true, updated_at: new Date().toISOString() },
    { onConflict: "slug" }
  );
  console.log("industry", ind.slug, error ? `ERR ${error.message}` : "OK");
}

// ---------- 3. LEADERSHIP (upload photos to Cloudinary first) ----------
const leaders = [
  { name: "Vinay Kumar", role: "Director & Head of Multimodal Operations", location: "Mundra Headquarters", email: "info@arrowlinelogistics.in", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop", bio: "Over 18 years of logistics expertise in the Kutch maritime belt. Vinay coordinates direct relationships with port authorities, custom houses, and shipping line alliances at Mundra and Kandla." },
  { name: "K. R. Nair", role: "Head of Project Logistics & ODC Operations", location: "Pan-India Route Survey Division", email: "info@arrowlinelogistics.in", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&fit=crop", bio: "A veteran heavy lift logistics planner. K.R. Nair manages route surveys, bridges, multi-axle trailer allocations, and coordinates state approvals for complex infrastructural moves." },
  { name: "Rajesh Joshi", role: "Senior Customs Brokerage & CHA Lead", location: "Mundra Port Customs Office", email: "info@arrowlinelogistics.in", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=400&fit=crop", bio: "An expert on custom tariffs, ICEGATE, and trade dispute resolution. Rajesh ensures smooth import-export approvals and minimizes demurrage exposures." },
  { name: "Ananya Sharma", role: "Client Relations & Supply Chain Strategist", location: "Corporate Office", email: "info@arrowlinelogistics.in", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop", bio: "Ananya designs customized supply chain frameworks for large automotive and FMCG brands, focusing on multimodal conversions that optimize delivery costs." },
];
for (const [i, leader] of leaders.entries()) {
  let image = leader.image;
  let pid = null;
  try {
    const result = await uploadUrl(leader.image, "member-" + String(i+1).padStart(2, "0"));
    image = result.secure_url;
    pid = result.public_id;
    console.log("leadership photo uploaded:", pid);
  } catch (err) {
    console.warn("leadership photo upload failed, keeping original:", err?.error?.message || err?.message);
  }
  const { error } = await supabase.from("leadership").upsert(
    { name: leader.name, role: leader.role, location: leader.location, email: leader.email, bio: leader.bio, image, image_public_id: pid, image_alt: `${leader.name} — ${leader.role}, Arrowline Logistics`, display_order: i, is_published: true, updated_at: new Date().toISOString() },
    { onConflict: "name" }
  );
  console.log("leadership", leader.name, error ? `ERR ${error.message}` : "OK");
}

// ---------- 4. CORE VALUES from static dataset ----------
const coreValues = [
  { title: "Customer Commitment", description: "We don't just meet expectations, we anticipate them and exceed them at every touchpoint.", icon: "Handshake" },
  { title: "Integrity", description: "Every shipment, every transaction, every handshake is grounded in honesty and transparency.", icon: "Shield" },
  { title: "Innovation", description: "We adopt, adapt, and scale technologies that simplify logistics and empower our customers.", icon: "Lightbulb" },
  { title: "Teamwork", description: "Our people are our biggest asset. We win when we work together across departments and geographies.", icon: "Users" },
  { title: "Sustainability", description: "From route optimization to green warehouses, we act responsibly for the long term.", icon: "Leaf" },
];
for (const [i, cv] of coreValues.entries()) {
  const { error } = await supabase.from("core_values").upsert(
    { ...cv, display_order: i, is_published: true, updated_at: new Date().toISOString() },
    { onConflict: "title" }
  );
  console.log("core_value", cv.title, error ? `ERR ${error.message}` : "OK");
}

console.log("SEED COMPLETE");