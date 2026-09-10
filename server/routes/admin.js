import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import { createClient } from "@supabase/supabase-js";

import {
  requireAdmin,
  generateAdminToken,
} from "../middleware/adminAuth.js";

const router = express.Router();

router.use(cookieParser());

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

export function createAdminRouter() {
  return router;
}

export default router;