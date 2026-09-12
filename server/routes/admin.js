import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

import {
  requireAdmin,
  generateAdminToken,
} from "../middleware/adminAuth.js";

const router = express.Router();

router.use(cookieParser());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
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
// POST /api/admin/login
// =====================================================

router.post("/login", (req, res) => {
  try {
    const { password } = req.body || {};

    if (
      !password ||
      password !== process.env.ADMIN_API_KEY
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
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
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login",
    });
  }
});

// =====================================================
// LOGOUT
// POST /api/admin/logout
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

  return res.json({
    success: true,
  });
});

// =====================================================
// AUTH CHECK
// GET /api/admin/me
// =====================================================

router.get("/me", requireAdmin, (_req, res) => {
  return res.json({
    success: true,
    data: {
      authenticated: true,
    },
  });
});

// =====================================================
// DASHBOARD STATS
// GET /api/admin/stats
// =====================================================

router.get("/stats", requireAdmin, async (_req, res) => {
  try {
    const countLeads = async (filters = {}) => {
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

    todayStart.setHours(
      0,
      0,
      0,
      0
    );

    const [
      total,
      newCount,
      followUpCount,
      quotationSentCount,
      wonCount,
      lostCount,
    ] = await Promise.all([
      countLeads(),
      countLeads({
        status: "new",
      }),
      countLeads({
        status: "follow_up",
      }),
      countLeads({
        status: "quotation_sent",
      }),
      countLeads({
        status: "won",
      }),
      countLeads({
        status: "lost",
      }),
    ]);

    const {
      count: todayCount,
      error: todayError,
    } = await supabase
      .from("leads")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("archived", false)
      .gte(
        "created_at",
        todayStart.toISOString()
      );

    if (todayError) {
      throw todayError;
    }

    return res.json({
      success: true,
      data: {
        total,
        new: newCount,
        today: todayCount || 0,
        follow_up: followUpCount,
        quotation_sent: quotationSentCount,
        won: wonCount,
        lost: lostCount,
      },
    });
  } catch (error) {
    console.error(
      "Admin stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load statistics",
    });
  }
});

// =====================================================
// LIST ENQUIRIES
// GET /api/admin/enquiries
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

      const pageNum =
        Math.max(
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
        const cleanSearch =
          search.trim();

        query = query.or(
          `reference_number.ilike.%${cleanSearch}%,name.ilike.%${cleanSearch}%,company.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%,service.ilike.%${cleanSearch}%`
        );
      }

      if (status) {
        query = query.eq(
          "status",
          status
        );
      }

      if (priority) {
        query = query.eq(
          "priority",
          priority
        );
      }

      if (service) {
        query = query.eq(
          "service",
          service
        );
      }

      if (dateFrom) {
        query = query.gte(
          "created_at",
          dateFrom
        );
      }

      if (dateTo) {
        query = query.lte(
          "created_at",
          dateTo
        );
      }

      switch (sort) {
        case "oldest":
          query = query.order(
            "created_at",
            {
              ascending: true,
            }
          );
          break;

        case "customer_name":
          query = query.order(
            "name",
            {
              ascending: true,
            }
          );
          break;

        case "status":
          query = query.order(
            "status",
            {
              ascending: true,
            }
          );
          break;

        case "priority":
          query = query.order(
            "priority",
            {
              ascending: true,
            }
          );
          break;

        default:
          query = query.order(
            "created_at",
            {
              ascending: false,
            }
          );
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

      const total =
        count || 0;

      return res.json({
        success: true,
        data: data || [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages:
            Math.ceil(
              total / limitNum
            ),
        },
      });
    } catch (error) {
      console.error(
        "Admin enquiries error:",
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
// GET SINGLE ENQUIRY
// GET /api/admin/enquiries/:id
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
        throw error;
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message:
            "Enquiry not found",
        });
      }

      const {
        data: notes,
        error: notesError,
      } = await supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", id)
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

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
        "Get enquiry error:",
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
// PATCH /api/admin/enquiries/:id
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
        if (
          req.body?.[field] !==
          undefined
        ) {
          updates[field] =
            req.body[field];
        }
      }

      if (
        Object.keys(updates)
          .length === 0
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
// DELETE /api/admin/enquiries/:id
// =====================================================

router.delete(
  "/enquiries/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      await supabase
        .from("lead_notes")
        .delete()
        .eq("lead_id", id);

      const {
        error,
      } = await supabase
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
// POST /api/admin/enquiries/:id/notes
// =====================================================

router.post(
  "/enquiries/:id/notes",
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const note =
        req.body?.note;

      if (
        !note ||
        typeof note !==
          "string" ||
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
// DELETE /api/admin/enquiries/:id/notes/:noteId
// =====================================================

router.delete(
  "/enquiries/:id/notes/:noteId",
  requireAdmin,
  async (req, res) => {
    try {
      const { noteId } =
        req.params;

      const {
        error,
      } = await supabase
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
// SERVICES CRUD
// =====================================================

// GET /api/admin/services
router.get("/services", requireAdmin, async (_req, res) => {
  try {
    const { data: services, error } = await supabase
      .from("services")
      .select("*, service_items(count)")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Admin get services error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }

    const formatted = (services || []).map((srv) => ({
      ...srv,
      sub_services_count: srv.service_items?.[0]?.count || 0,
    }));

    return res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("Admin get services exception:", err);
    return res.status(500).json({ success: false, message: "Failed to load services" });
  }
});

// POST /api/admin/services
router.post("/services", requireAdmin, async (req, res) => {
  try {
    const body = { ...req.body };
    delete body.sub_services_count;
    delete body.service_items;

    const { data, error } = await supabase
      .from("services")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("Admin create service error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("Admin create service exception:", err);
    return res.status(500).json({ success: false, message: "Failed to create service" });
  }
});

// PATCH /api/admin/services/:id
router.patch("/services/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    delete body.id;
    delete body.sub_services_count;
    delete body.service_items;
    body.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("services")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Admin update service error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.json({ success: true, data });
  } catch (err) {
    console.error("Admin update service exception:", err);
    return res.status(500).json({ success: false, message: "Failed to update service" });
  }
});

// DELETE /api/admin/services/:id
router.delete("/services/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      console.error("Admin delete service error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    console.error("Admin delete service exception:", err);
    return res.status(500).json({ success: false, message: "Failed to delete service" });
  }
});

// =====================================================
// SUB-SERVICES (SERVICE ITEMS) CRUD
// =====================================================

// GET /api/admin/service-items
router.get("/service-items", requireAdmin, async (req, res) => {
  try {
    const { service_id, parent_slug } = req.query;
    let query = supabase
      .from("service_items")
      .select("*")
      .order("display_order", { ascending: true });

    if (service_id) query = query.eq("service_id", service_id);
    if (parent_slug) query = query.eq("parent_slug", parent_slug);

    const { data, error } = await query;
    if (error) {
      console.error("Admin get service items error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Admin get service items exception:", err);
    return res.status(500).json({ success: false, message: "Failed to load sub-services" });
  }
});

// POST /api/admin/service-items
router.post("/service-items", requireAdmin, async (req, res) => {
  try {
    const body = { ...req.body };
    const { data, error } = await supabase
      .from("service_items")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("Admin create service item error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("Admin create service item exception:", err);
    return res.status(500).json({ success: false, message: "Failed to create sub-service" });
  }
});

// PATCH /api/admin/service-items/:id
router.patch("/service-items/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    delete body.id;
    body.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("service_items")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Admin update service item error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.json({ success: true, data });
  } catch (err) {
    console.error("Admin update service item exception:", err);
    return res.status(500).json({ success: false, message: "Failed to update sub-service" });
  }
});

// DELETE /api/admin/service-items/:id
router.delete("/service-items/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("service_items").delete().eq("id", id);
    if (error) {
      console.error("Admin delete service item error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.json({ success: true, message: "Sub-service deleted successfully" });
  } catch (err) {
    console.error("Admin delete service item exception:", err);
    return res.status(500).json({ success: false, message: "Failed to delete sub-service" });
  }
});

// =====================================================
// MEDIA MANAGEMENT (UPLOAD, LIST, DELETE)
// =====================================================

// POST /api/admin/media
router.post("/media", requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const folder = req.body.folder || "general";
    const sanitizedName = req.file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    const filePath = `${folder}/${Date.now()}-${sanitizedName}`;

    const bucket = "website-media";
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return res.status(500).json({ success: false, message: uploadError.message });
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return res.status(201).json({
      success: true,
      data: {
        path: filePath,
        url: publicUrlData.publicUrl,
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
      },
    });
  } catch (err) {
    console.error("Media upload exception:", err);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// GET /api/admin/media/list
router.get("/media/list", requireAdmin, async (req, res) => {
  try {
    const bucket = "website-media";
    const folder = req.query.folder || "";
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.error("Media list error:", error);
      return res.json({ success: true, data: [] });
    }

    const files = (data || [])
      .filter((item) => item.name !== ".emptyFolderPlaceholder")
      .map((item) => {
        const fullPath = folder ? `${folder}/${item.name}` : item.name;
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fullPath);

        return {
          id: item.id || item.name,
          name: item.name,
          path: fullPath,
          url: publicUrlData.publicUrl,
          size: item.metadata?.size || 0,
          type: item.metadata?.mimetype || "image/jpeg",
          created_at: item.created_at,
        };
      });

    return res.json({ success: true, data: files });
  } catch (err) {
    console.error("Media list exception:", err);
    return res.json({ success: true, data: [] });
  }
});

// DELETE /api/admin/media
router.delete("/media", requireAdmin, async (req, res) => {
  try {
    const path = req.query.path;
    if (!path) {
      return res.status(400).json({ success: false, message: "Path required" });
    }
    const bucket = "website-media";
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      console.error("Media delete error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.json({ success: true, message: "Media deleted successfully" });
  } catch (err) {
    console.error("Media delete exception:", err);
    return res.status(500).json({ success: false, message: "Deletion failed" });
  }
});

export function createAdminRouter() {
  return router;
}

export default router;