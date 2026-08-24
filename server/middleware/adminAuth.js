function configuredAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function requireAdmin(supabase) {
  return async (req, res, next) => {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return res.status(401).json({ ok: false, error: "Authentication required" });
    }

    try {
      const { data, error } = await supabase.auth.getUser(match[1]);
      if (error || !data.user) {
        return res.status(401).json({ ok: false, error: "Invalid or expired session" });
      }

      const email = data.user.email?.toLowerCase() || "";
      const allowedEmails = configuredAdminEmails();
      const hasAdminRole = data.user.app_metadata?.role === "admin";
      const isAllowed = hasAdminRole || allowedEmails.includes(email);

      if (!isAllowed) {
        return res.status(403).json({ ok: false, error: "Administrator access is required" });
      }

      req.admin = { id: data.user.id, email };
      return next();
    } catch (error) {
      console.error("Admin authentication failed:", error.message);
      return res.status(401).json({ ok: false, error: "Unable to verify session" });
    }
  };
}
