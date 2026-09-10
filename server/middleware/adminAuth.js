import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_API_KEY;

if (!JWT_SECRET) {
  console.error("❌ ADMIN_API_KEY is missing in .env");
  process.exit(1);
}

export function generateAdminToken() {
  return jwt.sign(
    {
      role: "admin",
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

export function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded?.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.admin = true;
    next();
  } catch (error) {
    console.error("Admin authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Session expired or invalid",
    });
  }
}