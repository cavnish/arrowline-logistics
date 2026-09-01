import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

import {
  requireAdmin,
  generateAdminToken,
} from "../middleware/adminAuth.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
  },
});

router.use(cookieParser());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

// =====================================================
// LOGIN
// =====================================================

router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      String(email || "").trim().toLowerCase() !== String(process.env.ADMIN_EMAIL || "").trim().toLowerCase() ||
      !process.env.ADMIN_API_KEY ||
      password !== process.env.ADMIN_API_KEY
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });

      router.post("/change-password", requireAdmin, async (req, res) => {
        const { currentPassword, newPassword } = req.body || {};
        if (currentPassword !== process.env.ADMIN_API_KEY || typeof newPassword !== "string" || newPassword.length < 12 || /[\r\n]/.test(newPassword)) {
          return res.status(400).json({ success: false, message: "Current password is invalid or the new password is too weak." });
        }

        const envPath = new URL("../.env", import.meta.url);
        const envText = await readFile(envPath, "utf8");
        const updated = envText.replace(/^ADMIN_API_KEY=.*$/m, `ADMIN_API_KEY=${newPassword}`);
        if (updated === envText) {
          return res.status(500).json({ success: false, message: "ADMIN_API_KEY is missing from server/.env." });
        }
        await writeFile(envPath, updated, "utf8");
        process.env.ADMIN_API_KEY = newPassword;
        res.json({ success: true, message: "Password changed. Please sign in again." });
      });
    }

    const token = generateAdminToken();

    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

// =====================================================
// LOGOUT
// =====================================================

router.post("/logout", (_req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    path: "/",
  });

  res.json({
    success: true,
  });
});

// =====================================================
// CHECK AUTH
// =====================================================

router.get("/me", requireAdmin, (_req, res) => {
  res.json({
    success: true,
    data: {
      authenticated: true,
    },
  });
});

router.post("/media", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "A JPG, PNG, or WEBP image is required" });
    }

    const folder = typeof req.body?.folder === "string" && /^[a-z0-9/_-]+$/.test(req.body.folder)
      ? req.body.folder
      : "general";
    const extension = req.file.mimetype.split("/")[1].replace("jpeg", "jpg");
    const path = `${folder}/${randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("website-media").upload(path, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

    if (error) throw error;
    const { data } = supabase.storage.from("website-media").getPublicUrl(path);
    return res.status(201).json({ success: true, data: { path, url: data.publicUrl } });
  } catch (error) {
    console.error("Media upload error:", error);
    return res.status(500).json({ success: false, message: "Unable to upload image" });
  }
});

router.get("/media/list", requireAdmin, async (_req, res) => {
  try {
    const allMedia = [];
    const folders = ["general", "services", "industries", "case-studies", "gallery", "locations", "testimonials", "blog", "social-videos"];

    for (const folder of folders) {
      const { data, error } = await supabase.storage.from("website-media").list(folder, {
        limit: 1000,
        offset: 0,
      });

      if (error && error.code !== "PGRST116") {
        console.warn(`Warning listing ${folder}:`, error);
        continue;
      }

      if (data) {
        for (const item of data) {
          if (!item.name.startsWith(".")) {
            const fullPath = `${folder}/${item.name}`;
            const { data: publicUrl } = supabase.storage.from("website-media").getPublicUrl(fullPath);
            allMedia.push({
              path: fullPath,
              url: publicUrl.publicUrl,
              filename: item.name,
              folder,
              uploadedAt: item.created_at,
            });
          }
        }
      }
    }

    allMedia.sort((a, b) => new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0));

    return res.json({ success: true, data: allMedia });
  } catch (error) {
    console.error("Media list error:", error);
    return res.status(500).json({ success: false, message: "Unable to load media library" });
  }
});

router.delete("/media", requireAdmin, async (req, res) => {
  try {
    const path = typeof req.query.path === "string" ? req.query.path : null;
    if (!path) {
      return res.status(400).json({ success: false, message: "Path parameter is required" });
    }

    const { error } = await supabase.storage.from("website-media").remove([path]);

    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    console.error("Media delete error:", error);
    return res.status(500).json({ success: false, message: "Unable to delete image" });
  }
});

router.get("/content", requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .order("section", { ascending: true })
      .order("content_key", { ascending: true });

    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Content list error:", error);
    return res.status(500).json({ success: false, message: "Unable to load content" });
  }
});

router.put("/content/:key", requireAdmin, async (req, res) => {
  try {
    const { content_value, section, content_type, is_published } = req.body || {};
    if (typeof content_value !== "string") {
      return res.status(400).json({ success: false, message: "Content value is required" });
    }

    const { data, error } = await supabase
      .from("site_content")
      .upsert({
        content_key: req.params.key,
        content_value,
        section: section || null,
        content_type: content_type || "text",
        is_published: is_published !== false,
        updated_at: new Date().toISOString(),
      }, { onConflict: "content_key" })
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Content update error:", error);
    return res.status(500).json({ success: false, message: "Unable to save content" });
  }
});

// =====================================================
// DASHBOARD STATS
// =====================================================

router.get("/stats", requireAdmin, async (_req, res) => {
  try {
    const count = async (filters = {}) => {
      let query = supabase
        .from("leads")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("archived", false);

      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }

      const { count, error } = await query;

      if (error) {
        throw error;
      }

      return count || 0;
    };

    const todayStart = new Date();

    todayStart.setHours(0, 0, 0, 0);

    const [
      total,
      newCount,
      todayResult,
      followUpCount,
      quotationSentCount,
      wonCount,
      lostCount,
    ] = await Promise.all([
      count(),

      count({
        status: "new",
      }),

      supabase
        .from("leads")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("archived", false)
        .gte(
          "created_at",
          todayStart.toISOString()
        ),

      count({
        status: "follow_up",
      }),

      count({
        status: "quotation_sent",
      }),

      count({
        status: "won",
      }),

      count({
        status: "lost",
      }),
    ]);

    if (todayResult.error) {
      throw todayResult.error;
    }

    return res.json({
      success: true,

      data: {
        total,
        new: newCount,
        today: todayResult.count || 0,
        follow_up: followUpCount,
        quotation_sent: quotationSentCount,
        won: wonCount,
        lost: lostCount,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load statistics",
    });
  }
});

// =====================================================
// LIST ENQUIRIES
// =====================================================

router.get(
  "/enquiries",
  requireAdmin,
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 25,
        search = "",
        status = "",
        priority = "",
        service = "",
        dateFrom = "",
        dateTo = "",
        sort = "newest",
      } = req.query;

      const pageNum = Math.max(
        parseInt(page, 10) || 1,
        1
      );

      const limitNum = Math.min(
        Math.max(
          parseInt(limit, 10) || 25,
          1
        ),
        100
      );

      const offset =
        (pageNum - 1) * limitNum;

      let query = supabase
        .from("leads")
        .select("*", {
          count: "exact",
        })
        .eq("archived", false);

      if (search.trim()) {
        const safeSearch = search
          .trim()
          .replace(/[%(),]/g, "");

        query = query.or(
          `reference_number.ilike.%${safeSearch}%,name.ilike.%${safeSearch}%,company.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%,service.ilike.%${safeSearch}%`
        );
      }

      if (status) {
        query = query.eq("status", status);
      }

      if (priority) {
        query = query.eq("priority", priority);
      }

      if (service) {
        query = query.eq("service", service);
      }

      if (dateFrom) {
        query = query.gte("created_at", dateFrom);
      }

      if (dateTo) {
        query = query.lte("created_at", dateTo);
      }

      switch (sort) {
        case "oldest":
          query = query.order("created_at", {
            ascending: true,
          });
          break;

        case "customer_name":
          query = query.order("name", {
            ascending: true,
          });
          break;

        case "status":
          query = query.order("status", {
            ascending: true,
          });
          break;

        case "priority":
          query = query.order("priority", {
            ascending: true,
          });
          break;

        default:
          query = query.order("created_at", {
            ascending: false,
          });
      }

      query = query.range(
        offset,
        offset + limitNum - 1
      );

      const {
        data,
        error,
        count,
      } = await query;

      if (error) {
        throw error;
      }

      const total = count || 0;

      return res.json({
        success: true,

        data: data || [],

        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(
            total / limitNum
          ),
        },
      });
    } catch (error) {
      console.error(
        "Enquiries error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load enquiries",
      });
    }
  }
);

// =====================================================
// SINGLE ENQUIRY
// =====================================================

router.get(
  "/enquiries/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        data,
        error,
      } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({
            success: false,
            message: "Enquiry not found",
          });
        }

        throw error;
      }

      const {
        data: notes,
        error: notesError,
      } = await supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", id)
        .order("created_at", {
          ascending: true,
        });

      if (notesError) {
        throw notesError;
      }

      return res.json({
        success: true,
        data: {
          ...data,
          notes: notes || [],
        },
      });
    } catch (error) {
      console.error(
        "Single enquiry error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load enquiry",
      });
    }
  }
);

// =====================================================
// UPDATE ENQUIRY
// =====================================================

router.patch(
  "/enquiries/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const allowedFields = [
        "status",
        "priority",
        "assigned_to",
        "notes",
      ];

      const updates = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      if (
        Object.keys(updates).length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "No valid fields to update",
        });
      }

      updates.updated_at =
        new Date().toISOString();

      const {
        data,
        error,
      } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(
        "Update enquiry error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update enquiry",
      });
    }
  }
);

// =====================================================
// DELETE ENQUIRY
// =====================================================

router.delete(
  "/enquiries/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        error: notesError,
      } = await supabase
        .from("lead_notes")
        .delete()
        .eq("lead_id", id);

      if (notesError) {
        throw notesError;
      }

      const { error } =
        await supabase
          .from("leads")
          .delete()
          .eq("id", id);

      if (error) {
        throw error;
      }

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(
        "Delete enquiry error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete enquiry",
      });
    }
  }
);

// =====================================================
// ADD NOTE
// =====================================================

router.post(
  "/enquiries/:id/notes",
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { note } = req.body || {};

      if (
        !note ||
        typeof note !== "string" ||
        !note.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Note cannot be empty",
        });
      }

      const {
        data,
        error,
      } = await supabase
        .from("lead_notes")
        .insert([
          {
            lead_id: id,
            note: note.trim(),
            admin_name: "Admin",
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(
        "Add note error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to add note",
      });
    }
  }
);

// =====================================================
// DELETE NOTE
// =====================================================

router.delete(
  "/enquiries/:id/notes/:noteId",
  requireAdmin,
  async (req, res) => {
    try {
      const { noteId } = req.params;

      const { error } =
        await supabase
          .from("lead_notes")
          .delete()
          .eq("id", noteId);

      if (error) {
        throw error;
      }

      return res.json({
        success: true,
      });
    } catch (error) {
      console.error(
        "Delete note error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete note",
      });
    }
  }
);

// =====================================================
// SERVICES
// =====================================================

router.get("/services", requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ success: false, message: "A service with this slug already exists" });
      }
      throw error;
    }
    return res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Services list error:", error);
    return res.status(500).json({ success: false, message: "Unable to load services" });
  }
});

router.post("/services", requireAdmin, async (req, res) => {
  try {
    const {
      slug, title, short_description = "", full_description = "",
      icon = "", hero_image = null, is_published = false,
      display_order = 0, meta_title = null, meta_description = null,
      canonical_url = null, og_image = null, cta_text = null, cta_url = null,
    } = req.body || {};

    if (!slug || !title || typeof slug !== "string" || typeof title !== "string") {
      return res.status(400).json({ success: false, message: "Slug and title are required" });
    }

    const { data, error } = await supabase
      .from("services")
      .insert({
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        short_description,
        full_description,
        icon,
        hero_image,
        is_published: Boolean(is_published),
        display_order: Number.isInteger(display_order) ? display_order : 0,
        meta_title,
        meta_description,
        canonical_url,
        og_image,
        cta_text,
        cta_url,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ success: false, message: "A service with this slug already exists" });
      }
      throw error;
    }
    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("Service create error:", error);
    return res.status(500).json({ success: false, message: "Unable to create service" });
  }
});

router.patch("/services/:id", requireAdmin, async (req, res) => {
  try {
    const allowedFields = [
      "slug", "title", "short_description", "full_description", "icon",
      "hero_image", "is_published", "display_order", "meta_title",
      "meta_description", "canonical_url", "og_image", "cta_text", "cta_url",
    ];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => req.body?.[field] !== undefined)
        .map((field) => [field, req.body[field]])
    );

    if (updates.slug) updates.slug = String(updates.slug).trim().toLowerCase();
    if (updates.title) updates.title = String(updates.title).trim();
    if (updates.display_order !== undefined) updates.display_order = Number(updates.display_order);
    updates.updated_at = new Date().toISOString();

    if (Object.keys(updates).length === 1) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const { data, error } = await supabase
      .from("services")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Service update error:", error);
    return res.status(500).json({ success: false, message: "Unable to update service" });
  }
});

router.delete("/services/:id", requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from("services").delete().eq("id", req.params.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    console.error("Service delete error:", error);
    return res.status(500).json({ success: false, message: "Unable to delete service" });
  }
});

// =====================================================
// INDUSTRIES
// =====================================================

router.get("/industries", requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("industries")
      .select("*")
      .order("display_order", { ascending: true })
      .order("title", { ascending: true });

    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Industries list error:", error);
    return res.status(500).json({ success: false, message: "Unable to load industries" });
  }
});

router.post("/industries", requireAdmin, async (req, res) => {
  try {
    const {
      slug, title, description = "", icon = "", cargo_types = [],
      image = null, is_published = false, display_order = 0,
    } = req.body || {};

    if (!slug || !title || typeof slug !== "string" || typeof title !== "string") {
      return res.status(400).json({ success: false, message: "Slug and title are required" });
    }

    const { data, error } = await supabase
      .from("industries")
      .insert({
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        description,
        icon,
        cargo_types: Array.isArray(cargo_types) ? cargo_types : [],
        image,
        is_published: Boolean(is_published),
        display_order: Number(display_order) || 0,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ success: false, message: "An industry with this slug already exists" });
      }
      throw error;
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("Industry create error:", error);
    return res.status(500).json({ success: false, message: "Unable to create industry" });
  }
});

router.patch("/industries/:id", requireAdmin, async (req, res) => {
  try {
    const allowedFields = ["slug", "title", "description", "icon", "cargo_types", "image", "is_published", "display_order"];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => req.body?.[field] !== undefined)
        .map((field) => [field, req.body[field]])
    );

    if (updates.slug) updates.slug = String(updates.slug).trim().toLowerCase();
    if (updates.title) updates.title = String(updates.title).trim();
    if (updates.cargo_types !== undefined && !Array.isArray(updates.cargo_types)) {
      return res.status(400).json({ success: false, message: "Cargo types must be an array" });
    }
    if (updates.display_order !== undefined) updates.display_order = Number(updates.display_order) || 0;
    updates.updated_at = new Date().toISOString();

    if (Object.keys(updates).length === 1) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const { data, error } = await supabase
      .from("industries")
      .update(updates)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ success: false, message: "An industry with this slug already exists" });
      }
      throw error;
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error("Industry update error:", error);
    return res.status(500).json({ success: false, message: "Unable to update industry" });
  }
});

router.delete("/industries/:id", requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from("industries").delete().eq("id", req.params.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    console.error("Industry delete error:", error);
    return res.status(500).json({ success: false, message: "Unable to delete industry" });
  }
});

const cmsResources = {
  "case-studies": { table: "case_studies", required: ["title"], fields: ["slug", "client_name", "title", "industry", "location", "description", "challenge", "solution", "results", "featured_image", "images", "meta_title", "meta_description", "is_published", "display_order"] },
  gallery: { table: "gallery_items", required: [], fields: ["title", "description", "category", "image", "alt_text", "is_published", "display_order"] },
  locations: { table: "locations", required: ["name", "slug"], fields: ["slug", "name", "state", "city", "description", "address", "image", "map_url", "meta_title", "meta_description", "is_published", "display_order"] },
  faqs: { table: "faqs", required: ["question", "answer"], fields: ["question", "answer", "category", "is_published", "display_order"] },
  testimonials: { table: "testimonials", required: ["customer_name", "testimonial"], fields: ["customer_name", "company", "position", "testimonial", "photo", "rating", "is_published", "display_order"] },
  "blog-categories": { table: "blog_categories", required: ["name", "slug"], fields: ["name", "slug", "description", "is_published"] },
  "blog-posts": { table: "blog_posts", required: ["title", "slug"], fields: ["title", "slug", "category_id", "author", "featured_image", "excerpt", "content", "meta_title", "meta_description", "keywords", "published_at", "is_published"] },
  "social-videos": { table: "social_videos", required: ["title", "video_url"], fields: ["title", "video_url", "embed_url", "thumbnail", "description", "platform", "is_published", "display_order"] },
  statistics: { table: "statistics", required: ["value", "label"], fields: ["value", "label", "description", "icon", "is_published", "display_order"] },
  "site-settings": { table: "site_settings", required: ["setting_key"], fields: ["setting_key", "setting_value", "setting_type", "is_public"] },
};

for (const [path, config] of Object.entries(cmsResources)) {
  router.get(`/${path}`, requireAdmin, async (req, res) => {
    try {
      const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 25, 1), 100);
      let query = supabase.from(config.table).select("*", { count: "exact" });
      const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
      if (search) query = query.ilike(config.fields.includes("title") ? "title" : config.fields[0], `%${search}%`);
      if (req.query.status === "published" && config.fields.includes("is_published")) query = query.eq("is_published", true);
      if (req.query.status === "draft" && config.fields.includes("is_published")) query = query.eq("is_published", false);
      query = query.order(config.fields.includes("display_order") ? "display_order" : "updated_at", { ascending: true });
      query = query.range((page - 1) * limit, page * limit - 1);
      const { data, error, count } = await query;
      if (error) throw error;
      return res.json({ success: true, data: data || [], pagination: { page, limit, total: count || 0, totalPages: Math.ceil((count || 0) / limit) } });
    } catch (error) {
      console.error(`${path} list error:`, error);
      return res.status(500).json({ success: false, message: `Unable to load ${path}` });
    }
  });

  router.post(`/${path}`, requireAdmin, async (req, res) => {
    try {
      const missing = config.required.find((field) => typeof req.body?.[field] !== "string" || !req.body[field].trim());
      if (missing) return res.status(400).json({ success: false, message: `${missing} is required` });
      const record = Object.fromEntries(config.fields.filter((field) => req.body?.[field] !== undefined).map((field) => [field, req.body[field]]));
      const { data, error } = await supabase.from(config.table).insert(record).select().single();
      if (error) {
        if (error.code === "23505") return res.status(409).json({ success: false, message: "A record with this unique value already exists" });
        throw error;
      }
      return res.status(201).json({ success: true, data });
    } catch (error) {
      console.error(`${path} create error:`, error);
      return res.status(500).json({ success: false, message: `Unable to create ${path}` });
    }
  });

  router.patch(`/${path}/:id`, requireAdmin, async (req, res) => {
    try {
      const updates = Object.fromEntries(config.fields.filter((field) => req.body?.[field] !== undefined).map((field) => [field, req.body[field]]));
      if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: "No valid fields to update" });
      updates.updated_at = new Date().toISOString();
      const { data, error } = await supabase.from(config.table).update(updates).eq("id", req.params.id).select().single();
      if (error) {
        if (error.code === "23505") return res.status(409).json({ success: false, message: "A record with this unique value already exists" });
        throw error;
      }
      return res.json({ success: true, data });
    } catch (error) {
      console.error(`${path} update error:`, error);
      return res.status(500).json({ success: false, message: `Unable to update ${path}` });
    }
  });

  router.delete(`/${path}/:id`, requireAdmin, async (req, res) => {
    try {
      const { error } = await supabase.from(config.table).delete().eq("id", req.params.id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error) {
      console.error(`${path} delete error:`, error);
      return res.status(500).json({ success: false, message: `Unable to delete ${path}` });
    }
  });
}

export default router;