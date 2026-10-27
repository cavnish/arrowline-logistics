#!/usr/bin/env node
/**
 * Production-like preview server for the prerendered dist/ output.
 *
 * `vite preview` runs in SPA mode, so extensionless URLs such as /about fall
 * back to the root shell. Real static hosts (Vercel, nginx, Express in
 * server/index.js) resolve the prerendered directory index first. This server
 * mirrors that behaviour so direct-URL / refresh behaviour can be tested
 * locally without deploying.
 *
 * Usage: node scripts/preview.mjs [--port 4173] [--host 127.0.0.1]
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const args = process.argv.slice(2);
function argValue(name, fallback) {
  const index = args.indexOf(name);
  if (index !== -1 && args[index + 1]) return args[index + 1];
  const inline = args.find((value) => value.startsWith(`${name}=`));
  return inline ? inline.slice(name.length + 1) : fallback;
}

const PORT = Number(argValue("--port", process.env.PORT || 4173));
const HOST = argValue("--host", "127.0.0.1");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".webmanifest": "application/manifest+json",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  res.end(body);
}

function resolveFile(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  if (decoded.includes("\0")) return null;

  const relative = decoded.replace(/^\/+/, "");
  const base = path.resolve(DIST, relative);
  if (base !== DIST && !base.startsWith(`${DIST}${path.sep}`)) return null;

  const candidates = [];
  if (!relative) {
    candidates.push(path.join(DIST, "index.html"));
  } else if (decoded.endsWith("/")) {
    candidates.push(path.join(base, "index.html"));
  } else {
    candidates.push(base, `${base}.html`, path.join(base, "index.html"));
  }

  for (const candidate of candidates) {
    try {
      const stat = fs.statSync(candidate);
      if (stat.isDirectory()) {
        const index = path.join(candidate, "index.html");
        if (fs.existsSync(index)) return index;
      } else if (stat.isFile()) {
        return candidate;
      }
    } catch {
      // Try the next candidate.
    }
  }
  return null;
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = new URL(req.url || "/", "http://localhost").pathname;
  } catch {
    return send(res, 400, "Bad request");
  }

  // No backend in this local static preview.
  if (pathname.startsWith("/api/")) {
    res.setHeader("Cache-Control", "no-store");
    return send(
      res,
      503,
      JSON.stringify({ ok: false, error: "Backend is not part of the static preview" }),
      { "Content-Type": "application/json; charset=utf-8" }
    );
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return send(res, 405, "Method not allowed");
  }

  // Canonical services hub.
  if (pathname === "/services" || pathname === "/services/") {
    res.writeHead(308, { Location: "/services/road-transportation" });
    return res.end();
  }

  const file = resolveFile(pathname);
  if (!file) {
    // Admin and unknown SPA routes fall back to the root shell, matching the
    // Vercel catch-all rewrite. Public prerendered routes resolve above first.
    const shell = path.join(DIST, "index.html");
    if (fs.existsSync(shell) && (pathname === "/admin" || pathname.startsWith("/admin/") || !path.extname(pathname))) {
      const body = fs.readFileSync(shell);
      return send(res, 200, req.method === "HEAD" ? undefined : body, {
        "Content-Type": TYPES[".html"],
        "Content-Length": body.length,
        "Cache-Control": "no-cache",
      });
    }
    return send(res, 404, "Not found");
  }

  const body = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  const isAsset = file.includes(`${path.sep}assets${path.sep}`);
  res.writeHead(200, {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Content-Length": body.length,
    "Cache-Control": isAsset ? "public, max-age=31536000, immutable" : "no-cache",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(req.method === "HEAD" ? undefined : body);
});

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.error("[preview] dist/index.html is missing. Run `npm run build` first.");
  process.exit(1);
}

server.listen(PORT, HOST, () => {
  console.log(`[preview] Serving prerendered dist/ at http://${HOST}:${PORT}`);
  console.log("[preview] Direct URLs (/about, /services/...) resolve their prerendered files.");
});
