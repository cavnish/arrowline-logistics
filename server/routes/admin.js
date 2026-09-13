import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import multer from "multer";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import CloudinaryService from "../services/cloudinaryService.js";

import {
  requireAdmin,
  revokeSession,
  generateAdminToken,
  isAllowedAdminEmail,
} from "../middleware/adminAuth.js";

const router = express.Router();

router.use(cookieParser());

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(new Error("Only image uploads (JPEG, PNG, WEBP, GIF, AVIF) are allowed"));
    }
    cb(null, true);
  },
});

// Normalizes multer rejection into a clean 400 response instead of a 500.
function handleUploadError(err, _req, res, next) {
  if (!err) return next();
  const message =
    err instanceof multer.MulterError
      ? err.code === "LIMIT_FILE_SIZE"
        ? "File is too large (max 15 MB)"
        : err.message
      : err.message || "Upload failed";
  return res.status(400).json({ success: false, message });
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

// Dedicated clients to keep roles isolated:
// - authClient: only used for Supabase Auth sign-in. Its in-memory session is
//   REPLACED by the signed-in user's JWT after login, so it must never be used
//   for database writes.
// - supabase: always the server-side service-role client (bypasses RLS) for all
//   admin_sessions / CRUD / media operations.
const authClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
    },
  }
);

// Optional Cloudinary-backed media pipeline. Falls back to the existing
// Supabase storage bucket when credentials are absent or the upload fails.
const cloudinaryService =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
    ? new CloudinaryService(
        process.env.CLOUDINARY_CLOUD_NAME,
        process.env.CLOUDINARY_API_KEY,
        process.env.CLOUDINARY_API_SECRET
      )
    : null;

// Admin UI payloads use camelCase keys; DB columns are snake_case.
function toSnakeCaseKeys(body = {}) {
  const out = {};
  for (const [key, value] of Object.entries(body)) {
    out[key.replace(/[A-Z]/g, (ch) => `_${ch.toLowerCase()}`)] = value;
  }
  return out;
}

// Best-effort cleanup of an orphaned Cloudinary asset. Never fails the request.
async function destroyCloudinaryAsset(publicId) {
  if (!cloudinaryService || !publicId) return;
  try {
    await cloudinaryService.destroy(publicId);
  } catch (err) {
    console.warn("Cloudinary cleanup skipped:", err?.message || err);
  }
}

// =====================================================
// LOGIN
// POST /api/admin/login
// Flow: validate input -> allowlist check -> Supabase Auth
// signInWithPassword -> issue JWT -> register admin_sessions
// record -> set secure httpOnly cookie.
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // 1. Validate input
    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 2. Server-side allowlist check
    if (!isAllowedAdminEmail(cleanEmail)) {
      return res.status(403).json({
        success: false,
        message: "This email is not authorized for admin access",
      });
    }

    // 3. Supabase Auth email/password verification.
    //    Signed in on authClient ONLY so the service-role client (supabase)
    //    below never inherits the user's session and always bypasses RLS.
    const { data: authUser, error: authError } =
      await authClient.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

    if (authError || !authUser?.user) {
      console.error("Admin Auth sign-in error:", authError?.message || "unknown");
      // Identical message for missing user vs wrong password — no account enumeration.
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Issue JWT carrying role/email/jti
    const { token, jti, expiresAt } = generateAdminToken(cleanEmail);

    // 5. Register server-side session
    const { error: sessionError } = await supabase
      .from("admin_sessions")
      .insert({
        jti,
        user_id: authUser.user.id,
        email: cleanEmail,
        expires_at: expiresAt.toISOString(),
      });

    if (sessionError) {
      console.error("Admin session insert error:", sessionError.message);
      try {
        const roleRef = process.env.SUPABASE_SERVICE_ROLE_KEY
          ? JSON.parse(Buffer.from(process.env.SUPABASE_SERVICE_ROLE_KEY.split(".")[1], "base64").toString())
          : null;
        console.error(
          "Admin session insert DETAIL:",
          JSON.stringify({ code: sessionError.code, statusText: sessionError.statusText, details: sessionError.details, hint: sessionError.hint, role: roleRef?.role, ref: roleRef?.ref })
        );
      } catch (diagErr) {
        console.error("Admin session insert DETAIL (diag failed):", diagErr.message);
      }
      return res.status(500).json({
        success: false,
        message: "Unable to create admin session",
      });
    }

    // 6. Set secure httpOnly cookie
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

router.post("/logout", async (req, res) => {
  try {
    const token = req.cookies?.admin_token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.ADMIN_API_KEY);
        if (decoded?.jti) {
          await revokeSession(decoded.jti);
        }
      } catch (_err) {
        // Token already invalid — nothing to revoke server-side.
      }
    }
  } catch (_err) {
    // Never fail the logout response because of housekeeping.
  }

  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
        .maybeSingle();

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
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Enquiry not found",
        });
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
    const body = toSnakeCaseKeys(req.body);
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
    const { data: existing } = await supabase
      .from("services")
      .select("image_public_id")
      .eq("id", id)
      .maybeSingle();

    const body = toSnakeCaseKeys(req.body);
    delete body.id;
    delete body.sub_services_count;
    delete body.service_items;
    body.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("services")
      .update(body)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Admin update service error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    if (!data) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    if (existing?.image_public_id && existing.image_public_id !== (body.image_public_id || null)) {
      await destroyCloudinaryAsset(existing.image_public_id);
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
    const { data: existing } = await supabase
      .from("services")
      .select("image_public_id")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      console.error("Admin delete service error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    await destroyCloudinaryAsset(existing?.image_public_id);

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
    const body = toSnakeCaseKeys(req.body);
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
    const { data: existing } = await supabase
      .from("service_items")
      .select("image_public_id")
      .eq("id", id)
      .maybeSingle();

    const body = toSnakeCaseKeys(req.body);
    delete body.id;
    body.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("service_items")
      .update(body)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Admin update service item error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    if (!data) {
      return res.status(404).json({ success: false, message: "Sub-service not found" });
    }

    if (existing?.image_public_id && existing.image_public_id !== (body.image_public_id || null)) {
      await destroyCloudinaryAsset(existing.image_public_id);
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
    const { data: existing } = await supabase
      .from("service_items")
      .select("image_public_id")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("service_items").delete().eq("id", id);
    if (error) {
      console.error("Admin delete service item error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    await destroyCloudinaryAsset(existing?.image_public_id);

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
router.post("/media", requireAdmin, upload.single("file"), handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const rawFolder = req.body.folder || "general";
    const slug = String(req.body.slug || "").trim().replace(/[^a-z0-9-]/gi, "").toLowerCase();
    const sanitizeFolder = (name) => String(name || "").replace(/[^a-zA-Z0-9-_/]/g, "").replace(/\/+$/, "");

    let folder = "arrowline/general";
    if (rawFolder === "services") folder = slug ? `arrowline/services/${slug}` : "arrowline/services";
    else if (rawFolder === "sub-services") folder = slug ? `arrowline/services/${slug}` : "arrowline/sub-services";
    else if (rawFolder === "gallery") folder = "arrowline/gallery";
    else folder = `arrowline/${sanitizeFolder(rawFolder)}`;

    // Preferred path: Cloudinary. Falls back to the existing Supabase storage
    // bucket whenever Cloudinary is not configured or the upload fails.
    if (cloudinaryService) {
      try {
        const result = await cloudinaryService.upload(req.file.buffer, { folder });
        return res.status(201).json({
          success: true,
          data: {
            path: result.public_id,
            public_id: result.public_id,
            url: result.secure_url || result.url,
            name: req.file.originalname,
            size: req.file.size,
            type: "image",
            width: result.width,
            height: result.height,
            format: result.format,
            provider: "cloudinary",
          },
        });
      } catch (err) {
        console.warn("Cloudinary upload failed, falling back to Supabase storage:", err?.message || err);
      }
    }

    const bucket = "website-media";
    const sanitizedName = req.file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .toLowerCase();
    const filePath = `${rawFolder}/${Date.now()}-${sanitizedName}`;

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
        public_id: null,
        url: publicUrlData.publicUrl,
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        provider: "supabase",
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
    const searchQuery = String(req.query.search || "").trim().toLowerCase();
    const files = [];

    // 1) Cloudinary assets when configured (source of truth for managed media).
    if (cloudinaryService) {
      try {
        const cloudinaryFiles = await cloudinaryService.list({ folder: "all", maxResults: 200 });
        for (const f of cloudinaryFiles) {
          files.push({
            id: f.public_id,
            name: f.name,
            path: f.public_id,
            public_id: f.public_id,
            url: f.url,
            size: f.bytes || 0,
            type: (f.format && `image/${f.format}`) || "image/jpeg",
            width: f.width,
            height: f.height,
            folder: f.folder || "arrowline",
            created_at: f.created_at,
            provider: "cloudinary",
          });
        }
      } catch (err) {
        console.warn("Cloudinary media list failed (continuing with storage):", err?.message || err);
      }
    }

    // 2) Supabase storage bucket assets.
    const { data, error } = await supabase.storage.from(bucket).list(folder, {
      limit: 200,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) {
      console.error("Media list error:", error);
    } else {
      for (const item of data || []) {
        if (item.name === ".emptyFolderPlaceholder") continue;
        const fullPath = folder ? `${folder}/${item.name}` : item.name;
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fullPath);
        files.push({
          id: item.id || item.name,
          name: item.name,
          path: fullPath,
          url: publicUrlData.publicUrl,
          size: item.metadata?.size || 0,
          type: item.metadata?.mimetype || "image/jpeg",
          width: null,
          height: null,
          folder: item.metadata?.folder || folder || "website-media",
          created_at: item.created_at,
          provider: "supabase",
        });
      }
    }

    // 3) Search/filter by filename or folder.
    const filtered = searchQuery
      ? files.filter(
          (f) =>
            (f.name || "").toLowerCase().includes(searchQuery) ||
            (f.path || "").toLowerCase().includes(searchQuery) ||
            (f.folder || "").toLowerCase().includes(searchQuery)
        )
      : files;

    return res.json({ success: true, data: filtered });
  } catch (err) {
    console.error("Media list exception:", err);
    return res.json({ success: true, data: [] });
  }
});

// GET /api/admin/image-usage?url=...|public_id=...
// Returns every CMS entity currently referencing the same image (for
// duplicate-assignment warnings in the Admin UI).
router.get("/image-usage", requireAdmin, async (req, res) => {
  try {
    const targetUrl = String(req.query.url || "").trim();
    const targetPublicId = String(req.query.public_id || "").trim();
    if (!targetUrl && !targetPublicId) {
      return res.status(400).json({ success: false, message: "url or public_id is required" });
    }
    const norm = (s) => String(s || "").trim().replace(/[;?#].*$/, "").replace(/\/+$/, "");
    const needle = norm(targetUrl);

    const matches = [];
    const push = (entity, label, row, field, value) => {
      matches.push({
        entity,
        entityLabel: label,
        id: row.id,
        title: row.title || row.name || row.client_name || row.content_key || row.slug || "Untitled",
        slug: row.slug || "",
        field,
        url: value,
      });
    };

    const scan = async (table, entityLabel, columns) => {
      const { data, error } = await supabase.from(table).select("*");
      if (error) return;
      for (const row of data || []) {
        for (const [col, kind] of Object.entries(columns)) {
          const val = row[col];
          if (!val) continue;
          if (kind === "array") {
            const arr = Array.isArray(val) ? val : [];
            if (arr.some((item) => item && norm(item.url || item) === needle)) {
              push(table, entityLabel, row, col, val);
            }
          } else {
            const matched = norm(val) === needle;
            const pidMatched =
              targetPublicId && row.image_public_id && row.image_public_id === targetPublicId;
            if (matched || pidMatched) push(table, entityLabel, row, col, val);
          }
        }
      }
    };

    await scan("services", "Service", { hero_image: "text", image_public_id: "text" });
    await scan("service_items", "Sub-Service", { hero_image: "text" });
    await scan("industries", "Industry", { image: "text" });
    await scan("clients", "Client", { logo: "text" });
    await scan("case_studies", "Case Study", { featured_image: "text", images: "array" });
    await scan("gallery_items", "Gallery", { image: "text" });
    await scan("locations", "Location", { image: "text" });
    await scan("testimonials", "Testimonial", { photo: "text" });
    await scan("blog_posts", "Blog Post", { featured_image: "text" });
    await scan("social_videos", "Social Video", { thumbnail: "text" });
    await scan("trusted_network", "Trusted Network", { logo: "text" });

    // site_content image entries
    const { data: blocks, error: err2 } = await supabase
      .from("site_content")
      .select("id,content_key,content_value,content_type")
      .eq("content_type", "image");
    if (!err2) {
      for (const b of blocks || []) {
        if (norm(b.content_value) === needle) push("site_content", "Website Content", b, "content_value", b.content_value);
      }
    }

    return res.json({ success: true, data: matches });
  } catch (err) {
    console.error("Image usage exception:", err);
    return res.status(500).json({ success: false, message: "Failed to check image usage" });
  }
});

// DELETE /api/admin/media
router.delete("/media", requireAdmin, async (req, res) => {
  try {
    const publicId = req.query.public_id;
    const path = req.query.path;

    if (publicId) {
      if (!cloudinaryService) {
        return res.status(400).json({ success: false, message: "Cloudinary is not configured" });
      }
      const result = await cloudinaryService.destroy(publicId);
      return res.json({ success: true, data: result });
    }

    if (!path) {
      return res.status(400).json({ success: false, message: "Path or public_id required" });
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

// =====================================================
// SITE CONTENT (CMS text overrides)
// =====================================================

router.get("/content", requireAdmin, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .order("content_key", { ascending: true });
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e) {
    console.error("Admin get content:", e.message);
    return res.status(500).json({ success: false, message: "Failed to load content" });
  }
});

router.put("/content/:key", requireAdmin, async (req, res) => {
  try {
    const key = req.params.key;
    const allowed = ["content_value", "content_type", "section", "is_published"];
    const body = {};
    for (const k of allowed) if (req.body?.[k] !== undefined) body[k] = req.body[k];
    body.updated_at = new Date().toISOString();
    let { data, error } = await supabase
      .from("site_content")
      .update(body)
      .eq("content_key", key)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      const ins = await supabase
        .from("site_content")
        .insert([{ content_key: key, content_value: body.content_value || "", content_type: body.content_type || "text", section: body.section || null, is_published: body.is_published ?? true, updated_at: body.updated_at }])
        .select()
        .single();
      if (ins.error) throw ins.error;
      data = ins.data;
    }
    return res.json({ success: true, data });
  } catch (e) {
    console.error("Admin put content:", e.message);
    return res.status(400).json({ success: false, message: e.message });
  }
});

// =====================================================
// GENERIC COLLECTION CRUD
//适用于 AdminCollection.jsx resource pages
// =====================================================

const COLLECTION_TABLE = {
  industries: "industries",
  clients: "clients",
  "case-studies": "case_studies",
  gallery: "gallery_items",
  locations: "locations",
  faqs: "faqs",
  testimonials: "testimonials",
  "blog-categories": "blog_categories",
  "blog-posts": "blog_posts",
  "social-videos": "social_videos",
  statistics: "statistics",
  "site-settings": "site_settings",
};

const COLLECTION_COLUMNS = {
  industries: ["slug","title","description","icon","cargo_types","image","is_published","display_order"],
  clients: ["name","logo","category","website","is_featured","is_published","display_order"],
  "case-studies": ["slug","client_name","title","industry","location","description","challenge","solution","results","featured_image","images","meta_title","meta_description","is_published","display_order"],
  gallery: ["title","description","category","image","alt_text","is_published","display_order"],
  locations: ["slug","name","state","city","description","address","image","map_url","meta_title","meta_description","is_published","display_order"],
  faqs: ["question","answer","category","is_published","display_order"],
  testimonials: ["customer_name","company","position","testimonial","photo","rating","is_published","display_order"],
  "blog-categories": ["name","slug","description","is_published"],
  "blog-posts": ["title","slug","category_id","author","featured_image","excerpt","content","meta_title","meta_description","keywords","published_at","is_published"],
  "social-videos": ["title","video_url","embed_url","thumbnail","description","platform","is_published","display_order"],
  statistics: ["value","label","description","icon","is_published","display_order"],
  "site-settings": ["setting_key","setting_value","setting_type","is_public"],
};

function pickColumns(body, allowed) {
  const out = {};
  for (const k of allowed) if (body[k] !== undefined) out[k] = body[k];
  return out;
}

router.get("/:resource", requireAdmin, async (req, res) => {
  try {
    const { resource } = req.params;
    const table = COLLECTION_TABLE[resource];
    if (!table) return res.status(404).json({ success: false, message: `Unknown collection: ${resource}` });

    let query = supabase.from(table).select("*");

    const search = String(req.query.search || "").trim();
    if (search) {
      const textCols = (COLLECTION_COLUMNS[resource] || [])
        .filter((c) => !/^(is_|images|cargo_types|display_order|updated_at|created_at|published_at|category_id|is_public)$/.test(c));
      if (textCols.length) query = query.or(textCols.map((c) => `${c}.ilike.%${search}%`).join(","));
    }

    const statusFilter = String(req.query.status || "").trim();
    if (statusFilter === "published") query = query.eq("is_published", true);
    else if (statusFilter === "draft") query = query.eq("is_published", false);

    query = query.order("display_order", { ascending: true, nullsFirst: true }).order("created_at", { ascending: false, nullsFirst: true });

    const limitNum = Math.min(Math.max(parseInt(req.query.limit, 10) || 200, 1), 500);
    const pageNum = Math.max(parseInt(req.query.page, 10) || 1, 1);
    query = query.range((pageNum - 1) * limitNum, pageNum * limitNum - 1);

    const { data, error } = await query;
    if (error) throw error;
    return res.json({ success: true, data: data || [] });
  } catch (e) {
    console.error(`GET /${req.params.resource}:`, e.message);
    return res.status(500).json({ success: false, message: `Unable to load ${req.params.resource}` });
  }
});

router.post("/:resource", requireAdmin, async (req, res) => {
  try {
    const { resource } = req.params;
    const table = COLLECTION_TABLE[resource];
    if (!table) return res.status(404).json({ success: false, message: `Unknown collection: ${resource}` });
    const body = pickColumns(toSnakeCaseKeys(req.body), COLLECTION_COLUMNS[resource]);
    const { data, error } = await supabase.from(table).insert([body]).select().single();
    if (error) throw error;
    return res.status(201).json({ success: true, data });
  } catch (e) {
    console.error(`POST /${req.params.resource}:`, e.message);
    return res.status(400).json({ success: false, message: e.message });
  }
});

router.patch("/:resource/:id", requireAdmin, async (req, res) => {
  try {
    const { resource, id } = req.params;
    const table = COLLECTION_TABLE[resource];
    if (!table) return res.status(404).json({ success: false, message: `Unknown collection: ${resource}` });
    const body = pickColumns(toSnakeCaseKeys(req.body), COLLECTION_COLUMNS[resource]);
    body.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from(table).update(body).eq("id", id).select().maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: "Record not found" });
    return res.json({ success: true, data });
  } catch (e) {
    console.error(`PATCH /${req.params.resource}:`, e.message);
    return res.status(400).json({ success: false, message: e.message });
  }
});

router.delete("/:resource/:id", requireAdmin, async (req, res) => {
  try {
    const { resource, id } = req.params;
    const table = COLLECTION_TABLE[resource];
    if (!table) return res.status(404).json({ success: false, message: `Unknown collection: ${resource}` });
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    console.error(`DELETE /${req.params.resource}:`, e.message);
    return res.status(400).json({ success: false, message: e.message });
  }
});

export function createAdminRouter() {
  return router;
}

export default router;