/**
 * VERCEL SERVERLESS FUNCTION — GET /api/health
 *
 * Simple health-check endpoint. Used by the frontend to display
 * a "backend connected" status badge.
 */
import mongoose from "mongoose";

let cachedConnection = null;

async function connectToMongo() {
  if (cachedConnection && mongoose.connection.readyState === 1) return cachedConnection;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");
  cachedConnection = await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  });
  return cachedConnection;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");

  const status = {
    service: "Arrowline Logistics API",
    version: "1.0.0",
    ok: true,
    checks: {
      mongo: "unknown",
      smtp: "unknown",
    },
    timestamp: new Date().toISOString(),
  };

  // Check MongoDB
  try {
    await connectToMongo();
    status.checks.mongo = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  } catch (err) {
    status.checks.mongo = `error: ${err.message}`;
    status.ok = false;
  }

  // Check SMTP config presence
  status.checks.smtp =
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
      ? "configured"
      : "missing";

  return res.status(status.ok ? 200 : 503).json(status);
}
