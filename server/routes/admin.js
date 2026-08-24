import { Router } from "express";
import { requireAdmin } from "../middleware/adminAuth.js";
import { getContent, getEnquiries, getEnquiry, getStats, updateContent, updateEnquiry } from "../services/adminApi.js";

function safeError(res, error) {
  const status = error.status || 500;
  if (status >= 500) console.error("Admin API error:", error.message);
  return res.status(status).json({ ok: false, error: status >= 500 ? "Unable to complete this request" : error.message });
}

export function createAdminRouter({ supabase }) {
  const router = Router();
  router.use(requireAdmin(supabase));

  router.get("/me", (req, res) => res.json({ ok: true, data: req.admin }));
  router.post("/logout", (_req, res) => res.status(204).end());

  router.get("/stats", async (_req, res) => {
    try { res.json({ ok: true, data: await getStats(supabase) }); } catch (error) { safeError(res, error); }
  });
  router.get("/enquiries", async (req, res) => {
    try { const result = await getEnquiries(supabase, req.query); res.json({ ok: true, ...result }); } catch (error) { safeError(res, error); }
  });
  router.get("/enquiries/:id", async (req, res) => {
    try {
      const data = await getEnquiry(supabase, req.params.id);
      if (!data) return res.status(404).json({ ok: false, error: "Inquiry not found" });
      return res.json({ ok: true, data });
    } catch (error) { return safeError(res, error); }
  });
  router.patch("/enquiries/:id", async (req, res) => {
    try {
      const data = await updateEnquiry(supabase, req.params.id, req.body);
      if (!data) return res.status(404).json({ ok: false, error: "Inquiry not found" });
      return res.json({ ok: true, data });
    } catch (error) { return safeError(res, error); }
  });
  router.patch("/enquiries/:id/status", async (req, res) => {
    try { return res.json({ ok: true, data: await updateEnquiry(supabase, req.params.id, { status: req.body?.status }) }); } catch (error) { return safeError(res, error); }
  });
  router.patch("/enquiries/:id/priority", async (req, res) => {
    try { return res.json({ ok: true, data: await updateEnquiry(supabase, req.params.id, { priority: req.body?.priority }) }); } catch (error) { return safeError(res, error); }
  });
  router.patch("/enquiries/:id/assignment", async (req, res) => {
    try { return res.json({ ok: true, data: await updateEnquiry(supabase, req.params.id, { assigned_to: req.body?.assigned_to }) }); } catch (error) { return safeError(res, error); }
  });
  router.patch("/enquiries/:id/archive", async (req, res) => {
    try { return res.json({ ok: true, data: await updateEnquiry(supabase, req.params.id, { archived: Boolean(req.body?.archived) }) }); } catch (error) { return safeError(res, error); }
  });
  router.get("/content", async (_req, res) => {
    try { res.json({ ok: true, data: await getContent(supabase) }); } catch (error) { safeError(res, error); }
  });
  router.put("/content/:key", async (req, res) => {
    try { res.json({ ok: true, data: await updateContent(supabase, req.params.key, req.body, req.admin.id) }); } catch (error) { safeError(res, error); }
  });
  return router;
}
