import { useEffect, useState, useMemo } from "react";
import adminApi from "../services/adminApi";
import {
  MAIN_SERVICES,
} from "../data/servicesData";
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Upload,
  Globe,
  Sparkles,
  HelpCircle,
  Check,
  Video,
  Image as ImageIcon,
  Search,
  ExternalLink,
  Shield,
  Clock,
  Briefcase,
  FileText,
  Sliders,
  ArrowLeft,
  X,
  RefreshCw,
  Database,
} from "lucide-react";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function snakeToCamel(value) {
  return value.replace(/_([a-z])/g, (_, ch) => ch.toUpperCase());
}

function serviceRowToForm(record = {}) {
  const out = {};
  for (const [key, value] of Object.entries(record)) {
    if (key === "service_items" || key === "sub_services_count") continue;
    out[snakeToCamel(key)] = value;
  }
  if (Array.isArray(record.subServices)) {
    out.subServices = record.subServices.map((sub) => serviceRowToForm(sub));
  }
  return out;
}

export default function AdminServices() {
  // State: Data List
  const [mainServices, setMainServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedMainId, setExpandedMainId] = useState("road-transportation");

  // State: Active Editing Entity
  const [isEditing, setIsEditing] = useState(false);
  const [editType, setEditType] = useState("main"); // "main" | "sub"
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({});
  const [parentOptions, setParentOptions] = useState([]);

  // State: UI Feedback
  const [message, setMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Load Services on Mount
  const loadServices = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await adminApi.get("/services");
      if (res.data?.data && res.data.data.length > 0) {
        setMainServices(res.data.data.map(serviceRowToForm));
      } else {
        setMainServices([]);
      }
    } catch (err) {
      console.warn("[AdminServices] Unable to load services from the database:", err);
      setLoadError(
        err?.response?.data?.message ||
          "Unable to load services. Check that the backend is running and you are signed in as an admin."
      );
      setMainServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    setParentOptions(
      mainServices.map((m) => ({
        id: m.id,
        slug: m.slug,
        title: m.title,
      }))
    );
  }, [mainServices]);

  const showToast = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // Filtered Services for List View
  // -------------------------------------------------------------
  const filteredServices = useMemo(() => {
    return mainServices.filter((srv) => {
      const matchSearch =
        !searchTerm ||
        srv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        srv.subServices?.some((sub) =>
          sub.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && srv.isPublished) ||
        (statusFilter === "draft" && !srv.isPublished);

      return matchSearch && matchStatus;
    });
  }, [mainServices, searchTerm, statusFilter]);

  // -------------------------------------------------------------
  // Editor Open / Close
  // -------------------------------------------------------------
  const startEditMain = (service) => {
    setEditType("main");
    setFormData(JSON.parse(JSON.stringify(service)));
    setActiveTab("general");
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEditSub = (sub, parentSlug) => {
    setEditType("sub");
    const parent = mainServices.find((m) => m.slug === parentSlug);
    setFormData({
      ...JSON.parse(JSON.stringify(sub)),
      parentSlug: parentSlug,
      parentName: parent?.title || "Main Service",
    });
    setActiveTab("general");
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startNewMain = () => {
    setEditType("main");
    setFormData({
      id: "",
      slug: "",
      title: "",
      shortDesc: "",
      category: "HIGHWAY & INDUSTRIAL LOGISTICS",
      keyCapability: "",
      heroBadge: "ARROWLINE CORE VERTICAL",
      heroHeadline: "",
      heroSubheadline: "",
      heroDescription: "",
      heroImage: "/images/road-transport.jpg",
      heroVideo: "",
      heroFallbackImage: "/images/road-transport.jpg",
      highlights: ["Pan-India Coverage", "GPS Telemetry", "24/7 Operations", "Port Clearance"],
      aboutBadge: "ABOUT THE SERVICE",
      aboutHeading: "",
      aboutDescription: "",
      aboutBulletPoints: ["Pan-India container & fleet transit", "Direct Mundra Port gate synchronization"],
      aboutImage: "/images/road-transport.jpg",
      whyArrowline: [
        { number: "01", title: "Port Hub Access", desc: "Anchored directly at Mundra Port." },
        { number: "02", title: "Dedicated Fleet", desc: "Modern GPS-tracked vehicles." },
      ],
      processSteps: [
        { step: "01", title: "Requirement Intake", desc: "Understand freight profile and timeline." },
        { step: "02", title: "Corridor Clearance", desc: "Route survey and vehicle positioning." },
      ],
      applications: [
        { title: "Industrial Machinery", desc: "Engineered heavy lift handling.", image: "/images/road-transport.jpg" },
      ],
      industries: ["Manufacturing", "Engineering", "Automotive", "Energy & Power"],
      networkDescription: "Connecting ports, factories, warehouses and project sites through specialized transit.",
      faqs: [
        { q: "What areas do you cover?", a: "We provide comprehensive Pan-India logistics coverage from Mundra Port." },
      ],
      gallery: [],
      videoUrl: "",
      videoPoster: "",
      ctaHeadline: "Move Your Cargo With Confidence",
      seoTitle: "",
      seoDesc: "",
      isPublished: true,
      displayOrder: mainServices.length + 1,
      subServices: [],
    });
    setActiveTab("general");
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startNewSub = (parentSlug) => {
    const pSlug = parentSlug || mainServices[0]?.slug || "road-transportation";
    const parent = mainServices.find((m) => m.slug === pSlug);

    setEditType("sub");
    setFormData({
      id: "",
      slug: "",
      parentSlug: pSlug,
      parentName: parent?.title || "Main Service",
      title: "",
      shortDesc: "",
      heroHeadline: "",
      heroSubheadline: "",
      heroBadge: `${(parent?.title || "ARROWLINE").toUpperCase()} • SPECIALIZED SERVICE`,
      heroImage: "/images/road-transport.jpg",
      heroVideo: "",
      heroFallbackImage: "/images/road-transport.jpg",
      aboutBadge: "SPECIALIZED CAPABILITY",
      aboutHeading: "",
      aboutDescription: "",
      aboutBulletPoints: ["Specialized chassis configuration", "Direct port-to-consignee dispatch"],
      aboutImage: "/images/road-transport.jpg",
      capabilities: [
        { title: "Operational Scope", desc: "Configured for schedule adherence and freight integrity." },
      ],
      whyArrowline: [
        { number: "01", title: "Specialized Equipment", desc: "Engineered for specific cargo geometries." },
        { number: "02", title: "Route Clearances", desc: "Verified highway and terminal transit." },
      ],
      processSteps: [
        { step: "01", title: "Cargo Profile", desc: "Verification of weight and volume metrics." },
        { step: "02", title: "Trailer Placement", desc: "Chassis deployment at loading station." },
      ],
      applications: [
        { title: "Standard Cargo", desc: "High integrity freight haulage.", image: "/images/road-transport.jpg" },
      ],
      industries: ["Manufacturing", "Steel & Metals", "Engineering"],
      faqs: [
        { q: "What is this specialized service?", a: "Dedicated freight solution tailored to specific cargo profiles." },
      ],
      gallery: [],
      videoUrl: "",
      videoPoster: "",
      ctaHeadline: "Move Your Specialized Cargo With Confidence",
      seoTitle: "",
      seoDesc: "",
      isPublished: true,
      displayOrder: (parent?.subServices?.length || 0) + 1,
    });
    setActiveTab("general");
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------------------------------------------
  // Save Changes
  // -------------------------------------------------------------
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      if (editType === "main") {
        const { id, subServices, sub_services_count, service_items, parentName, ...payload } = formData;
        let saved;
        if (id && UUID_PATTERN.test(id)) {
          const res = await adminApi.patch(`/services/${id}`, payload);
          saved = res.data.data;
        } else {
          const res = await adminApi.post("/services", payload);
          saved = res.data.data;
          setFormData((prev) => ({ ...prev, id: saved.id }));
        }
        await loadServices();
        showToast(`Main Service "${saved.title || formData.title}" saved successfully!`);
      } else {
        const { id, parentName, subServices, sub_services_count, service_items, ...payload } = formData;
        let saved;
        if (id && UUID_PATTERN.test(id)) {
          const res = await adminApi.patch(`/service-items/${id}`, payload);
          saved = res.data.data;
        } else {
          const res = await adminApi.post("/service-items", payload);
          saved = res.data.data;
          setFormData((prev) => ({ ...prev, id: saved.id }));
        }
        await loadServices();
        showToast(`Sub-Service "${saved.title || formData.title}" saved successfully!`);
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      showToast(err?.response?.data?.message || err?.message || "Unable to save service changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Delete Service
  // -------------------------------------------------------------
  const handleDeleteMain = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the main service "${title}"?`)) return;

    if (!id || !UUID_PATTERN.test(id)) {
      showToast("This record has not been saved to the database yet. Save it first, then delete.", "error");
      return;
    }

    try {
      await adminApi.delete(`/services/${id}`);
      await loadServices();
      showToast(`Service "${title}" deleted.`);
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || "Failed to delete service.", "error");
    }
  };

  const handleDeleteSub = async (parentSlug, subId, title) => {
    if (!window.confirm(`Delete sub-service "${title}"?`)) return;

    if (!subId || !UUID_PATTERN.test(subId)) {
      showToast("This record has not been saved to the database yet. Save it first, then delete.", "error");
      return;
    }

    try {
      await adminApi.delete(`/service-items/${subId}`);
      await loadServices();
      showToast(`Sub-service "${title}" deleted.`);
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || "Failed to delete sub-service.", "error");
    }
  };

  // -------------------------------------------------------------
  // Media Upload Helper
  // -------------------------------------------------------------
  const handleFileUpload = async (e, targetField) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", editType === "main" ? "services" : "sub-services");
      if (formData.slug) uploadData.append("slug", formData.slug);

      const res = await adminApi.post("/media", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.data?.url) {
        const uploaded = res.data.data;
        const updates = { [targetField]: uploaded.url };
        if (targetField === "heroImage" && uploaded.public_id) {
          updates.imagePublicId = uploaded.public_id;
        }
        setFormData((prev) => ({ ...prev, ...updates }));
        showToast(uploaded.provider === "cloudinary" ? "Media uploaded to Cloudinary!" : "Media uploaded successfully!");
      } else {
        showToast("Upload did not return a media URL.", "error");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      showToast(
        err?.response?.data?.message || "Upload failed. The file was not saved.",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // -------------------------------------------------------------
  // Array Manipulation Helpers
  // -------------------------------------------------------------
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field, defaultItem) => {
    const current = formData[field] || [];
    setFormData((prev) => ({ ...prev, [field]: [...current, defaultItem] }));
  };

  const updateArrayItem = (field, index, subfield, value) => {
    const current = [...(formData[field] || [])];
    if (typeof current[index] === "object") {
      current[index] = { ...current[index], [subfield]: value };
    } else {
      current[index] = value;
    }
    setFormData((prev) => ({ ...prev, [field]: current }));
  };

  const removeArrayItem = (field, index) => {
    const current = [...(formData[field] || [])];
    current.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: current }));
  };

  // -------------------------------------------------------------
  // Import Existing Website Services into the Database
  // -------------------------------------------------------------
  const importWebsiteServices = async () => {
    if (
      !window.confirm(
        `Import ${MAIN_SERVICES.length} main services and their sub-services from the website dataset into the database? Services that already exist (same slug) will be skipped.`
      )
    ) {
      return;
    }
    setIsImporting(true);
    try {
      let created = 0;
      for (const main of MAIN_SERVICES) {
        if (mainServices.some((m) => m.slug === main.slug)) continue;
        const { subServices, sub_services_count, service_items, parentName, ...mainPayload } = main;
        const res = await adminApi.post("/services", mainPayload);
        if (res.data?.data?.id) created += 1;
        for (const sub of subServices || []) {
          const { id, ...subPayload } = sub;
          await adminApi.post("/service-items", { ...subPayload, parentSlug: main.slug });
        }
      }
      await loadServices();
      showToast(created > 0 ? `Imported ${created} main service(s) into the database.` : "Nothing to import — services already exist in the database.");
    } catch (err) {
      console.error("Import services error:", err);
      showToast(`Import failed: ${err?.response?.data?.message || err?.message || "unexpected error"}`, "error");
    } finally {
      setIsImporting(false);
    }
  };

  // =========================================================================
  // RENDER: EDITOR VIEW (12 TABS)
  // =========================================================================
  if (isEditing) {
    const previewUrl =
      editType === "main"
        ? `#/services/${formData.slug}`
        : `#/services/${formData.parentSlug}/${formData.slug}`;

    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        {/* Sticky Sub-Header */}
        <div className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 text-slate-500 hover:text-[#062B3A] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Back to services list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#062B3A] text-white">
                  {editType === "main" ? "MAIN SERVICE" : "SUB-SERVICE"}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    formData.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {formData.isPublished ? "PUBLISHED" : "DRAFT"}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#062B3A] truncate max-w-md mt-0.5">
                {formData.title || "Untitled Service"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#062B3A] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview Live</span>
            </a>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-[#FF6B1A] hover:bg-[#E55A0D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSaving ? <Clock className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (12 Tabs) */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-8 overflow-x-auto scrollbar-none">
          <div className="flex space-x-1 min-w-max py-2">
            {[
              { id: "general", label: "General", icon: Sliders },
              { id: "hero", label: "Hero Media", icon: ImageIcon },
              { id: "about", label: "About Intro", icon: FileText },
              {
                id: "subservices",
                label: editType === "main" ? "Sub-Services" : "Capabilities",
                icon: Layers,
              },
              { id: "media", label: "Gallery & Video", icon: Video },
              { id: "why", label: "Why Arrowline", icon: Shield },
              { id: "process", label: "Process Steps", icon: Clock },
              { id: "applications", label: "Applications", icon: Briefcase },
              { id: "industries", label: "Industries", icon: Globe },
              { id: "faq", label: "FAQ", icon: HelpCircle },
              { id: "seo", label: "SEO / GEO / AEO", icon: Sparkles },
              { id: "publish", label: "Publish", icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#062B3A] text-white shadow-xs"
                      : "text-slate-600 hover:text-[#062B3A] hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {message && (
            <div
              className={`p-4 rounded-2xl mb-6 flex items-center justify-between text-xs font-bold ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : message.type === "error"
                  ? "bg-rose-50 text-rose-800 border border-rose-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}
            >
              <span>{message.text}</span>
              <button onClick={() => setMessage(null)} className="cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. GENERAL TAB */}
            {activeTab === "general" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h3 className="text-lg font-black text-[#062B3A] border-b border-slate-100 pb-3">
                  General Service Configuration
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editType === "sub" && (
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Parent Main Service *
                      </label>
                      <select
                        value={formData.parentSlug || ""}
                        onChange={(e) => {
                          const p = mainServices.find((m) => m.slug === e.target.value);
                          updateField("parentSlug", e.target.value);
                          updateField("parentName", p?.title || "");
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold"
                      >
                        {parentOptions.map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.title} (/services/{p.slug})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Service Name / Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ""}
                      onChange={(e) => updateField("title", e.target.value)}
                      required
                      placeholder="e.g. Container Transportation"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:bg-white focus:border-[#FF6B1A] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      URL Slug *
                    </label>
                    <div className="flex items-center">
                      <span className="bg-slate-200 text-slate-600 px-3 py-3 rounded-l-xl text-xs font-mono">
                        {editType === "main" ? "/services/" : `/services/${formData.parentSlug || "main"}/`}
                      </span>
                      <input
                        type="text"
                        value={formData.slug || ""}
                        onChange={(e) =>
                          updateField(
                            "slug",
                            e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                          )
                        }
                        required
                        placeholder="container-transportation"
                        className="w-full bg-slate-50 border border-slate-200 rounded-r-xl p-3 text-sm font-mono focus:bg-white focus:border-[#FF6B1A] outline-none"
                      />
                    </div>
                  </div>

                  {editType === "main" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Category Badge Label
                      </label>
                      <input
                        type="text"
                        value={formData.category || ""}
                        onChange={(e) => updateField("category", e.target.value)}
                        placeholder="e.g. HIGHWAY & INDUSTRIAL LOGISTICS"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Display Order (Sort)
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder || 1}
                      onChange={(e) => updateField("displayOrder", parseInt(e.target.value, 10))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Short Description (Card summary) *
                    </label>
                    <textarea
                      value={formData.shortDesc || ""}
                      onChange={(e) => updateField("shortDesc", e.target.value)}
                      rows={3}
                      placeholder="Brief overview shown on home service cards and search results..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white focus:border-[#FF6B1A] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. HERO TAB */}
            {activeTab === "hero" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h3 className="text-lg font-black text-[#062B3A] border-b border-slate-100 pb-3">
                  Service Hero Section & Media
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Hero Eyebrow Badge
                    </label>
                    <input
                      type="text"
                      value={formData.heroBadge || ""}
                      onChange={(e) => updateField("heroBadge", e.target.value)}
                      placeholder="e.g. ROAD TRANSPORTATION • PAN-INDIA"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Hero H1 Headline *
                    </label>
                    <input
                      type="text"
                      value={formData.heroHeadline || ""}
                      onChange={(e) => updateField("heroHeadline", e.target.value)}
                      placeholder="e.g. Reliable Road Transportation Services Across India"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Hero Description / Narrative
                    </label>
                    <textarea
                      value={formData.heroDescription || formData.heroSubheadline || ""}
                      onChange={(e) => {
                        updateField("heroDescription", e.target.value);
                        updateField("heroSubheadline", e.target.value);
                      }}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                    {/* Hero Image */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                        <span>Hero Background Image</span>
                        <span className="text-slate-400 text-[10px]">JPG, PNG, WEBP</span>
                      </label>
                      <input
                        type="text"
                        value={formData.heroImage || ""}
                        onChange={(e) => updateField("heroImage", e.target.value)}
                        placeholder="/images/road-transport.jpg or URL"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                      />
                      <label className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#062B3A] text-xs font-bold rounded-xl cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Hero Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "heroImage")}
                          className="hidden"
                        />
                      </label>
                      {formData.heroImage && (
                        <div className="aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
                          <img
                            src={formData.heroImage}
                            alt="Hero Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-1 mt-3">
                        <label className="text-[11px] font-bold text-slate-600">
                          Hero Image Alt Text (SEO / accessibility)
                        </label>
                        <input
                          type="text"
                          value={formData.imageAlt || ""}
                          onChange={(e) => updateField("imageAlt", e.target.value)}
                          placeholder="Arrowline Logistics container transportation service in India"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1 mt-2">
                        <label className="text-[11px] font-bold text-slate-600">
                          Cloudinary Public ID (managed on upload)
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={formData.imagePublicId || ""}
                          placeholder="Set automatically when you upload an image"
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs font-mono text-slate-500"
                        />
                        <p className="text-[10px] text-slate-400">
                          Used to clean up the previous Cloudinary asset when the image is replaced or the service is deleted.
                        </p>
                      </div>
                    </div>

                    {/* Hero Video */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                        <span>Hero Video (Optional)</span>
                        <span className="text-slate-400 text-[10px]">MP4, WebM (Muted/Loop)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.heroVideo || formData.videoUrl || ""}
                        onChange={(e) => {
                          updateField("heroVideo", e.target.value);
                          updateField("videoUrl", e.target.value);
                        }}
                        placeholder="https://.../video.mp4"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                      />
                      <label className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#062B3A] text-xs font-bold rounded-xl cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Video</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          onChange={(e) => handleFileUpload(e, "heroVideo")}
                          className="hidden"
                        />
                      </label>
                      <div className="space-y-1 mt-2">
                        <label className="text-[11px] font-bold text-slate-600">
                          Fallback Image (for video)
                        </label>
                        <input
                          type="text"
                          value={formData.heroFallbackImage || ""}
                          onChange={(e) => updateField("heroFallbackImage", e.target.value)}
                          placeholder="/images/road-transport.jpg"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ABOUT TAB */}
            {activeTab === "about" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h3 className="text-lg font-black text-[#062B3A] border-b border-slate-100 pb-3">
                  About & Introduction Section
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      About Badge Label
                    </label>
                    <input
                      type="text"
                      value={formData.aboutBadge || ""}
                      onChange={(e) => updateField("aboutBadge", e.target.value)}
                      placeholder="e.g. ROAD TRANSPORTATION"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      About Section Heading *
                    </label>
                    <input
                      type="text"
                      value={formData.aboutHeading || ""}
                      onChange={(e) => updateField("aboutHeading", e.target.value)}
                      placeholder="e.g. Connecting Ports, Roads & Businesses."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      About Section Description
                    </label>
                    <textarea
                      value={formData.aboutDescription || ""}
                      onChange={(e) => updateField("aboutDescription", e.target.value)}
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                      <span>Bullet Points Checklist</span>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem(
                            "aboutBulletPoints",
                            "Specialized logistics capability parameter"
                          )
                        }
                        className="text-xs font-bold text-[#FF6B1A] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Point
                      </button>
                    </label>

                    {(formData.aboutBulletPoints || []).map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={pt}
                          onChange={(e) =>
                            updateArrayItem("aboutBulletPoints", idx, "", e.target.value)
                          }
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("aboutBulletPoints", idx)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      About Image Composition
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.aboutImage || ""}
                        onChange={(e) => updateField("aboutImage", e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#062B3A] text-xs font-bold rounded-xl cursor-pointer">
                        <Upload className="w-3.5 h-3.5" /> Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "aboutImage")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SUB-SERVICES / CAPABILITIES TAB */}
            {activeTab === "subservices" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                {editType === "main" ? (
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <div>
                        <h3 className="text-lg font-black text-[#062B3A]">
                          Sub-Services ({formData.subServices?.length || 0})
                        </h3>
                        <p className="text-xs text-slate-500">
                          Dedicated sub-services under {formData.title}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => startNewSub(formData.slug)}
                        className="px-4 py-2 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-[#FF6B1A]" />
                        <span>Add Sub-Service</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(formData.subServices || []).map((sub, idx) => (
                        <div
                          key={sub.id || sub.slug}
                          className="p-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-slate-200 text-[#062B3A] text-xs font-bold flex items-center justify-center">
                              0{idx + 1}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-[#062B3A] truncate">
                                {sub.title}
                              </h4>
                              <p className="text-xs text-slate-500 font-mono">
                                /services/{formData.slug}/{sub.slug}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEditSub(sub, formData.slug)}
                              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold rounded-lg text-[#062B3A] cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteSub(formData.slug, sub.id, sub.title)
                              }
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                      <div>
                        <h3 className="text-lg font-black text-[#062B3A]">
                          Specialized Operational Capabilities
                        </h3>
                        <p className="text-xs text-slate-500">
                          Feature cards shown on this sub-service page
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("capabilities", {
                            title: "Capability Title",
                            desc: "Operational scope details...",
                          })
                        }
                        className="px-4 py-2 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-[#FF6B1A]" />
                        <span>Add Capability</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(formData.capabilities || []).map((cap, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#FF6B1A]">
                              Capability 0{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeArrayItem("capabilities", idx)}
                              className="text-rose-600 hover:bg-rose-50 p-1 rounded cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={cap.title || ""}
                            onChange={(e) =>
                              updateArrayItem("capabilities", idx, "title", e.target.value)
                            }
                            placeholder="Title"
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                          />
                          <textarea
                            value={cap.desc || ""}
                            onChange={(e) =>
                              updateArrayItem("capabilities", idx, "desc", e.target.value)
                            }
                            placeholder="Description"
                            rows={2}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. MEDIA & GALLERY TAB */}
            {activeTab === "media" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-[#062B3A]">
                      Related Image Gallery & Operations Video
                    </h3>
                    <p className="text-xs text-slate-500">
                      Images render with interactive Lightbox on the public service page
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("gallery", {
                        id: `gal-${Date.now()}`,
                        url: "/images/road-transport.jpg",
                        title: "Operations Image",
                        caption: "Cargo handling at Mundra facility",
                      })
                    }
                    className="px-4 py-2 bg-[#FF6B1A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Image to Gallery</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(formData.gallery || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">
                          Image 0{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem("gallery", idx)}
                          className="text-rose-600 hover:bg-rose-50 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.url || ""}
                          onChange={(e) =>
                            updateArrayItem("gallery", idx, "url", e.target.value)
                          }
                          placeholder="Image URL"
                          className="flex-1 bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono"
                        />
                        <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl cursor-pointer flex items-center">
                          <Upload className="w-3 h-3" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const uploadData = new FormData();
                                  uploadData.append("file", file);
                                  uploadData.append("folder", "gallery");
                                  const res = await adminApi.post("/media", uploadData, {
                                    headers: { "Content-Type": "multipart/form-data" },
                                  });
                                  if (res.data?.data?.url) {
                                    updateArrayItem(
                                      "gallery",
                                      idx,
                                      "url",
                                      res.data.data.url
                                    );
                                    showToast("Media uploaded successfully!");
                                  } else {
                                    showToast("Upload did not return a media URL.", "error");
                                  }
                                } catch (err) {
                                  console.error("Upload failed:", err);
                                  showToast(
                                    err?.response?.data?.message || "Upload failed. The file was not saved.",
                                    "error"
                                  );
                                }
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) =>
                          updateArrayItem("gallery", idx, "title", e.target.value)
                        }
                        placeholder="Image Title / Alt"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                      />

                      <input
                        type="text"
                        value={item.caption || ""}
                        onChange={(e) =>
                          updateArrayItem("gallery", idx, "caption", e.target.value)
                        }
                        placeholder="Lightbox Caption"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />

                      {item.url && (
                        <div className="aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                          <img
                            src={item.url}
                            alt={item.title || "preview"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. WHY ARROWLINE TAB */}
            {activeTab === "why" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-[#062B3A]">
                      The Arrowline Edge (Why Choose Arrowline)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cards rendered in the dark navy #071C27 section
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("whyArrowline", {
                        number: `0${(formData.whyArrowline?.length || 0) + 1}`,
                        title: "Advantage Feature",
                        desc: "Verified capability description.",
                      })
                    }
                    className="px-4 py-2 bg-[#062B3A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#FF6B1A]" />
                    <span>Add Advantage</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(formData.whyArrowline || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={item.number || `0${idx + 1}`}
                          onChange={(e) =>
                            updateArrayItem("whyArrowline", idx, "number", e.target.value)
                          }
                          className="w-16 bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-black text-[#FF6B1A]"
                        />
                        <button
                          type="button"
                          onClick={() => removeArrayItem("whyArrowline", idx)}
                          className="text-rose-600 hover:bg-rose-50 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.title || ""}
                        onChange={(e) =>
                          updateArrayItem("whyArrowline", idx, "title", e.target.value)
                        }
                        placeholder="Title"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                      />
                      <textarea
                        value={item.desc || ""}
                        onChange={(e) =>
                          updateArrayItem("whyArrowline", idx, "desc", e.target.value)
                        }
                        placeholder="Description"
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. PROCESS TAB */}
            {activeTab === "process" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-[#062B3A]">
                      How We Work / Operational Workflow
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standardized step-by-step process with animated connector line
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("processSteps", {
                        step: `0${(formData.processSteps?.length || 0) + 1}`,
                        title: "Workflow Milestone",
                        desc: "Operational execution parameter.",
                      })
                    }
                    className="px-4 py-2 bg-[#062B3A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#FF6B1A]" />
                    <span>Add Step</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(formData.processSteps || []).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#FF6B1A]">
                          Step {step.step || `0${idx + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem("processSteps", idx)}
                          className="text-rose-600 hover:bg-rose-50 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={step.title || ""}
                        onChange={(e) =>
                          updateArrayItem("processSteps", idx, "title", e.target.value)
                        }
                        placeholder="Step Title"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                      />
                      <textarea
                        value={step.desc || ""}
                        onChange={(e) =>
                          updateArrayItem("processSteps", idx, "desc", e.target.value)
                        }
                        placeholder="Milestone Description"
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. APPLICATIONS TAB */}
            {activeTab === "applications" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-[#062B3A]">
                      Cargo & Applications
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cargo profile image cards relevant to this service
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("applications", {
                        title: "Cargo Profile",
                        desc: "Handling and transit details...",
                        image: "/images/road-transport.jpg",
                      })
                    }
                    className="px-4 py-2 bg-[#062B3A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#FF6B1A]" />
                    <span>Add Cargo Profile</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(formData.applications || []).map((app, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">
                          Profile 0{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem("applications", idx)}
                          className="text-rose-600 hover:bg-rose-50 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={app.title || ""}
                        onChange={(e) =>
                          updateArrayItem("applications", idx, "title", e.target.value)
                        }
                        placeholder="Cargo Title"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                      />

                      <textarea
                        value={app.desc || ""}
                        onChange={(e) =>
                          updateArrayItem("applications", idx, "desc", e.target.value)
                        }
                        placeholder="Cargo Handling Description"
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs"
                      />

                      <input
                        type="text"
                        value={app.image || ""}
                        onChange={(e) =>
                          updateArrayItem("applications", idx, "image", e.target.value)
                        }
                        placeholder="Image URL"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. INDUSTRIES TAB */}
            {activeTab === "industries" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h3 className="text-lg font-black text-[#062B3A] border-b border-slate-100 pb-3">
                  Target Industries
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(formData.industries || []).map((ind, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EAF3F6] border border-[#062B3A]/20 rounded-xl text-xs font-bold text-[#062B3A]"
                      >
                        <span>{ind}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem("industries", idx)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 max-w-md pt-2">
                    <input
                      type="text"
                      id="new-industry-input"
                      placeholder="Add an industry (e.g. Chemicals, Steel)..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (val) {
                            addArrayItem("industries", val);
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("new-industry-input");
                        if (input && input.value.trim()) {
                          addArrayItem("industries", input.value.trim());
                          input.value = "";
                        }
                      }}
                      className="px-4 py-2 bg-[#062B3A] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 10. FAQ TAB */}
            {activeTab === "faq" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-[#062B3A]">
                      Frequently Asked Questions ({formData.faqs?.length || 0})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Direct, authoritative answers formatted for Google FAQPage Schema & AEO
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("faqs", {
                        q: "Question regarding Arrowline operations?",
                        a: "Direct operational answer providing route, timing, and compliance parameters.",
                      })
                    }
                    className="px-4 py-2 bg-[#FF6B1A] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(formData.faqs || []).map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAFC] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#FF6B1A]">
                          FAQ 0{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem("faqs", idx)}
                          className="text-rose-600 hover:bg-rose-50 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.q || ""}
                          onChange={(e) =>
                            updateArrayItem("faqs", idx, "q", e.target.value)
                          }
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-[#062B3A]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Answer (Direct & Authoritative)
                        </label>
                        <textarea
                          value={faq.a || ""}
                          onChange={(e) =>
                            updateArrayItem("faqs", idx, "a", e.target.value)
                          }
                          rows={3}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. SEO / GEO / AEO TAB */}
            {activeTab === "seo" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h3 className="text-lg font-black text-[#062B3A] border-b border-slate-100 pb-3">
                  Search Engine Optimization (SEO, GEO & AEO)
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Meta Title (Browser Title Tag)
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle || ""}
                      onChange={(e) => updateField("seoTitle", e.target.value)}
                      placeholder="e.g. Container Transportation Services India | Mundra Port Logistics | Arrowline"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold"
                    />
                    <p className="text-[11px] text-slate-400">
                      Length: {formData.seoTitle?.length || 0} / 60 characters recommended
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.seoDesc || ""}
                      onChange={(e) => updateField("seoDesc", e.target.value)}
                      rows={3}
                      placeholder="High conversion description with natural Pan-India and Mundra port geographical context..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
                    />
                    <p className="text-[11px] text-slate-400">
                      Length: {formData.seoDesc?.length || 0} / 160 characters recommended
                    </p>
                  </div>

                  {/* Google Snippet Live Preview */}
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 mt-4 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                      Google Search Live Preview
                    </span>
                    <p className="text-xs text-emerald-700 font-mono">
                      https://www.arrowlinelogistics.in › services › {formData.slug || "service"}
                    </p>
                    <h4 className="text-sm font-medium text-[#1a0dab] hover:underline cursor-pointer">
                      {formData.seoTitle || `${formData.title} | Arrowline Logistics`}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {formData.seoDesc || formData.shortDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 12. PUBLISH TAB */}
            {activeTab === "publish" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h3 className="text-lg font-black text-[#062B3A] border-b border-slate-100 pb-3">
                  Publishing Status & Validation
                </h3>

                <div className="space-y-4 max-w-lg">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="block text-sm font-bold text-[#062B3A]">
                        Live Publication
                      </span>
                      <span className="block text-xs text-slate-500">
                        {formData.isPublished
                          ? "This service is active and visible to all public visitors."
                          : "Draft status — hidden from public navigation and search engines."}
                      </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPublished || false}
                        onChange={(e) => updateField("isPublished", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B1A]" />
                    </label>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3 bg-[#FF6B1A] hover:bg-[#E55A0D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {isSaving ? (
                        <Clock className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>Publish & Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: LIST VIEW (MAIN SERVICES & SUB-SERVICES HIERARCHY)
  // =========================================================================
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF3F6] border border-[#062B3A]/15 rounded-full text-[10px] font-black text-[#062B3A] tracking-wider uppercase mb-2">
            <Layers className="w-3.5 h-3.5 text-[#FF6B1A]" />
            <span>CENTRAL SERVICES CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#062B3A] tracking-tight">
            Services Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage the 4 core logistics verticals and 22 specialized sub-services (26 pages total).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={startNewMain}
            className="px-4 py-2.5 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FF6B1A]" />
            <span>New Main Service</span>
          </button>

          <button
            type="button"
            onClick={() => startNewSub()}
            className="px-4 py-2.5 bg-[#FF6B1A] hover:bg-[#E55A0D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Sub-Service</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:bg-white focus:border-[#FF6B1A] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#062B3A]"
          >
            <option value="all">All Services</option>
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
          </select>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Services Hierarchy Accordion / Tree */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-[#FF6B1A] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold uppercase tracking-wider">Loading Services Architecture...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loadError && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="text-xs font-bold text-rose-800">
                Database connection error: {loadError}
              </div>
              <button
                type="button"
                onClick={loadServices}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}

          {!loadError && mainServices.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4 shadow-xs">
              <Database className="w-10 h-10 text-slate-300 mx-auto" />
              <div>
                <h3 className="text-lg font-black text-[#062B3A]">
                  No services in the database yet
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  The services published on the website live in {MAIN_SERVICES.length} main service records.
                  Import them into the database to start editing, or create a new one.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={importWebsiteServices}
                  disabled={isImporting}
                  className="px-5 py-2.5 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isImporting ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4 text-[#FF6B1A]" />
                  )}
                  {isImporting ? "Importing..." : `Import Website Services (${MAIN_SERVICES.length})`}
                </button>
                <button
                  type="button"
                  onClick={startNewMain}
                  className="px-5 py-2.5 bg-[#FF6B1A] hover:bg-[#E55A0D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Manually
                </button>
              </div>
            </div>
          )}

          {filteredServices.map((main, index) => {
            const isExpanded = expandedMainId === main.id || expandedMainId === main.slug;
            return (
              <div
                key={main.id || main.slug}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs transition-all"
              >
                {/* Main Service Card Row */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-white">
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      onClick={() =>
                        setExpandedMainId(isExpanded ? null : main.id || main.slug)
                      }
                      className="p-1.5 text-slate-400 hover:text-[#062B3A] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title={isExpanded ? "Collapse sub-services" : "Expand sub-services"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-[#FF6B1A]" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>

                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img
                        src={main.heroImage || main.aboutImage || "/images/road-transport.jpg"}
                        alt={main.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#EAF3F6] text-[#062B3A]">
                          0{index + 1} • MAIN SERVICE
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            main.isPublished
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {main.isPublished ? "PUBLISHED" : "DRAFT"}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-[#062B3A] truncate mt-1">
                        {main.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono truncate">
                        /services/{main.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {main.subServices?.length || 0} Sub-Services
                    </span>

                    <a
                      href={`#/services/${main.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-slate-500 hover:text-[#062B3A] hover:bg-slate-100 rounded-xl transition-colors"
                      title="Preview public page"
                    >
                      <Eye className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => startEditMain(main)}
                      className="px-3.5 py-1.5 bg-[#062B3A] hover:bg-[#03212D] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMain(main.id, main.title)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-Services Child Rows (when expanded) */}
                {isExpanded && (
                  <div className="bg-[#F8FAFC] p-4 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                      <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                        Child Sub-Services under {main.title}
                      </span>
                      <button
                        onClick={() => startNewSub(main.slug)}
                        className="text-xs font-bold text-[#FF6B1A] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Sub-Service</span>
                      </button>
                    </div>

                    {(!main.subServices || main.subServices.length === 0) ? (
                      <p className="text-xs text-slate-400 py-3 italic">
                        No sub-services configured for this vertical yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {main.subServices.map((sub, sIdx) => (
                          <div
                            key={sub.id || sub.slug}
                            className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4 hover:border-[#FF6B1A]/40 transition-all shadow-xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-[11px] font-mono text-slate-400 font-bold">
                                {index + 1}.{sIdx + 1}
                              </span>
                              <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                <img
                                  src={sub.heroImage || sub.aboutImage || "/images/road-transport.jpg"}
                                  alt={sub.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-[#062B3A] truncate">
                                  {sub.title}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-mono truncate block">
                                  /services/{main.slug}/{sub.slug}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <a
                                href={`#/services/${main.slug}/${sub.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-slate-400 hover:text-[#062B3A] rounded-lg"
                                title="Preview sub-service"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => startEditSub(sub, main.slug)}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#062B3A] text-xs font-bold rounded-lg cursor-pointer transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteSub(main.slug, sub.id, sub.title)
                                }
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                                title="Delete sub-service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
