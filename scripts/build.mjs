#!/usr/bin/env node
/**
 * Production build orchestrator.
 *
 * Order matters: the published-content snapshot is validated (or refreshed)
 * BEFORE Vite runs, so a broken export can never be baked into a deployment.
 * The last successfully deployed Vercel build stays live whenever a later
 * build fails here.
 *
 * Modes (environment variables):
 *   (default)                  Validate the committed snapshot and reuse it.
 *   CONTENT_EXPORT_LIVE=1      Try a live Supabase export, keep the committed
 *                              snapshot if Supabase is unavailable.
 *   CONTENT_EXPORT_STRICT=1    Require a successful live export. Used by the
 *                              "Publish content" flow so a Supabase outage
 *                              fails the deploy instead of shipping stale data.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SSR_DIR = path.join(ROOT, "dist-ssr");
const SNAPSHOT_FILE = path.join(ROOT, "src", "data", "content-snapshot.json");

const strict = process.env.CONTENT_EXPORT_STRICT === "1";
const live = strict || process.env.CONTENT_EXPORT_LIVE === "1";
const mode = strict ? "strict-live" : live ? "soft-live" : "committed-snapshot";

const steps = [];
let logBuffer = "";

function log(line = "") {
  logBuffer += `${line}\n`;
  console.log(line);
}

function fail(message) {
  console.error(`\n[build] ERROR: ${message}`);
  console.error(`[build] Deployment aborted. Previous deployed version remains live.`);
  process.exit(1);
}

function run(label, command, args, extraEnv = {}) {
  log(`\n[build] ▶ ${label}`);
  log(`[build]   ${command} ${args.join(" ")}`);
  const startedAt = Date.now();
  const result = spawnSync(command, args, {
    cwd: ROOT,
    env: { ...process.env, ...extraEnv },
    stdio: "inherit",
    shell: false,
  });
  const durationMs = Date.now() - startedAt;

  if (result.error) {
    steps.push({ label, durationMs, status: "failed", error: result.error.message });
    fail(`${label} could not start: ${result.error.message}`);
  }
  if (result.status !== 0) {
    steps.push({ label, durationMs, status: "failed", exitCode: result.status });
    fail(`${label} exited with code ${result.status}`);
  }

  steps.push({ label, durationMs, status: "ok" });
  log(`[build] ✔ ${label} (${(durationMs / 1000).toFixed(1)}s)`);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function nodeBin(relative) {
  const full = path.join(ROOT, relative);
  if (!fs.existsSync(full)) fail(`Missing local binary ${relative}. Run npm install.`);
  return full;
}

function main() {
  const startedAt = Date.now();
  log("[build] Arrowline Logistics static build");
  log(`[build] Content mode: ${mode}`);

  if (!fs.existsSync(SNAPSHOT_FILE)) {
    fail("src/data/content-snapshot.json is missing. Run `npm run content:export` first.");
  }

  // 1. Published-content snapshot. Strict publishing fetches fresh rows; normal
  //    builds only verify the committed snapshot (no network required).
  if (live) {
    const args = ["scripts/export-content.mjs"];
    if (!strict) args.push("--soft");
    run(
      strict ? "Export published content (strict live)" : "Refresh published content (soft live)",
      process.execPath,
      args
    );
  } else {
    run("Validate committed content snapshot", process.execPath, [
      "scripts/export-content.mjs",
      "--check",
    ]);
  }

  // Re-validate after any live export so the rest of the build uses a known
  // good snapshot, even in soft mode.
  run("Re-validate content snapshot", process.execPath, [
    "scripts/export-content.mjs",
    "--check",
  ]);

  const snapshot = readJson(SNAPSHOT_FILE);
  if (!snapshot.contentVersion || !snapshot.checksum) {
    fail("Snapshot is missing contentVersion/checksum metadata");
  }

  // 2. TypeScript gate (strict mode; no ESLint config exists in this repo).
  run("TypeScript typecheck", process.execPath, [nodeBin("node_modules/typescript/bin/tsc"), "--noEmit"]);

  // 3. Client bundle.
  run("Client build (Vite)", process.execPath, [nodeBin("node_modules/vite/bin/vite.js"), "build"]);

  // 4. Server bundle used only to render HTML at build time.
  fs.rmSync(SSR_DIR, { recursive: true, force: true });
  run("SSR build (Vite)", process.execPath, [
    nodeBin("node_modules/vite/bin/vite.js"),
    "build",
    "--ssr",
    "src/entry-server.tsx",
    "--outDir",
    "dist-ssr",
    "--emptyOutDir",
  ]);

  // 5. Per-route HTML + sitemap + content-version markers.
  run("Prerender routes", process.execPath, ["scripts/prerender.mjs"]);

  // 6. Fail the build if any route/meta/asset/secret check regresses.
  run("Verify static output", process.execPath, ["scripts/verify-build.mjs"]);

  let prerenderManifest = null;
  try {
    prerenderManifest = readJson(path.join(DIST, "prerender-manifest.json"));
  } catch {
    fail("dist/prerender-manifest.json was not generated");
  }

  const report = {
    ok: true,
    kind: "arrowline-static-build",
    contentMode: mode,
    contentVersion: snapshot.contentVersion,
    schemaVersion: snapshot.schemaVersion,
    generatedAt: snapshot.generatedAt,
    checksum: snapshot.checksum,
    snapshotSource: snapshot.source,
    totalRecords: prerenderManifest.totalRecords ?? null,
    routes: prerenderManifest.routes?.length ?? null,
    builtAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    node: process.version,
    steps,
    artifacts: {
      html: "dist/**/index.html",
      sitemap: "dist/sitemap.xml",
      contentVersion: "dist/content-version.json",
      prerenderManifest: "dist/prerender-manifest.json",
    },
  };

  fs.writeFileSync(
    path.join(DIST, "build-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8"
  );

  log("");
  log("[build] ✅ Build complete");
  log(`[build]    Content version: ${report.contentVersion}`);
  log(`[build]    Checksum:        ${report.checksum}`);
  log(`[build]    Routes:          ${report.routes}`);
  log(`[build]    Duration:        ${(report.durationMs / 1000).toFixed(1)}s`);
  log(`[build]    Deployed marker: /content-version.json`);
}

main();
