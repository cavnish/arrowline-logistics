import { useCallback, useEffect, useMemo, useState } from "react";
import adminApi from "../services/adminApi";
import { getOptimizedImageUrl } from "../utils/imageUrl";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";

const ALLOWED_ICONS = [
  "Eye", "Target", "Award", "TrendingUp", "Handshake", "Shield", "Lightbulb",
  "Users", "Leaf", "ClipboardCheck", "Cpu", "Package", "Medal", "Globe",
  "Activity", "Workflow", "Rocketchat", "Truck", "Warehouse", "Star", "HeartHandshake",
];

const SLOT_LABELS = { hero: "Hero", milestones: "Milestones", differentiators: "Differentiators", "core-values": "Core Values" };
const SLOT_DEFAULTS = { hero: "Hero image", milestones: "Milestones image", differentiators: "Differentiators image", "core-values": "Core Values image" };

const IMAGE_SLOTS = ["hero", "milestones", "differentiators", "core-values"];

const CONTENT_KEYS = {
  Hero: [
    "about_hero_badge_label", "about_hero_badge_place", "about_hero_eyebrow",
    "about_hero_title", "about_hero_p1", "about_hero_p2_pre", "about_fleet_count",
    "about_hero_p2_post", "about_hero_p3",
  ],
  Philosophy: [
    "about_philosophy_heading", "about_philosophy_p1", "about_bhag_p2_pre",
    "about_bhag_amount", "about_bhag_p2_post", "about_bhag_year", "about_bhag_p2_tail",
  ],
  Milestones: [
    "about_milestones_eyebrow", "about_milestones_heading_1", "about_milestones_heading_2",
    "about_milestones_caption",
  ],
  Differentiators: [
    "about_differentiators_eyebrow", "about_differentiators_heading_1",
    "about_differentiators_heading_2", "about_differentiators_subtext",
  ],
  "Core Values": ["about_corevalues_heading", "about_corevalues_subtext"],
  Leadership: ["about_leaders_eyebrow", "about_leaders_heading", "about_leaders_subtext"],
  CTA: ["about_cta_heading", "about_cta_body", "about_cta_btn1_label", "about_cta_btn2_label"],
};

const TEXT_SECTIONS = Object.keys(CONTENT_KEYS);

const emptyPillar = { icon: "Target", title: "", text: "", color: "emerald", is_published: true, display_order: 0 };
const emptyMilestone = { year: "", title: "", text: "", is_published: true, display_order: 0 };
const emptyDifferentiator = { icon: "Target", title: "", text: "", accent: "orange", is_published: true, display_order: 0 };

const COLOR_OPTIONS = [
  { value: "emerald", label: "Emerald" },
  { value: "orange", label: "Orange" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
];

const ACCENT_OPTIONS = [
  { value: "orange", label: "Orange" },
  { value: "emerald", label: "Emerald" },
  { value: "blue", label: "Blue" },
];

function labelizeKey(key) {
  const raw = key.replace(/^about_/, "").replace(/_/g, " ");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function initialsOf(name) {
  return String(name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function AdminAbout() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [imageSlots, setImageSlots] = useState({});
  const [contentMap, setContentMap] = useState({});
  const [contentEdits, setContentEdits] = useState({});
  const [savingKey, setSavingKey] = useState(null);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [activeTab, setActiveTab] = useState("images");

  const [pillars, setPillars] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [differentiators, setDifferentiators] = useState([]);

  const [showPillarModal, setShowPillarModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const [pillarForm, setPillarForm] = useState(emptyPillar);
  const [milestoneForm, setMilestoneForm] = useState(emptyMilestone);
  const [diffForm, setDiffForm] = useState(emptyDifferentiator);

  const [editingPillarId, setEditingPillarId] = useState(null);
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [editingDiffId, setEditingDiffId] = useState(null);

  const [savingPillar, setSavingPillar] = useState(false);
  const [savingMilestone, setSavingMilestone] = useState(false);
  const [savingDiff, setSavingDiff] = useState(false);

  const [movingPillarId, setMovingPillarId] = useState(null);
  const [movingMilestoneId, setMovingMilestoneId] = useState(null);
  const [movingDiffId, setMovingDiffId] = useState(null);

  const showToast = useCallback((type, text) => {
    setToast({ type, text });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [contentRes, imagesRes, pillarsRes, milestonesRes, diffsRes] = await Promise.all([
        adminApi.get("/content"),
        adminApi.get("/about-images"),
        adminApi.get("/about-pillars"),
        adminApi.get("/about-milestones"),
        adminApi.get("/about-differentiators"),
      ]);

      const allContent = contentRes.data.data || [];
      const aboutContent = allContent.filter((c) => c.section === "About");
      const map = {};
      aboutContent.forEach((c) => { map[c.content_key] = c; });
      setContentMap(map);

      const edits = {};
      aboutContent.forEach((c) => { edits[c.content_key] = c.content_value || ""; });
      setContentEdits(edits);

      const images = imagesRes.data.data || [];
      const slotMap = {};
      IMAGE_SLOTS.forEach((s) => { slotMap[s] = null; });
      images.forEach((img) => { if (slotMap.hasOwnProperty(img.slot)) slotMap[img.slot] = img; });
      setImageSlots(slotMap);

      setPillars(pillarsRes.data.data || []);
      setMilestones(milestonesRes.data.data || []);
      setDifferentiators(diffsRes.data.data || []);
    } catch (error) {
      console.error("Loading about data:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to load about data. Check the backend is running and you are signed in.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleContentChange = (key, value) => {
    setContentEdits((prev) => ({ ...prev, [key]: value }));
  };

  const saveContentKey = async (key) => {
    setSavingKey(key);
    try {
      await adminApi.put(`/content/${key}`, {
        content_value: contentEdits[key] || "",
        section: "About",
        content_type: "text",
        is_published: true,
      });
      showToast("success", `"${labelizeKey(key)}" saved.`);
    } catch (error) {
      console.error("Saving content key:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || `Unable to save "${labelizeKey(key)}".`);
    } finally {
      setSavingKey(null);
    }
  };

  const handleSlotImageUpload = async (slot, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"].includes(file.type)) {
      showToast("error", "Please choose a JPEG, PNG, WEBP, GIF, AVIF or SVG image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("error", "File is too large (max 10 MB).");
      return;
    }
    setUploadingSlot(slot);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "about");
      const uploadRes = await adminApi.post("/media", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploaded = uploadRes.data.data;
      const current = imageSlots[slot];
      const payload = {
        slot,
        image_url: uploaded.url,
        image_public_id: uploaded.public_id,
        title: current?.title || SLOT_DEFAULTS[slot] || slot,
        alt_text: current?.alt_text || SLOT_LABELS[slot] || slot,
        is_published: current?.is_published !== undefined ? current.is_published : true,
        display_order: current?.display_order || IMAGE_SLOTS.indexOf(slot) + 1,
      };
      if (current?.id) {
        await adminApi.patch(`/about-images/${current.id}`, payload);
      } else {
        await adminApi.post("/about-images", payload);
      }
      await loadAll();
      showToast("success", `${SLOT_LABELS[slot] || slot} image updated.`);
    } catch (error) {
      console.error("Uploading image:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to upload image.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const removeSlotImage = async (slot) => {
    if (!window.confirm(`Remove the ${SLOT_LABELS[slot] || slot} image?`)) return;
    const current = imageSlots[slot];
    if (!current?.id) return;
    setUploadingSlot(slot);
    try {
      await adminApi.patch(`/about-images/${current.id}`, {
        image_url: null,
        image_public_id: null,
      });
      await loadAll();
      showToast("success", `${SLOT_LABELS[slot] || slot} image removed.`);
    } catch (error) {
      console.error("Removing image:", error?.response?.data || error);
      showToast("error", error?.response?.data?.message || "Unable to remove image.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const toggleSlotPublish = async (slot) => {
    const current = imageSlots[slot];
    if (!current?.id) return;
    try {
      await adminApi.patch(`/about-images/${current.id}`, {
        is_published: !current.is_published,
      });
      await loadAll();
      showToast("success", `${SLOT_LABELS[slot] || slot} ${current.is_published ? "hidden" : "shown"}.`);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to update.");
    }
  };

  const saveSlotMeta = async (slot) => {
    const current = imageSlots[slot];
    if (!current?.id) return;
    try {
      await adminApi.patch(`/about-images/${current.id}`, {
        title: current.title,
        alt_text: current.alt_text,
      });
      await loadAll();
      showToast("success", `${SLOT_LABELS[slot] || slot} details updated.`);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to update details.");
    }
  };

  const updateSlotMeta = (slot, field, value) => {
    setImageSlots((prev) => ({
      ...prev,
      [slot]: prev[slot] ? { ...prev[slot], [field]: value } : { slot, [field]: value, id: null },
    }));
  };

  const sortedPillars = useMemo(() => [...pillars].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)), [pillars]);
  const sortedMilestones = useMemo(() => [...milestones].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)), [milestones]);
  const sortedDiffs = useMemo(() => [...differentiators].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)), [differentiators]);

  const pillarIndexOf = useCallback((id) => sortedPillars.findIndex((p) => p.id === id), [sortedPillars]);
  const milestoneIndexOf = useCallback((id) => sortedMilestones.findIndex((m) => m.id === id), [sortedMilestones]);
  const diffIndexOf = useCallback((id) => sortedDiffs.findIndex((d) => d.id === id), [sortedDiffs]);

  const reorderPillar = async (item, direction) => {
    const at = pillarIndexOf(item.id);
    const to = direction === "up" ? at - 1 : at + 1;
    if (at < 0 || to < 0 || to >= sortedPillars.length) return;
    const next = [...sortedPillars];
    [next[at], next[to]] = [next[to], next[at]];
    const updates = next.map((e, i) => ({ id: e.id, display_order: i + 1 }));
    setMovingPillarId(item.id);
    try {
      await Promise.all(updates.map((u) => adminApi.patch(`/about-pillars/${u.id}`, { display_order: u.display_order })));
      await loadAll();
      showToast("success", "Pillar order updated.");
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to reorder.");
    } finally {
      setMovingPillarId(null);
    }
  };

  const reorderMilestone = async (item, direction) => {
    const at = milestoneIndexOf(item.id);
    const to = direction === "up" ? at - 1 : at + 1;
    if (at < 0 || to < 0 || to >= sortedMilestones.length) return;
    const next = [...sortedMilestones];
    [next[at], next[to]] = [next[to], next[at]];
    const updates = next.map((e, i) => ({ id: e.id, display_order: i + 1 }));
    setMovingMilestoneId(item.id);
    try {
      await Promise.all(updates.map((u) => adminApi.patch(`/about-milestones/${u.id}`, { display_order: u.display_order })));
      await loadAll();
      showToast("success", "Milestone order updated.");
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to reorder.");
    } finally {
      setMovingMilestoneId(null);
    }
  };

  const reorderDiff = async (item, direction) => {
    const at = diffIndexOf(item.id);
    const to = direction === "up" ? at - 1 : at + 1;
    if (at < 0 || to < 0 || to >= sortedDiffs.length) return;
    const next = [...sortedDiffs];
    [next[at], next[to]] = [next[to], next[at]];
    const updates = next.map((e, i) => ({ id: e.id, display_order: i + 1 }));
    setMovingDiffId(item.id);
    try {
      await Promise.all(updates.map((u) => adminApi.patch(`/about-differentiators/${u.id}`, { display_order: u.display_order })));
      await loadAll();
      showToast("success", "Differentiator order updated.");
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to reorder.");
    } finally {
      setMovingDiffId(null);
    }
  };

  const handlePillarChange = (event) => {
    const { name, value, type, checked } = event.target;
    setPillarForm((c) => ({ ...c, [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value }));
  };

  const handleMilestoneChange = (event) => {
    const { name, value, type, checked } = event.target;
    setMilestoneForm((c) => ({ ...c, [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value }));
  };

  const handleDiffChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDiffForm((c) => ({ ...c, [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value }));
  };

  const savePillar = async (event) => {
    event.preventDefault();
    if (!pillarForm.title.trim()) { showToast("error", "Title is required."); return; }
    const payload = {
      icon: pillarForm.icon,
      title: pillarForm.title.trim(),
      text: pillarForm.text.trim(),
      color: pillarForm.color,
      is_published: pillarForm.is_published,
      display_order: Number(pillarForm.display_order) || 0,
    };
    setSavingPillar(true);
    try {
      if (editingPillarId) {
        await adminApi.patch(`/about-pillars/${editingPillarId}`, payload);
        showToast("success", "Pillar updated.");
      } else {
        await adminApi.post("/about-pillars", payload);
        showToast("success", "Pillar added.");
      }
      await loadAll();
      setShowPillarModal(false);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to save pillar.");
    } finally {
      setSavingPillar(false);
    }
  };

  const saveMilestone = async (event) => {
    event.preventDefault();
    if (!milestoneForm.year.trim()) { showToast("error", "Year is required."); return; }
    if (!milestoneForm.title.trim()) { showToast("error", "Title is required."); return; }
    const payload = {
      year: milestoneForm.year.trim(),
      title: milestoneForm.title.trim(),
      text: milestoneForm.text.trim(),
      is_published: milestoneForm.is_published,
      display_order: Number(milestoneForm.display_order) || 0,
    };
    setSavingMilestone(true);
    try {
      if (editingMilestoneId) {
        await adminApi.patch(`/about-milestones/${editingMilestoneId}`, payload);
        showToast("success", "Milestone updated.");
      } else {
        await adminApi.post("/about-milestones", payload);
        showToast("success", "Milestone added.");
      }
      await loadAll();
      setShowMilestoneModal(false);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to save milestone.");
    } finally {
      setSavingMilestone(false);
    }
  };

  const saveDiff = async (event) => {
    event.preventDefault();
    if (!diffForm.title.trim()) { showToast("error", "Title is required."); return; }
    const payload = {
      icon: diffForm.icon,
      title: diffForm.title.trim(),
      text: diffForm.text.trim(),
      accent: diffForm.accent,
      is_published: diffForm.is_published,
      display_order: Number(diffForm.display_order) || 0,
    };
    setSavingDiff(true);
    try {
      if (editingDiffId) {
        await adminApi.patch(`/about-differentiators/${editingDiffId}`, payload);
        showToast("success", "Differentiator updated.");
      } else {
        await adminApi.post("/about-differentiators", payload);
        showToast("success", "Differentiator added.");
      }
      await loadAll();
      setShowDiffModal(false);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to save differentiator.");
    } finally {
      setSavingDiff(false);
    }
  };

  const deletePillar = async (item) => {
    if (!window.confirm(`Delete pillar "${item.title}"?`)) return;
    try {
      await adminApi.delete(`/about-pillars/${item.id}`);
      await loadAll();
      showToast("success", `Deleted "${item.title}".`);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to delete pillar.");
    }
  };

  const deleteMilestone = async (item) => {
    if (!window.confirm(`Delete milestone "${item.title}"?`)) return;
    try {
      await adminApi.delete(`/about-milestones/${item.id}`);
      await loadAll();
      showToast("success", `Deleted "${item.title}".`);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to delete milestone.");
    }
  };

  const deleteDiff = async (item) => {
    if (!window.confirm(`Delete differentiator "${item.title}"?`)) return;
    try {
      await adminApi.delete(`/about-differentiators/${item.id}`);
      await loadAll();
      showToast("success", `Deleted "${item.title}".`);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Unable to delete differentiator.");
    }
  };

  const openCreatePillar = () => { setPillarForm(emptyPillar); setEditingPillarId(null); setShowPillarModal(true); };
  const openEditPillar = (item) => {
    setPillarForm({ icon: item.icon || "Target", title: item.title || "", text: item.text || "", color: item.color || "emerald", is_published: item.is_published !== undefined ? item.is_published : true, display_order: item.display_order ?? 0 });
    setEditingPillarId(item.id);
    setShowPillarModal(true);
  };

  const openCreateMilestone = () => { setMilestoneForm(emptyMilestone); setEditingMilestoneId(null); setShowMilestoneModal(true); };
  const openEditMilestone = (item) => {
    setMilestoneForm({ year: item.year || "", title: item.title || "", text: item.text || "", is_published: item.is_published !== undefined ? item.is_published : true, display_order: item.display_order ?? 0 });
    setEditingMilestoneId(item.id);
    setShowMilestoneModal(true);
  };

  const openCreateDiff = () => { setDiffForm(emptyDifferentiator); setEditingDiffId(null); setShowDiffModal(true); };
  const openEditDiff = (item) => {
    setDiffForm({ icon: item.icon || "Target", title: item.title || "", text: item.text || "", accent: item.accent || "orange", is_published: item.is_published !== undefined ? item.is_published : true, display_order: item.display_order ?? 0 });
    setEditingDiffId(item.id);
    setShowDiffModal(true);
  };

  const TABS = [
    { id: "images", label: "Images", icon: ImageIcon },
    { id: "text", label: "Page Text", icon: FileText },
    { id: "pillars", label: "Pillars", icon: LayoutTemplate },
    { id: "milestones", label: "Milestones", icon: Clock },
    { id: "diffs", label: "Differentiators", icon: Award },
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-80 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-xl border border-slate-200 bg-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E3A8A] text-white">
            <FileText size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">About Page</h1>
            <p className="text-sm text-slate-500">Manage all content shown on the public About page — images, text, pillars, milestones, and differentiators.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={loadAll}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-[#1E3A8A] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "images" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {IMAGE_SLOTS.map((slot) => {
              const current = imageSlots[slot];
              const isUploading = uploadingSlot === slot;
              return (
                <div key={slot} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                        {SLOT_LABELS[slot] || slot}
                      </span>
                      {current?.is_published ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 size={10} /> Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          <Clock size={10} /> Hidden
                        </span>
                      )}
                    </div>
                    {current?.id && (
                      <button
                        type="button"
                        onClick={() => toggleSlotPublish(slot)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          current.is_published
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {current.is_published ? "Hide" : "Show"}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {current?.image_url ? (
                      <img
                        src={getOptimizedImageUrl(current.image_url, { width: 240 })}
                        alt={current.alt_text || SLOT_LABELS[slot]}
                        className="h-24 w-24 rounded-lg bg-slate-50 object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                        <ImageIcon size={28} />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <label className="block">
                        <span className="text-xs font-semibold text-slate-600">Title</span>
                        <input
                          value={current?.title || ""}
                          onChange={(e) => updateSlotMeta(slot, "title", e.target.value)}
                          className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                          placeholder="Image title"
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-semibold text-slate-600">Alt text</span>
                        <input
                          value={current?.alt_text || ""}
                          onChange={(e) => updateSlotMeta(slot, "alt_text", e.target.value)}
                          className="mt-0.5 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                          placeholder="SEO alt text"
                        />
                      </label>
                    </div>
                  </div>

                  {current?.id && current?.image_public_id && (
                    <p className="text-[11px] text-slate-400">Public ID: <span className="font-mono">{current.image_public_id}</span></p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                      {isUploading ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Uploading…
                        </>
                      ) : (
                        <>
                          <Upload size={13} />
                          {current?.image_url ? "Replace" : "Upload"}
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => handleSlotImageUpload(slot, e)}
                      />
                    </label>
                    {current?.image_url && (
                      <button
                        type="button"
                        onClick={() => removeSlotImage(slot)}
                        disabled={isUploading}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    )}
                    {current?.id && (
                      <button
                        type="button"
                        onClick={() => saveSlotMeta(slot)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E3A8A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#163a72] transition"
                      >
                        Save details
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "text" && (
        <div className="space-y-6">
          {TEXT_SECTIONS.map((section) => {
            const keys = CONTENT_KEYS[section];
            return (
              <div key={section} className="rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-5 py-3">
                  <h3 className="text-sm font-bold text-slate-800">{section}</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {keys.map((key) => {
                    const currentVal = contentEdits[key] ?? "";
                    const isLong = currentVal.length > 80 || (contentMap[key]?.content_value || "").includes("\n");
                    const isSaving = savingKey === key;
                    const isMultiLine = key.includes("_p1") || key.includes("_p2") || key.includes("_p3") || key.includes("_body") || key.includes("_tail") || key.includes("_subtext");
                    return (
                      <div key={key} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-start sm:gap-4">
                        <div className="sm:w-56 shrink-0">
                          <p className="text-sm font-semibold text-slate-700">{labelizeKey(key)}</p>
                          <p className="mt-0.5 font-mono text-[11px] text-slate-400">{key}</p>
                        </div>
                        <div className="flex-1 space-y-1">
                          {(isMultiLine || isLong) ? (
                            <textarea
                              value={currentVal}
                              onChange={(e) => handleContentChange(key, e.target.value)}
                              rows={3}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                            />
                          ) : (
                            <input
                              value={currentVal}
                              onChange={(e) => handleContentChange(key, e.target.value)}
                              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20"
                            />
                          )}
                          <p className="text-[11px] text-slate-400">Use **bold** for highlighted phrases.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => saveContentKey(key)}
                          disabled={isSaving || currentVal === (contentMap[key]?.content_value || "")}
                          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#1E3A8A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#163a72] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                          {isSaving ? "Saving…" : "Save"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "pillars" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Core Pillars</h3>
            <button
              type="button"
              onClick={openCreatePillar}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition"
            >
              <Plus size={16} />
              Add Pillar
            </button>
          </div>

          {!loading && sortedPillars.length > 0 && (
            <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white lg:block">
              <table className="min-w-[700px] divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Icon</th>
                    <th className="px-4 py-3.5">Title</th>
                    <th className="px-4 py-3.5">Text</th>
                    <th className="px-4 py-3.5">Color</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Order</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedPillars.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3 font-mono text-sm text-slate-600">{item.icon}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.title}</td>
                      <td className="px-4 py-3 max-w-xs"><p className="truncate text-slate-600" title={item.text}>{item.text || "—"}</p></td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.color === "emerald" ? "bg-emerald-50 text-emerald-700" :
                        item.color === "orange" ? "bg-orange-50 text-orange-700" :
                        item.color === "blue" ? "bg-blue-50 text-blue-700" :
                        "bg-purple-50 text-purple-700"
                      }`}>{item.color}</span></td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {item.is_published ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5">
                          <button type="button" onClick={() => reorderPillar(item, "up")} disabled={pillarIndexOf(item.id) <= 0 || movingPillarId === item.id} className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30" title="Move up">
                            <ArrowUp size={14} />
                          </button>
                          <span className="w-6 text-center text-slate-600">{item.display_order ?? 0}</span>
                          <button type="button" onClick={() => reorderPillar(item, "down")} disabled={pillarIndexOf(item.id) >= sortedPillars.length - 1 || movingPillarId === item.id} className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30" title="Move down">
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => openEditPillar(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] hover:bg-slate-50 transition">
                            <Pencil size={13} /> Edit
                          </button>
                          <button type="button" onClick={() => deletePillar(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition">
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && sortedPillars.length > 0 && (
            <div className="space-y-3 lg:hidden">
              {sortedPillars.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-slate-500">{item.icon}</span>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          item.color === "emerald" ? "bg-emerald-50 text-emerald-700" :
                          item.color === "orange" ? "bg-orange-50 text-orange-700" :
                          item.color === "blue" ? "bg-blue-50 text-blue-700" :
                          "bg-purple-50 text-purple-700"
                        }`}>{item.color}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button type="button" onClick={() => reorderPillar(item, "up")} disabled={pillarIndexOf(item.id) <= 0 || movingPillarId === item.id} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-[#1E3A8A] disabled:opacity-30" title="Up"><ArrowUp size={13} /></button>
                      <span className="text-xs text-slate-500">{item.display_order ?? 0}</span>
                      <button type="button" onClick={() => reorderPillar(item, "down")} disabled={pillarIndexOf(item.id) >= sortedPillars.length - 1 || movingPillarId === item.id} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-[#1E3A8A] disabled:opacity-30" title="Down"><ArrowDown size={13} /></button>
                    </div>
                  </div>
                  {item.text && <p className="text-sm text-slate-600 line-clamp-2">{item.text}</p>}
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => openEditPillar(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#1E3A8A]">
                      <Pencil size={14} /> Edit
                    </button>
                    <button type="button" onClick={() => deletePillar(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-red-600">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && sortedPillars.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <LayoutTemplate size={26} />
              </div>
              <p className="font-semibold text-slate-700">No pillars yet.</p>
              <p className="text-sm text-slate-500">Add core pillars that define the company's philosophy.</p>
              <button type="button" onClick={openCreatePillar} className="mx-auto inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition">
                <Plus size={16} /> Add Pillar
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "milestones" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Milestones</h3>
            <button
              type="button"
              onClick={openCreateMilestone}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition"
            >
              <Plus size={16} />
              Add Milestone
            </button>
          </div>

          {!loading && sortedMilestones.length > 0 && (
            <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white lg:block">
              <table className="min-w-[600px] divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Year</th>
                    <th className="px-4 py-3.5">Title</th>
                    <th className="px-4 py-3.5">Text</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Order</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedMilestones.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3 font-semibold text-slate-800">{item.year}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.title}</td>
                      <td className="px-4 py-3 max-w-xs"><p className="truncate text-slate-600" title={item.text}>{item.text || "—"}</p></td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {item.is_published ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5">
                          <button type="button" onClick={() => reorderMilestone(item, "up")} disabled={milestoneIndexOf(item.id) <= 0 || movingMilestoneId === item.id} className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30" title="Move up">
                            <ArrowUp size={14} />
                          </button>
                          <span className="w-6 text-center text-slate-600">{item.display_order ?? 0}</span>
                          <button type="button" onClick={() => reorderMilestone(item, "down")} disabled={milestoneIndexOf(item.id) >= sortedMilestones.length - 1 || movingMilestoneId === item.id} className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30" title="Move down">
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => openEditMilestone(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] hover:bg-slate-50 transition">
                            <Pencil size={13} /> Edit
                          </button>
                          <button type="button" onClick={() => deleteMilestone(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition">
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && sortedMilestones.length > 0 && (
            <div className="space-y-3 lg:hidden">
              {sortedMilestones.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-slate-500">{item.year}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button type="button" onClick={() => reorderMilestone(item, "up")} disabled={milestoneIndexOf(item.id) <= 0 || movingMilestoneId === item.id} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-[#1E3A8A] disabled:opacity-30" title="Up"><ArrowUp size={13} /></button>
                      <span className="text-xs text-slate-500">{item.display_order ?? 0}</span>
                      <button type="button" onClick={() => reorderMilestone(item, "down")} disabled={milestoneIndexOf(item.id) >= sortedMilestones.length - 1 || movingMilestoneId === item.id} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-[#1E3A8A] disabled:opacity-30" title="Down"><ArrowDown size={13} /></button>
                    </div>
                  </div>
                  {item.text && <p className="text-sm text-slate-600 line-clamp-2">{item.text}</p>}
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => openEditMilestone(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#1E3A8A]">
                      <Pencil size={14} /> Edit
                    </button>
                    <button type="button" onClick={() => deleteMilestone(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-red-600">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && sortedMilestones.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <Clock size={26} />
              </div>
              <p className="font-semibold text-slate-700">No milestones yet.</p>
              <p className="text-sm text-slate-500">Add company milestones to show on the timeline.</p>
              <button type="button" onClick={openCreateMilestone} className="mx-auto inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition">
                <Plus size={16} /> Add Milestone
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "diffs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Differentiators</h3>
            <button
              type="button"
              onClick={openCreateDiff}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition"
            >
              <Plus size={16} />
              Add Differentiator
            </button>
          </div>

          {!loading && sortedDiffs.length > 0 && (
            <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white lg:block">
              <table className="min-w-[700px] divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Icon</th>
                    <th className="px-4 py-3.5">Title</th>
                    <th className="px-4 py-3.5">Text</th>
                    <th className="px-4 py-3.5">Accent</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Order</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedDiffs.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3 font-mono text-sm text-slate-600">{item.icon}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.title}</td>
                      <td className="px-4 py-3 max-w-xs"><p className="truncate text-slate-600" title={item.text}>{item.text || "—"}</p></td>
                      <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.accent === "emerald" ? "bg-emerald-50 text-emerald-700" :
                        item.accent === "orange" ? "bg-orange-50 text-orange-700" :
                        "bg-blue-50 text-blue-700"
                      }`}>{item.accent}</span></td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {item.is_published ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-0.5">
                          <button type="button" onClick={() => reorderDiff(item, "up")} disabled={diffIndexOf(item.id) <= 0 || movingDiffId === item.id} className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30" title="Move up">
                            <ArrowUp size={14} />
                          </button>
                          <span className="w-6 text-center text-slate-600">{item.display_order ?? 0}</span>
                          <button type="button" onClick={() => reorderDiff(item, "down")} disabled={diffIndexOf(item.id) >= sortedDiffs.length - 1 || movingDiffId === item.id} className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-30" title="Move down">
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => openEditDiff(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#1E3A8A] hover:bg-slate-50 transition">
                            <Pencil size={13} /> Edit
                          </button>
                          <button type="button" onClick={() => deleteDiff(item)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition">
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && sortedDiffs.length > 0 && (
            <div className="space-y-3 lg:hidden">
              {sortedDiffs.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-slate-500">{item.icon}</span>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          item.accent === "emerald" ? "bg-emerald-50 text-emerald-700" :
                          item.accent === "orange" ? "bg-orange-50 text-orange-700" :
                          "bg-blue-50 text-blue-700"
                        }`}>{item.accent}</span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button type="button" onClick={() => reorderDiff(item, "up")} disabled={diffIndexOf(item.id) <= 0 || movingDiffId === item.id} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-[#1E3A8A] disabled:opacity-30" title="Up"><ArrowUp size={13} /></button>
                      <span className="text-xs text-slate-500">{item.display_order ?? 0}</span>
                      <button type="button" onClick={() => reorderDiff(item, "down")} disabled={diffIndexOf(item.id) >= sortedDiffs.length - 1 || movingDiffId === item.id} className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-[#1E3A8A] disabled:opacity-30" title="Down"><ArrowDown size={13} /></button>
                    </div>
                  </div>
                  {item.text && <p className="text-sm text-slate-600 line-clamp-2">{item.text}</p>}
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => openEditDiff(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#1E3A8A]">
                      <Pencil size={14} /> Edit
                    </button>
                    <button type="button" onClick={() => deleteDiff(item)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-red-600">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && sortedDiffs.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <LayoutTemplate size={26} />
              </div>
              <p className="font-semibold text-slate-700">No differentiators yet.</p>
              <p className="text-sm text-slate-500">Add what sets the company apart.</p>
              <button type="button" onClick={openCreateDiff} className="mx-auto inline-flex items-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition">
                <Plus size={16} /> Add Differentiator
              </button>
            </div>
          )}
        </div>
      )}

      {showPillarModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white sm:max-w-lg sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
              <h2 className="text-lg font-bold text-slate-800">{editingPillarId ? "Edit Pillar" : "Add Pillar"}</h2>
              <button type="button" onClick={() => setShowPillarModal(false)} disabled={savingPillar} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition" aria-label="Close">
                <X size={19} />
              </button>
            </div>
            <form onSubmit={savePillar} className="space-y-4 p-5">
              <label>
                <span className="block text-sm font-semibold text-slate-700 mb-1">Icon</span>
                <select name="icon" value={pillarForm.icon} onChange={handlePillarChange} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20">
                  {ALLOWED_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </label>
              <label>
                <span className="block text-sm font-semibold text-slate-700 mb-1">Title <span className="text-red-500">*</span></span>
                <input name="title" value={pillarForm.title} onChange={handlePillarChange} required className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20" />
              </label>
              <label>
                <span className="block text-sm font-semibold text-slate-700 mb-1">Text</span>
                <textarea name="text" value={pillarForm.text} onChange={handlePillarChange} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Color</span>
                  <select name="color" value={pillarForm.color} onChange={handlePillarChange} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20">
                    {COLOR_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </label>
                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Order</span>
                  <input name="display_order" type="number" min="0" value={pillarForm.display_order} onChange={handlePillarChange} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20" />
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input name="is_published" type="checkbox" checked={pillarForm.is_published} onChange={handlePillarChange} className="h-4 w-4 accent-[#FF7A00]" />
                Published
              </label>
              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end sm:border-t sm:border-slate-100 sm:pt-4">
                <button type="button" onClick={() => setShowPillarModal(false)} disabled={savingPillar} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" disabled={savingPillar} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition disabled:opacity-60">
                  {savingPillar && <Loader2 size={16} className="animate-spin" />}
                  {savingPillar ? "Saving…" : editingPillarId ? "Save changes" : "Add pillar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white sm:max-w-lg sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
              <h2 className="text-lg font-bold text-slate-800">{editingMilestoneId ? "Edit Milestone" : "Add Milestone"}</h2>
              <button type="button" onClick={() => setShowMilestoneModal(false)} disabled={savingMilestone} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition" aria-label="Close">
                <X size={19} />
              </button>
            </div>
            <form onSubmit={saveMilestone} className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Year <span className="text-red-500">*</span></span>
                  <input name="year" value={milestoneForm.year} onChange={handleMilestoneChange} required placeholder="e.g. 2015" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20" />
                </label>
                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Order</span>
                  <input name="display_order" type="number" min="0" value={milestoneForm.display_order} onChange={handleMilestoneChange} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20" />
                </label>
              </div>
              <label>
                <span className="block text-sm font-semibold text-slate-700 mb-1">Title <span className="text-red-500">*</span></span>
                <input name="title" value={milestoneForm.title} onChange={handleMilestoneChange} required className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20" />
              </label>
              <label>
                <span className="block text-sm font-semibold text-slate-700 mb-1">Text</span>
                <textarea name="text" value={milestoneForm.text} onChange={handleMilestoneChange} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20" />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input name="is_published" type="checkbox" checked={milestoneForm.is_published} onChange={handleMilestoneChange} className="h-4 w-4 accent-[#FF7A00]" />
                Published
              </label>
              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end sm:border-t sm:border-slate-100 sm:pt-4">
                <button type="button" onClick={() => setShowMilestoneModal(false)} disabled={savingMilestone} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" disabled={savingMilestone} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition disabled:opacity-60">
                  {savingMilestone && <Loader2 size={16} className="animate-spin" />}
                  {savingMilestone ? "Saving…" : editingMilestoneId ? "Save changes" : "Add milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDiffModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white sm:max-w-lg sm:rounded-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
              <h2 className="text-lg font-bold text-slate-800">{editingDiffId ? "Edit Differentiator" : "Add Differentiator"}</h2>
              <button type="button" onClick={() => setShowDiffModal(false)} disabled={savingDiff} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition" aria-label="Close">
                <X size={19} />
              </button>
            </div>
            <form onSubmit={saveDiff} className="space-y-4 p-5">
              <label>
                <span className="block text-sm font-semibold text-slate-700 mb-1">Icon</span>
                <select name="icon" value={diffForm.icon} onChange={handleDiffChange} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20">
                  {ALLOWED_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </label>
              <label>
                <span className="block text-sm font-semibold text-slate-700 mb-1">Title <span className="text-red-500">*</span></span>
                <input name="title" value={diffForm.title} onChange={handleDiffChange} required className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20" />
              </label>
              <label>
                <span className="block text-sm font-semibold text-slate-700 mb-1">Text</span>
                <textarea name="text" value={diffForm.text} onChange={handleDiffChange} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20" />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Accent</span>
                  <select name="accent" value={diffForm.accent} onChange={handleDiffChange} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20">
                    {ACCENT_OPTIONS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </label>
                <label>
                  <span className="block text-sm font-semibold text-slate-700 mb-1">Order</span>
                  <input name="display_order" type="number" min="0" value={diffForm.display_order} onChange={handleDiffChange} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20" />
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input name="is_published" type="checkbox" checked={diffForm.is_published} onChange={handleDiffChange} className="h-4 w-4 accent-[#FF7A00]" />
                Published
              </label>
              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end sm:border-t sm:border-slate-100 sm:pt-4">
                <button type="button" onClick={() => setShowDiffModal(false)} disabled={savingDiff} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Cancel</button>
                <button type="submit" disabled={savingDiff} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#163a72] transition disabled:opacity-60">
                  {savingDiff && <Loader2 size={16} className="animate-spin" />}
                  {savingDiff ? "Saving…" : editingDiffId ? "Save changes" : "Add differentiator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl border px-4 py-3 shadow-lg text-sm flex items-start gap-2.5 ${toast.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
          {toast.type === "error" ? <AlertCircle size={17} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" />}
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
}
