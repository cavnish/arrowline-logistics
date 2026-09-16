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

// Trusted-network logos additionally accept SVG so vector brand marks keep
// crisp on every screen; Cloudinary is told resource_type "image" explicitly
// because it cannot auto-detect SVG.
const TRUSTED_LOGO_TYPES = [...ALLOWED_IMAGE_TYPES, "image/svg+xml"];

const TRUSTED_NETWORK_FOLDER = "arrowline/trusted-network";

const trustedLogoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!TRUSTED_LOGO_TYPES.includes(file.mimetype)) {
      return cb(new Error("Logo must be an image (JPEG, PNG, WEBP, GIF, AVIF or SVG)"));
    }
    cb(null, true);
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
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
        ? "File is too large (max 10 MB)"
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

// Multipart fields arrive as raw strings; normalize while preserving "missing".
function parseBoolField(value) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  return ["true", "1", "on", "yes"].includes(String(value).toLowerCase());
}

function parseIntField(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

// Lenient string coercion that rejects non-primitive values (e.g. objects that
// would stringify to "[object Object]" and corrupt text/image fields).
function toStringField(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function isValidHttpUrl(value) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// Cloudinary upload + metadata mapping for a trusted-network logo. No Supabase
// storage fallback here: logos live on Cloudinary only (DB stores metadata).
// Cloudinary auto-generates a unique public_id per upload so every logo is a
// distinct asset that can be individually deleted on replace/remove.
async function uploadTrustedLogo(file) {
  const result = await cloudinaryService.upload(file.buffer, {
    folder: TRUSTED_NETWORK_FOLDER,
    resource_type: "image",
  });
  return {
    logo: result.secure_url || result.url,
    logo_public_id: result.public_id,
    logo_format: result.format,
    logo_width: result.width ? Number(result.width) : null,
    logo_height: result.height ? Number(result.height) : null,
    logo_resource_type: "image",
    logo_bytes: result.bytes ? Number(result.bytes) : null,
  };
}

// Logs the real (safe) diagnostic server-side and returns a useful client
// message. Cloudinary error bodies never contain secrets.
function logCloudinaryError(context, err) {
  const detail =
    err?.error?.message || err?.message || err?.error || String(err);
  console.error(`${context}:`, detail);
}

const CLOUDINARY_UPLOAD_FAILED =
  "Cloudinary upload failed. Check the server Cloudinary configuration.";

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
            admin_name: req.admin?.email || "Admin",
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
      .select("*, service_items(*)")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Admin get services error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }

    const formatted = (services || []).map((srv) => ({
      ...srv,
      subServices: Array.isArray(srv.service_items) ? srv.service_items : [],
      sub_services_count: Array.isArray(srv.service_items) ? srv.service_items.length : 0,
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
    if (!isUuid(id)) return res.status(400).json({ success: false, message: "Invalid service id" });

    const { data: existing } = await supabase
      .from("services")
      .select("image_public_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing) return res.status(404).json({ success: false, message: "Service not found" });

    // Collect every Cloudinary asset owned by this service/its sub-services
    // before the DB delete cascades the rows away.
    const { data: subItems } = await supabase
      .from("service_items")
      .select("id, image_public_id")
      .eq("service_id", id);
    const subIds = (subItems || []).map((s) => s.id);

    const publicIds = new Set();
    if (existing.image_public_id) publicIds.add(existing.image_public_id);
    for (const s of subItems || []) if (s.image_public_id) publicIds.add(s.image_public_id);

    const collectOwnerAssets = async (table) => {
      if (!cloudinaryService) return;
      for (const subId of subIds) {
        const { data: rows } = await supabase.from(table).select("image_public_id").eq("service_item_id", subId);
        for (const r of rows || []) if (r.image_public_id) publicIds.add(r.image_public_id);
      }
      const { data: rows } = await supabase.from(table).select("image_public_id").eq("service_id", id);
      for (const r of rows || []) if (r.image_public_id) publicIds.add(r.image_public_id);
    };

    await collectOwnerAssets("service_visual_showcase");
    await collectOwnerAssets("service_cargo_applications");

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      console.error("Admin delete service error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    for (const pid of publicIds) await destroyCloudinaryAsset(pid);

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
    if (!isUuid(id)) return res.status(400).json({ success: false, message: "Invalid sub-service id" });

    const { data: existing } = await supabase
      .from("service_items")
      .select("image_public_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing) return res.status(404).json({ success: false, message: "Sub-service not found" });

    const publicIds = new Set();
    if (existing.image_public_id) publicIds.add(existing.image_public_id);

    for (const table of ["service_visual_showcase", "service_cargo_applications"]) {
      const { data: rows } = await supabase.from(table).select("image_public_id").eq("service_item_id", id);
      for (const r of rows || []) if (r.image_public_id) publicIds.add(r.image_public_id);
    }

    const { error } = await supabase.from("service_items").delete().eq("id", id);
    if (error) {
      console.error("Admin delete service item error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    for (const pid of publicIds) await destroyCloudinaryAsset(pid);

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

    const parentSlug = String(req.body.parentSlug || "").trim().replace(/[^a-z0-9-]/gi, "").toLowerCase();
    let folder = "arrowline/general";
    if (rawFolder === "services") folder = slug ? `arrowline/services/${slug}` : "arrowline/services";
    else if (rawFolder === "sub-services") folder = slug ? (parentSlug ? `arrowline/sub-services/${parentSlug}/${slug}` : `arrowline/sub-services/${slug}`) : parentSlug ? `arrowline/sub-services/${parentSlug}` : "arrowline/sub-services";
    else if (rawFolder === "gallery") folder = "arrowline/gallery";
    else folder = `arrowline/${sanitizeFolder(rawFolder)}`;

    // Cloudinary is the only image store for website media (no Supabase
    // Storage buckets / no permanent local files).
    if (!cloudinaryService) {
      return res.status(503).json({ success: false, message: "Media upload is temporarily unavailable (Cloudinary is not configured)." });
    }

    try {
      const result = await cloudinaryService.upload(req.file.buffer, { folder });
      return res.status(201).json({
        success: true,
        data: {
          path: result.public_id,
          public_id: result.public_id,
          url: result.secure_url || result.url,
          name: req.file.originalname,
          size: result.bytes || req.file.size,
          type: "image",
          width: result.width,
          height: result.height,
          format: result.format,
          provider: "cloudinary",
        },
      });
    } catch (err) {
      logCloudinaryError("Media upload failed", err);
      return res.status(502).json({ success: false, message: CLOUDINARY_UPLOAD_FAILED });
    }
  } catch (err) {
    console.error("Media upload exception:", err);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// GET /api/admin/media/list
router.get("/media/list", requireAdmin, async (req, res) => {
  try {
    const folder = String(req.query.folder || "").trim();
    const searchQuery = String(req.query.search || "").trim().toLowerCase();
    const files = [];

    if (!cloudinaryService) {
      return res.json({ success: true, data: [] });
    }

    try {
      // Only fetch folder(s) the admin asked for ('' or 'all' = everything).
      const requestedFolder = folder && folder !== "all" ? folder : "all";
      const cloudinaryFiles = await cloudinaryService.list({ folder: requestedFolder, maxResults: 200 });
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
      logCloudinaryError("Cloudinary media list failed", err);
    }

    // Search/filter by filename, public_id or folder.
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
    await scan("service_items", "Sub-Service", { hero_image: "text", image_public_id: "text" });
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
    const publicId = String(req.query.public_id || "").trim();

    if (!publicId) {
      return res.status(400).json({ success: false, message: "public_id is required" });
    }
    if (!cloudinaryService) {
      return res.status(503).json({ success: false, message: "Media deletion is unavailable (Cloudinary is not configured)" });
    }

    const result = await cloudinaryService.destroy(publicId);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("Media delete exception:", err);
    return res.status(500).json({ success: false, message: "Deletion failed" });
  }
});

// REPLACE /api/admin/media/:publicId/replace
router.put("/media/:publicId/replace", requireAdmin, upload.single("file"), handleUploadError, async (req, res) => {
  try {
    const publicId = String(req.params.publicId || "").trim();
    if (!publicId) {
      return res.status(400).json({ success: false, message: "public_id is required" });
    }
    if (!publicId.startsWith("arrowline/")) {
      return res.status(400).json({ success: false, message: "Invalid public_id" });
    }
    if (!cloudinaryService) {
      return res.status(503).json({ success: false, message: "Media replacement is unavailable (Cloudinary is not configured)" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const folder = publicId.split("/").slice(0, 2).join("/");
    const result = await cloudinaryService.upload(req.file.buffer, {
      folder,
      public_id: publicId,
      overwrite: true,
    });
    return res.json({
      success: true,
      data: {
        path: result.public_id,
        public_id: result.public_id,
        url: result.secure_url || result.url,
        provider: "cloudinary",
      },
    });
  } catch (err) {
    console.error("Media replace exception:", err);
    return res.status(500).json({ success: false, message: "Replacement failed" });
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
// TRUSTED-NETWORK CRUD (Supabase data + Cloudinary logos)
// =====================================================

// GET /api/admin/trusted-network
router.get("/trusted-network", requireAdmin, async (req, res) => {
  try {
    let query = supabase
      .from("trusted_network")
      .select("*");

    const search = String(req.query.search || "").trim();
    if (search) {
      query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`);
    }

    const statusFilter = String(req.query.status || "").trim();
    if (statusFilter === "published") query = query.eq("is_published", true);
    else if (statusFilter === "draft") query = query.eq("is_published", false);

    const sort = String(req.query.sort || "").trim();
    if (sort === "name") query = query.order("name", { ascending: true });
    else if (sort === "updated") query = query.order("updated_at", { ascending: false, nullsFirst: false });
    else query = query.order("display_order", { ascending: true, nullsFirst: true });

    query = query.order("created_at", { ascending: false, nullsFirst: true });

    const { data, error } = await query;
    if (error) {
      console.error("Admin get trusted-network error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Admin get trusted-network exception:", err);
    return res.status(500).json({ success: false, message: "Failed to load trusted network" });
  }
});

// POST /api/admin/trusted-network (multipart: logo file optional)
router.post("/trusted-network", requireAdmin, trustedLogoUpload.single("logo"), handleUploadError, async (req, res) => {
  try {
    const body = req.body || {};
    const name = String(body.name || "").trim();

    if (!name) {
      return res.status(400).json({ success: false, message: "Company name is required" });
    }
    if (!isValidHttpUrl(body.website)) {
      return res.status(400).json({ success: false, message: "Website must be a valid http(s) URL" });
    }
    if (!req.file && !toStringField(body.logo)) {
      return res.status(400).json({ success: false, message: "Logo is required (upload a file or provide an image URL)" });
    }

    let logoMeta = {};
    if (req.file) {
      if (!cloudinaryService) {
        return res.status(503).json({ success: false, message: "Logo uploads are temporarily unavailable (Cloudinary is not configured)" });
      }
      try {
        logoMeta = await uploadTrustedLogo(req.file);
      } catch (uploadErr) {
        logCloudinaryError("Trusted-network logo upload failed", uploadErr);
        return res.status(502).json({ success: false, message: CLOUDINARY_UPLOAD_FAILED });
      }
    } else {
      logoMeta = { logo: toStringField(body.logo) };
    }

    const record = {
      name,
      category: String(body.category || "").trim(),
      description: String(body.description || "").trim() || null,
      website: String(body.website || "").trim() || null,
      display_order: parseIntField(body.display_order, 0),
      is_published: parseBoolField(body.is_published) ?? false,
      is_featured: parseBoolField(body.is_featured) ?? false,
      logo_alt: String(body.logo_alt || "").trim() || null,
      ...logoMeta,
    };

    const { data, error } = await supabase
      .from("trusted_network")
      .insert([record])
      .select()
      .single();

    if (error) {
      if (logoMeta.logo_public_id) await destroyCloudinaryAsset(logoMeta.logo_public_id);
      console.error("Admin create trusted-network error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("Admin create trusted-network exception:", err);
    return res.status(500).json({ success: false, message: "Failed to create trusted-network entry" });
  }
});

// PUT /api/admin/trusted-network/:id (multipart or JSON; logo replace/clear)
router.put("/trusted-network/:id", requireAdmin, trustedLogoUpload.single("logo"), handleUploadError, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    if (!isValidHttpUrl(body.website)) {
      return res.status(400).json({ success: false, message: "Website must be a valid http(s) URL" });
    }

    const name = String(body.name || "").trim();
    if (name === "") {
      return res.status(400).json({ success: false, message: "Company name is required" });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("trusted_network")
      .select("id, logo, logo_public_id")
      .eq("id", id)
      .maybeSingle();
    if (fetchError) {
      console.error("Admin fetch trusted-network error:", fetchError);
      return res.status(500).json({ success: false, message: fetchError.message });
    }
    if (!existing) {
      return res.status(404).json({ success: false, message: "Trusted-network entry not found" });
    }

    const record = {
      name,
      category: String(body.category || "").trim(),
      description: String(body.description || "").trim() || null,
      website: String(body.website || "").trim() || null,
      display_order: parseIntField(body.display_order, 0),
      is_published: parseBoolField(body.is_published) ?? existing.is_published,
      is_featured: parseBoolField(body.is_featured) ?? existing.is_featured,
      logo_alt: String(body.logo_alt || "").trim() || null,
      updated_at: new Date().toISOString(),
    };

    let oldPublicId = existing.logo_public_id || null;

    if (req.file) {
      if (!cloudinaryService) {
        return res.status(503).json({ success: false, message: "Logo uploads are temporarily unavailable (Cloudinary is not configured)" });
      }
      let logoMeta;
      try {
        logoMeta = await uploadTrustedLogo(req.file);
      } catch (uploadErr) {
        logCloudinaryError("Trusted-network logo replace failed", uploadErr);
        return res.status(502).json({ success: false, message: CLOUDINARY_UPLOAD_FAILED });
      }
      Object.assign(record, logoMeta);
      // Every upload gets a unique Cloudinary public_id, so the previous asset
      // (if any) must be destroyed after the DB write succeeds.
      if (oldPublicId === record.logo_public_id) oldPublicId = null;
    } else if (body.clear_logo === "true" || body.clear_logo === true) {
      record.logo = null;
      record.logo_public_id = null;
      record.logo_format = null;
      record.logo_width = null;
      record.logo_height = null;
      record.logo_resource_type = null;
    } else if (toStringField(body.logo)) {
      // Allow swapping to an external URL without uploading a file.
      record.logo = toStringField(body.logo);
      record.logo_public_id = null;
      record.logo_format = null;
      record.logo_width = null;
      record.logo_height = null;
      record.logo_resource_type = null;
      if (oldPublicId && record.logo !== existing.logo) {
        await destroyCloudinaryAsset(oldPublicId);
        oldPublicId = null;
      }
    }

    const { data, error } = await supabase
      .from("trusted_network")
      .update(record)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Admin update trusted-network error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    if (!data) {
      return res.status(404).json({ success: false, message: "Trusted-network entry not found" });
    }

    if (oldPublicId) {
      await destroyCloudinaryAsset(oldPublicId);
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Admin update trusted-network exception:", err);
    return res.status(500).json({ success: false, message: "Failed to update trusted-network entry" });
  }
});

// PATCH /api/admin/trusted-network/:id/reorder (display_order only, no file handling)
router.patch("/trusted-network/:id/reorder", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const order = parseIntField(req.body?.display_order, 0);

    const { data, error } = await supabase
      .from("trusted_network")
      .update({ display_order: order, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Admin reorder trusted-network error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    if (!data) {
      return res.status(404).json({ success: false, message: "Entry not found" });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Admin reorder trusted-network exception:", err);
    return res.status(500).json({ success: false, message: "Failed to reorder entry" });
  }
});

// DELETE /api/admin/trusted-network/:id
router.delete("/trusted-network/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: existing } = await supabase
      .from("trusted_network")
      .select("logo_public_id")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("trusted_network").delete().eq("id", id);
    if (error) {
      console.error("Admin delete trusted-network error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    let cleanup = "none";
    if (existing?.logo_public_id && cloudinaryService) {
      try {
        const destroyResult = await cloudinaryService.destroy(existing.logo_public_id);
        cleanup = destroyResult?.result === "ok" ? "asset-cleaned" : `asset-${destroyResult?.result || "unknown"}`;
      } catch (err) {
        console.warn("Trusted-network logo cleanup failed:", err?.message || err);
        cleanup = "asset-cleanup-failed";
      }
    }

    return res.json({ success: true, message: "Entry deleted successfully", data: { cleanup } });
  } catch (err) {
    console.error("Admin delete trusted-network exception:", err);
    return res.status(500).json({ success: false, message: "Failed to delete trusted-network entry" });
  }
});

// =====================================================
// VISUAL SHOWCASE CRUD (Supabase metadata + Cloudinary images)
// =====================================================

// A showcase/cargo row must link to EXACTLY ONE owner: a main service or a
// sub-service. Accepts snake_case (DB) and camelCase (Admin UI) keys.
function resolveOwnerLink(body = {}) {
  const serviceId = String(body.service_id ?? body.serviceId ?? "").trim();
  const itemId = String(body.service_item_id ?? body.serviceItemId ?? "").trim();
  return { serviceId, itemId };
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value || ""));
}

// Shared image metadata normalisation for showcase & cargo rows.
// Accepts both snake_case (DB) and camelCase (Admin UI) input keys.
function entityImageFields(body = {}) {
  const out = {};
  if (body.title !== undefined) out.title = toStringField(body.title);
  if (body.alt_text !== undefined) out.alt_text = toStringField(body.alt_text ?? body.altText, null) || null;
  if (body.image_url !== undefined) out.image_url = toStringField(body.image_url ?? body.imageUrl, null) || null;
  if (body.image_public_id !== undefined) out.image_public_id = toStringField(body.image_public_id ?? body.imagePublicId, null) || null;
  if (body.image_format !== undefined) out.image_format = toStringField(body.image_format ?? body.imageFormat, null) || null;
  if (body.image_width !== undefined) out.image_width = parseIntField(body.image_width ?? body.imageWidth, null);
  if (body.image_height !== undefined) out.image_height = parseIntField(body.image_height ?? body.imageHeight, null);
  if (body.image_bytes !== undefined) out.image_bytes = parseIntField(body.image_bytes ?? body.imageBytes, null);
  if (body.display_order !== undefined) out.display_order = parseIntField(body.display_order ?? body.displayOrder, 0);
  if (body.is_published !== undefined) out.is_published = parseBoolField(body.is_published ?? body.isPublished) ?? true;
  return out;
}

// GET /api/admin/showcase?service_id=&service_item_id=
router.get("/showcase", requireAdmin, async (req, res) => {
  try {
    const { service_id, service_item_id, serviceId, serviceItemId } = req.query;
    let query = supabase
      .from("service_visual_showcase")
      .select("*")
      .order("display_order", { ascending: true, nullsFirst: true });

    const svc = String(service_id || serviceId || "").trim();
    const item = String(service_item_id || serviceItemId || "").trim();
    if (svc) query = query.eq("service_id", svc);
    if (item) query = query.eq("service_item_id", item);

    const { data, error } = await query;
    if (error) {
      console.error("Admin get showcase error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Admin get showcase exception:", err);
    return res.status(500).json({ success: false, message: "Failed to load visual showcase" });
  }
});

// POST /api/admin/showcase
router.post("/showcase", requireAdmin, async (req, res) => {
  try {
    const { serviceId, itemId } = resolveOwnerLink(req.body);
    if ((serviceId && itemId) || (!serviceId && !itemId)) {
      return res.status(400).json({ success: false, message: "Showcase image must link to exactly one service or sub-service" });
    }
    if (serviceId && !isUuid(serviceId)) {
      return res.status(400).json({ success: false, message: "Invalid service id" });
    }
    if (itemId && !isUuid(itemId)) {
      return res.status(400).json({ success: false, message: "Invalid sub-service id" });
    }

    const record = entityImageFields(req.body);
    record.caption = toStringField(req.body.caption, null) || null;
    if (!record.image_url) {
      return res.status(400).json({ success: false, message: "image_url is required" });
    }
    if (serviceId) record.service_id = serviceId;
    if (itemId) record.service_item_id = itemId;

    const { data, error } = await supabase
      .from("service_visual_showcase")
      .insert([record])
      .select()
      .single();

    if (error) {
      console.error("Admin create showcase error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("Admin create showcase exception:", err);
    return res.status(500).json({ success: false, message: "Failed to create showcase image" });
  }
});

// PATCH /api/admin/showcase/:id
router.patch("/showcase/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ success: false, message: "Invalid showcase id" });

    const { data: existing } = await supabase
      .from("service_visual_showcase")
      .select("id, image_public_id")
      .eq("id", id)
      .maybeSingle();

    const record = entityImageFields(req.body);
    record.caption = toStringField(req.body.caption, null) || null;
    record.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("service_visual_showcase")
      .update(record)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Admin update showcase error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    if (!data) {
      return res.status(404).json({ success: false, message: "Showcase image not found" });
    }

    // Replace: destroy the old Cloudinary asset only after the new row is saved.
    // Also destroys the old asset when the admin clears the image (null).
    if (existing?.image_public_id && existing.image_public_id !== (record.image_public_id || null)) {
      await destroyCloudinaryAsset(existing.image_public_id);
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Admin update showcase exception:", err);
    return res.status(500).json({ success: false, message: "Failed to update showcase image" });
  }
});

// DELETE /api/admin/showcase/:id
router.delete("/showcase/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ success: false, message: "Invalid showcase id" });

    const { data: existing } = await supabase
      .from("service_visual_showcase")
      .select("image_public_id")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("service_visual_showcase").delete().eq("id", id);
    if (error) {
      console.error("Admin delete showcase error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    let cleanup = "none";
    if (existing?.image_public_id && cloudinaryService) {
      try {
        const destroyResult = await cloudinaryService.destroy(existing.image_public_id);
        cleanup = destroyResult?.result === "ok" ? "asset-cleaned" : `asset-${destroyResult?.result || "unknown"}`;
      } catch (err) {
        console.warn("Showcase image cleanup failed:", err?.message || err);
        cleanup = "asset-cleanup-failed";
      }
    }

    return res.json({ success: true, message: "Showcase image deleted", data: { cleanup } });
  } catch (err) {
    console.error("Admin delete showcase exception:", err);
    return res.status(500).json({ success: false, message: "Failed to delete showcase image" });
  }
});

// =====================================================
// CARGO & APPLICATIONS CRUD (Supabase metadata + Cloudinary images)
// =====================================================

// GET /api/admin/cargo-applications?service_id=&service_item_id=
router.get("/cargo-applications", requireAdmin, async (req, res) => {
  try {
    const { service_id, service_item_id, serviceId, serviceItemId } = req.query;
    let query = supabase
      .from("service_cargo_applications")
      .select("*")
      .order("display_order", { ascending: true, nullsFirst: true });

    const svc = String(service_id || serviceId || "").trim();
    const item = String(service_item_id || serviceItemId || "").trim();
    if (svc) query = query.eq("service_id", svc);
    if (item) query = query.eq("service_item_id", item);

    const { data, error } = await query;
    if (error) {
      console.error("Admin get cargo-applications error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
    return res.json({ success: true, data: data || [] });
  } catch (err) {
    console.error("Admin get cargo-applications exception:", err);
    return res.status(500).json({ success: false, message: "Failed to load cargo & applications" });
  }
});

// POST /api/admin/cargo-applications
router.post("/cargo-applications", requireAdmin, async (req, res) => {
  try {
    const { serviceId, itemId } = resolveOwnerLink(req.body);
    if ((serviceId && itemId) || (!serviceId && !itemId)) {
      return res.status(400).json({ success: false, message: "Cargo application must link to exactly one service or sub-service" });
    }
    if (serviceId && !isUuid(serviceId)) {
      return res.status(400).json({ success: false, message: "Invalid service id" });
    }
    if (itemId && !isUuid(itemId)) {
      return res.status(400).json({ success: false, message: "Invalid sub-service id" });
    }

    const record = entityImageFields(req.body);
    record.description = toStringField(req.body.description);
    if (!record.title) {
      return res.status(400).json({ success: false, message: "Cargo application title is required" });
    }
    if (serviceId) record.service_id = serviceId;
    if (itemId) record.service_item_id = itemId;

    const { data, error } = await supabase
      .from("service_cargo_applications")
      .insert([record])
      .select()
      .single();

    if (error) {
      console.error("Admin create cargo-application error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(201).json({ success: true, data });
  } catch (err) {
    console.error("Admin create cargo-application exception:", err);
    return res.status(500).json({ success: false, message: "Failed to create cargo application" });
  }
});

// PATCH /api/admin/cargo-applications/:id
router.patch("/cargo-applications/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ success: false, message: "Invalid cargo application id" });

    const { data: existing } = await supabase
      .from("service_cargo_applications")
      .select("id, image_public_id")
      .eq("id", id)
      .maybeSingle();

    const record = entityImageFields(req.body);
    record.description = toStringField(req.body.description);
    record.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("service_cargo_applications")
      .update(record)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Admin update cargo-application error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }
    if (!data) {
      return res.status(404).json({ success: false, message: "Cargo application not found" });
    }

    if (existing?.image_public_id && existing.image_public_id !== (record.image_public_id || null)) {
      await destroyCloudinaryAsset(existing.image_public_id);
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Admin update cargo-application exception:", err);
    return res.status(500).json({ success: false, message: "Failed to update cargo application" });
  }
});

// DELETE /api/admin/cargo-applications/:id
router.delete("/cargo-applications/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return res.status(400).json({ success: false, message: "Invalid cargo application id" });

    const { data: existing } = await supabase
      .from("service_cargo_applications")
      .select("image_public_id")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("service_cargo_applications").delete().eq("id", id);
    if (error) {
      console.error("Admin delete cargo-application error:", error);
      return res.status(400).json({ success: false, message: error.message });
    }

    let cleanup = "none";
    if (existing?.image_public_id && cloudinaryService) {
      try {
        const destroyResult = await cloudinaryService.destroy(existing.image_public_id);
        cleanup = destroyResult?.result === "ok" ? "asset-cleaned" : `asset-${destroyResult?.result || "unknown"}`;
      } catch (err) {
        console.warn("Cargo application image cleanup failed:", err?.message || err);
        cleanup = "asset-cleanup-failed";
      }
    }

    return res.json({ success: true, message: "Cargo application deleted", data: { cleanup } });
  } catch (err) {
    console.error("Admin delete cargo-application exception:", err);
    return res.status(500).json({ success: false, message: "Failed to delete cargo application" });
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
  leadership: "leadership",
  "core-values": "core_values",
  "about-images": "about_images",
  "about-pillars": "about_pillars",
  "about-milestones": "about_milestones",
  "about-differentiators": "about_differentiators",
};

const COLLECTION_COLUMNS = {
  industries: ["slug","title","description","icon","cargo_types","image","is_published","display_order"],
  clients: ["name","logo","category","website","is_featured","is_published","display_order"],
  "case-studies": ["slug","client_name","title","industry","location","description","challenge","solution","results","featured_image","images","meta_title","meta_description","is_published","display_order"],
  gallery: ["title","description","category","image","alt_text","is_published","display_order"],
  locations: ["slug","name","state","city","description","address","image","map_url","meta_title","meta_description","is_published","display_order"],
  faqs: ["question","answer","category","is_published","display_order"],
  testimonials: ["customer_name","company","position","testimonial","photo","rating","is_verified","is_published","display_order"],
  "blog-categories": ["name","slug","description","is_published"],
  "blog-posts": ["title","slug","category_id","author","featured_image","excerpt","content","meta_title","meta_description","keywords","published_at","display_order","is_published"],
  "social-videos": ["title","video_url","embed_url","thumbnail","description","platform","is_published","display_order"],
  statistics: ["value","label","description","icon","is_published","display_order"],
  "site-settings": ["setting_key","setting_value","setting_type","is_public"],
  leadership: ["name","role","location","email","bio","image","image_public_id","image_alt","display_order","is_published"],
  "core-values": ["title","description","icon","display_order","is_published"],
  "about-images": ["slot","title","alt_text","image_url","image_public_id","is_published","display_order"],
  "about-pillars": ["icon","title","text","color","is_published","display_order"],
  "about-milestones": ["year","title","text","is_published","display_order"],
  "about-differentiators": ["icon","title","text","accent","is_published","display_order"],
};

function pickColumns(body, allowed) {
  const out = {};
  for (const k of allowed) if (body[k] !== undefined) out[k] = body[k];
  return out;
}

// Generic collections that persist a Cloudinary public_id so the old asset can
// be destroyed when the image is replaced or the record deleted.
const IMAGE_PUBLIC_ID_RESOURCES = new Set(["leadership", "about-images"]);

router.get("/:resource", requireAdmin, async (req, res) => {
  try {
    const { resource } = req.params;
    const table = COLLECTION_TABLE[resource];
    if (!table) return res.status(404).json({ success: false, message: `Unknown collection: ${resource}` });

    let query = supabase.from(table).select("*");

    const search = String(req.query.search || "").trim();
    if (search) {
      const textCols = (COLLECTION_COLUMNS[resource] || [])
        .filter((c) => !/^(is_[a-z_]+|images|cargo_types|display_order|updated_at|created_at|published_at|category_id|is_public|photo|rating|image|logo|featured_image|thumbnail|video_url|embed_url|image_public_id|image_alt|map_url)$/.test(c));
      if (textCols.length) query = query.or(textCols.map((c) => `${c}.ilike.%${search}%`).join(","));
    }

    const statusFilter = String(req.query.status || "").trim();
    if (statusFilter === "published") query = query.eq("is_published", true);
    else if (statusFilter === "draft") query = query.eq("is_published", false);

    // Some collections have no display_order column; order them by a sensible
    // text key instead so PostgREST does not 500 on a missing column.
    if (resource === "site-settings") {
      query = query.order("setting_key", { ascending: true, nullsFirst: true });
    } else if (resource === "blog-categories") {
      query = query.order("name", { ascending: true, nullsFirst: true });
    } else {
      query = query.order("display_order", { ascending: true, nullsFirst: true }).order("created_at", { ascending: false, nullsFirst: true });
    }

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

    let oldPublicId = null;
    if (IMAGE_PUBLIC_ID_RESOURCES.has(resource)) {
      const { data: existing } = await supabase.from(table).select("image_public_id").eq("id", id).maybeSingle();
      oldPublicId = existing?.image_public_id || null;
    }

    const body = pickColumns(toSnakeCaseKeys(req.body), COLLECTION_COLUMNS[resource]);
    body.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from(table).update(body).eq("id", id).select().maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: "Record not found" });

    if (oldPublicId && oldPublicId !== (data.image_public_id || null)) {
      await destroyCloudinaryAsset(oldPublicId);
    }

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

    let oldPublicId = null;
    if (IMAGE_PUBLIC_ID_RESOURCES.has(resource)) {
      const { data: existing } = await supabase.from(table).select("image_public_id").eq("id", id).maybeSingle();
      oldPublicId = existing?.image_public_id || null;
    }

    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;

    if (oldPublicId) await destroyCloudinaryAsset(oldPublicId);

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