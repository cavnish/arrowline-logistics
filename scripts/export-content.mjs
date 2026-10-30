#!/usr/bin/env node
/**
 * Arrowline Logistics - published content exporter
 * ------------------------------------------------------------------
 * Reads ONLY published/public rows from Supabase REST into a validated,
 * versioned static snapshot used by the build-time renderer.
 *
 * Guarantees:
 *  - Paginates until every row has been read (never truncates at 1000).
 *  - Filters drafts (`is_published`) and private settings (`is_public`).
 *  - Validates required fields, asset URLs, slugs and relationships.
 *  - Writes atomically. A failed/incomplete export never overwrites a
 *    previously valid snapshot.
 *  - Emits a manifest with schema version, timestamp, counts and checksum.
 *
 * Usage:
 *   node scripts/export-content.mjs                # live export (fails hard)
 *   node scripts/export-content.mjs --soft         # keep last good snapshot on failure
 *   node scripts/export-content.mjs --check        # validate existing snapshot only
 *   node scripts/export-content.mjs --from-file tmp_live.json
 *   node scripts/export-content.mjs --remote URL   # read the public backend snapshot
 *   node scripts/export-content.mjs --source supabase|remote
 *
 * Source selection (when not --from-file):
 *   1. `CONTENT_EXPORT_SOURCE_URL` / `--remote` -> public backend snapshot.
 *   2. Supabase credentials present -> direct Supabase read.
 *   3. Otherwise -> the production backend snapshot URL.
 *
 * The service-role key is read from the server environment only. It is never
 * written to the snapshot or to any browser bundle. The remote fallback exists
 * so Vercel builds can refresh content without holding that secret.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SNAPSHOT_FILE = path.join(ROOT, "src", "data", "content-snapshot.json");
const MANIFEST_FILE = path.join(ROOT, "src", "data", "content-snapshot.manifest.json");
const SCHEMA_VERSION = 1;
const PAGE_SIZE = 1000;
const DEFAULT_REMOTE_URL = "https://arrowline-logistics.onrender.com";
const REMOTE_TIMEOUT_MS = 90_000;
const REMOTE_ATTEMPTS = 4;
const REMOTE_RETRY_DELAYS_MS = [10_000, 20_000, 30_000];

/**
 * Tables exported into the public snapshot. `filter` is the column that marks
 * a row as publicly visible. Everything else must never be exported.
 */
const TABLES = [
  { name: "site_content", filter: "is_published" },
  { name: "site_settings", filter: "is_public" },
  { name: "services", filter: "is_published" },
  { name: "service_items", filter: "is_published" },
  { name: "service_faqs", filter: "is_published" },
  { name: "service_process_steps", filter: "is_published" },
  { name: "service_visual_showcase", filter: "is_published" },
  { name: "service_cargo_applications", filter: "is_published" },
  { name: "industries", filter: "is_published" },
  { name: "clients", filter: "is_published" },
  { name: "trusted_network", filter: "is_published" },
  { name: "about_images", filter: "is_published" },
  { name: "about_pillars", filter: "is_published" },
  { name: "about_milestones", filter: "is_published" },
  { name: "about_differentiators", filter: "is_published" },
  { name: "leadership", filter: "is_published" },
  { name: "core_values", filter: "is_published" },
  { name: "testimonials", filter: "is_published" },
  { name: "faqs", filter: "is_published" },
  { name: "statistics", filter: "is_published" },
  { name: "blog_categories", filter: "is_published" },
  { name: "blog_posts", filter: "is_published" },
  { name: "gallery_items", filter: "is_published" },
  { name: "case_studies", filter: "is_published" },
  { name: "social_videos", filter: "is_published" },
  { name: "locations", filter: "is_published" },
];

/** Tables that must contain at least one row for a deployment to be safe. */
const REQUIRED_NON_EMPTY = ["site_content", "site_settings", "services"];

/** Required scalar fields per table. Empty strings are only allowed where noted. */
const REQUIRED_FIELDS = {
  site_content: ["id", "content_key"],
  site_settings: ["id", "setting_key"],
  services: ["id", "slug", "title", "hero_image"],
  service_items: ["id", "service_id", "slug", "title", "hero_image"],
  service_faqs: ["id", "question", "answer"],
  service_process_steps: ["id", "step", "title", "description"],
  service_visual_showcase: ["id", "image_url"],
  service_cargo_applications: ["id", "title"],
  industries: ["id", "slug", "title", "description"],
  clients: ["id", "name", "logo"],
  trusted_network: ["id", "name", "logo"],
  about_images: ["id", "slot", "image_url"],
  about_pillars: ["id", "title", "text"],
  about_milestones: ["id", "year", "title", "text"],
  about_differentiators: ["id", "title", "text"],
  leadership: ["id", "name", "image"],
  core_values: ["id", "title", "description"],
  testimonials: ["id", "customer_name", "testimonial"],
  faqs: ["id", "question", "answer"],
  statistics: ["id", "value", "label"],
  gallery_items: ["id", "title", "image"],
  case_studies: ["id", "slug", "title"],
  locations: ["id", "slug", "name"],
};

/** Fields that must be absolute http(s) URLs when present. */
const URL_FIELDS = [
  "hero_image",
  "hero_video",
  "hero_fallback_image",
  "about_image",
  "image",
  "image_url",
  "logo",
  "featured_image",
  "photo",
  "video_url",
  "video_poster",
  "og_image",
  "map_url",
];

/** Slug uniqueness per table. */
const UNIQUE_SLUGS = {
  services: "slug",
  service_items: "slug",
  industries: "slug",
  case_studies: "slug",
  locations: "slug",
};

const RELATIONSHIPS = [
  { table: "service_items", field: "service_id", target: "services", required: true },
  { table: "service_faqs", field: "service_id", target: "services", required: false },
  { table: "service_faqs", field: "service_item_id", target: "service_items", required: false },
  { table: "service_process_steps", field: "service_id", target: "services", required: false },
  { table: "service_process_steps", field: "service_item_id", target: "service_items", required: false },
  { table: "service_visual_showcase", field: "service_id", target: "services", required: false },
  { table: "service_visual_showcase", field: "service_item_id", target: "service_items", required: false },
  { table: "service_cargo_applications", field: "service_id", target: "services", required: false },
  { table: "service_cargo_applications", field: "service_item_id", target: "service_items", required: false },
];

class ExportError extends Error {}

function parseArgs(argv) {
  const args = {
    soft: false,
    check: false,
    fromFile: null,
    remote: null,
    source: null,
    out: SNAPSHOT_FILE,
    manifest: MANIFEST_FILE,
    verbose: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--soft") args.soft = true;
    else if (arg === "--check") args.check = true;
    else if (arg === "--verbose") args.verbose = true;
    else if (arg === "--from-file") args.fromFile = argv[++i];
    else if (arg.startsWith("--from-file=")) args.fromFile = arg.split("=")[1];
    else if (arg === "--remote") args.remote = argv[++i];
    else if (arg.startsWith("--remote=")) args.remote = arg.split("=")[1];
    else if (arg === "--source") args.source = argv[++i];
    else if (arg.startsWith("--source=")) args.source = arg.split("=")[1];
    else if (arg === "--out") args.out = path.resolve(argv[++i]);
    else if (arg.startsWith("--out=")) args.out = path.resolve(arg.split("=")[1]);
    else if (arg === "--manifest") args.manifest = path.resolve(argv[++i]);
    else if (arg.startsWith("--manifest=")) args.manifest = path.resolve(arg.split("=")[1]);
    else if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: node scripts/export-content.mjs [--soft] [--check] [--from-file file.json] [--remote url] [--source supabase|remote] [--out file] [--manifest file] [--verbose]"
      );
      process.exit(0);
    } else {
      throw new ExportError(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

/** Minimal .env reader (does not override real process env / CI secrets). */
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function loadEnvironment() {
  loadEnvFile(path.join(ROOT, ".env"));
  loadEnvFile(path.join(ROOT, ".env.production"));
  loadEnvFile(path.join(ROOT, "server", ".env"));
}

function log(...parts) {
  console.log("[export-content]", ...parts);
}

function warn(...parts) {
  console.warn("[export-content] WARN:", ...parts);
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value ?? null);
}

function isPublished(row, filter) {
  const value = row?.[filter];
  return value === true || value === "true" || value === 1 || value === "1";
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isAbsoluteHttpUrl(value) {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isSafeAssetUrl(value) {
  if (!isNonEmptyString(value)) return false;
  if (value.startsWith("/")) return true;
  return isAbsoluteHttpUrl(value);
}

function normalizeRows(table, rows, filter) {
  if (!Array.isArray(rows)) {
    throw new ExportError(`Table ${table} did not return an array`);
  }
  const published = rows.filter((row) => isPublished(row, filter));
  return published.sort((a, b) => {
    const orderA = Number(a?.display_order ?? 0);
    const orderB = Number(b?.display_order ?? 0);
    if (Number.isFinite(orderA) && Number.isFinite(orderB) && orderA !== orderB) {
      return orderA - orderB;
    }
    return String(a?.slug || a?.content_key || a?.setting_key || a?.id || "").localeCompare(
      String(b?.slug || b?.content_key || b?.setting_key || b?.id || "")
    );
  });
}

function validateSnapshot(tables) {
  const errors = [];
  const warnings = [];

  for (const table of REQUIRED_NON_EMPTY) {
    if (!Array.isArray(tables[table]) || tables[table].length === 0) {
      errors.push(`Required table ${table} is empty`);
    }
  }

  for (const [table, fields] of Object.entries(REQUIRED_FIELDS)) {
    const rows = tables[table] || [];
    rows.forEach((row, index) => {
      for (const field of fields) {
        if (!isNonEmptyString(row?.[field]) && !(typeof row?.[field] === "number")) {
          errors.push(`${table}[${index}] missing required field "${field}"`);
        }
      }
      for (const field of URL_FIELDS) {
        if (!(field in row)) continue;
        const value = row[field];
        if (value === null || value === undefined || value === "") continue;
        if (!isSafeAssetUrl(value)) {
          errors.push(`${table}[${index}] invalid URL in "${field}": ${String(value).slice(0, 120)}`);
        }
      }
    });
  }

  // Unique IDs inside every table.
  for (const [table, rows] of Object.entries(tables)) {
    const ids = new Set();
    for (const row of rows || []) {
      if (!row?.id) continue;
      if (ids.has(row.id)) errors.push(`${table} has duplicate id ${row.id}`);
      ids.add(row.id);
    }
  }

  // Unique slugs where the public URL depends on them.
  for (const [table, field] of Object.entries(UNIQUE_SLUGS)) {
    const seen = new Map();
    for (const row of tables[table] || []) {
      const slug = row?.[field];
      if (!isNonEmptyString(slug)) continue;
      const key = String(slug).trim();
      if (seen.has(key)) {
        errors.push(`${table} has duplicate ${field} "${key}"`);
      }
      seen.set(key, row.id);
    }
  }

  // Relationship integrity across published rows only.
  for (const relationship of RELATIONSHIPS) {
    const sourceRows = tables[relationship.table] || [];
    const targetIds = new Set((tables[relationship.target] || []).map((row) => row.id));
    for (const row of sourceRows) {
      const value = row?.[relationship.field];
      if (value === null || value === undefined || value === "") continue;
      if (!targetIds.has(value)) {
        errors.push(
          `${relationship.table}.${relationship.field} references missing row ${value} in ${relationship.target}`
        );
      }
    }
  }

  // A published service must be routable.
  const serviceIdsWithItems = new Set(
    (tables.service_items || []).map((row) => row.service_id).filter(Boolean)
  );
  for (const service of tables.services || []) {
    if (!serviceIdsWithItems.has(service.id)) {
      warnings.push(`Service ${service.slug} has no published sub-services`);
    }
  }

  // Content keys must be unique so overrides are deterministic.
  const contentKeys = new Set();
  for (const row of tables.site_content || []) {
    const key = String(row.content_key || "");
    if (contentKeys.has(key)) errors.push(`site_content has duplicate content_key "${key}"`);
    contentKeys.add(key);
  }
  const settingKeys = new Set();
  for (const row of tables.site_settings || []) {
    const key = String(row.setting_key || "");
    if (settingKeys.has(key)) errors.push(`site_settings has duplicate setting_key "${key}"`);
    settingKeys.add(key);
  }

  return { errors, warnings };
}

function buildSnapshot(tables, source) {
  const canonicalTables = {};
  for (const table of TABLES) {
    canonicalTables[table.name] = tables[table.name] || [];
  }

  const checksum = sha256(stableStringify(canonicalTables));
  const generatedAt = new Date().toISOString();
  const contentVersion = `${generatedAt.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}-${checksum.slice(0, 8)}`;
  const counts = Object.fromEntries(
    Object.entries(canonicalTables).map(([table, rows]) => [table, rows.length])
  );

  const snapshot = {
    schemaVersion: SCHEMA_VERSION,
    contentVersion,
    generatedAt,
    source,
    checksum,
    tables: canonicalTables,
  };

  const manifest = {
    schemaVersion: SCHEMA_VERSION,
    contentVersion,
    generatedAt,
    source,
    checksum,
    totalRecords: Object.values(counts).reduce((sum, count) => sum + count, 0),
    counts,
    files: {
      snapshot: "src/data/content-snapshot.json",
      manifest: "src/data/content-snapshot.manifest.json",
    },
  };

  return { snapshot, manifest };
}

function readExistingSnapshot(file) {
  try {
    if (!fs.existsSync(file)) return null;
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!parsed?.tables) return null;
    return parsed;
  } catch {
    return null;
  }
}

function atomicWrite(file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temp, contents, "utf8");
  fs.renameSync(temp, file);
}

function formatErrors(errors) {
  return errors.map((error) => `  - ${error}`).join("\n");
}

async function fetchTableLive(table) {
  const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    "";
  if (!supabaseUrl || !key) {
    throw new ExportError(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) are required for a live export"
    );
  }

  const rows = [];
  let offset = 0;
  for (;;) {
    const url = new URL(`${supabaseUrl}/rest/v1/${table.name}`);
    url.searchParams.set("select", "*");
    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("order", "id.asc");

    const response = await fetch(url, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
        "Accept-Profile": "public",
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new ExportError(
        `Supabase read failed for ${table.name}: HTTP ${response.status} ${body.slice(0, 300)}`
      );
    }

    const page = await response.json();
    if (!Array.isArray(page)) {
      throw new ExportError(`Supabase returned a non-array response for ${table.name}`);
    }
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
    if (offset > 500000) {
      throw new ExportError(`Pagination safety limit hit for ${table.name}`);
    }
  }

  return normalizeRows(table.name, rows, table.filter);
}

function hasSupabaseCredentials() {
  const url = (process.env.SUPABASE_URL || "").trim();
  const key = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    ""
  ).trim();
  return Boolean(url && key);
}

function selectSource(args) {
  const requested = String(args.source || "").trim().toLowerCase();
  if (requested && requested !== "supabase" && requested !== "remote") {
    throw new ExportError(`Unknown --source "${args.source}" (expected supabase or remote)`);
  }

  const remoteUrl =
    args.remote ||
    process.env.CONTENT_EXPORT_SOURCE_URL ||
    process.env.CONTENT_EXPORT_API_URL ||
    "";

  if (args.fromFile) return { kind: "file", value: args.fromFile };
  if (requested === "remote" || remoteUrl) {
    return { kind: "remote", value: remoteUrl || DEFAULT_REMOTE_URL };
  }
  if (requested === "supabase") return { kind: "supabase" };
  if (hasSupabaseCredentials()) return { kind: "supabase" };
  return { kind: "remote", value: DEFAULT_REMOTE_URL };
}

async function collectLive() {
  const tables = {};
  for (const table of TABLES) {
    const rows = await fetchTableLive(table);
    tables[table.name] = rows;
    log(`${table.name}: ${rows.length} published row(s)`);
  }
  return { tables, source: "supabase-live" };
}

/**
 * Reads the same published snapshot from a running Arrowline backend.
 *
 * This is the fallback used by Vercel builds: the backend already holds the
 * Supabase credentials, so the build only needs a public URL, never the
 * service-role key. Retries cover Render cold starts.
 */
async function collectRemote(baseUrl) {
  const trimmed = String(baseUrl || DEFAULT_REMOTE_URL).trim().replace(/\/+$/, "");
  const endpoint = /\/api\/content\/snapshot$/.test(trimmed)
    ? trimmed
    : `${trimmed}/api/content/snapshot`;

  let lastError = null;
  for (let attempt = 1; attempt <= REMOTE_ATTEMPTS; attempt += 1) {
    try {
      log(`Fetching published snapshot from ${endpoint} (attempt ${attempt}/${REMOTE_ATTEMPTS})`);
      const response = await fetch(endpoint, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(REMOTE_TIMEOUT_MS),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new ExportError(
          `Remote snapshot failed: HTTP ${response.status} ${body.slice(0, 200)}`
        );
      }

      const body = await response.json();
      const payload = body?.data ?? body;
      const remoteTables = payload?.tables ?? payload;
      if (!remoteTables || typeof remoteTables !== "object" || Array.isArray(remoteTables)) {
        throw new ExportError("Remote snapshot did not contain a tables object");
      }

      const tables = {};
      for (const table of TABLES) {
        const rows = remoteTables[table.name];
        if (rows === undefined) {
          warn(`remote snapshot is missing table ${table.name}; exporting []`);
          tables[table.name] = [];
          continue;
        }
        tables[table.name] = normalizeRows(table.name, rows, table.filter);
      }

      let sourceHost = endpoint;
      try {
        sourceHost = new URL(endpoint).host;
      } catch {
        // Keep the raw endpoint for display when it is a relative URL.
      }
      return { tables, source: `remote:${sourceHost}` };
    } catch (error) {
      lastError = error;
      if (attempt < REMOTE_ATTEMPTS) {
        const delay = REMOTE_RETRY_DELAYS_MS[attempt - 1] ?? 30_000;
        warn(`${error instanceof Error ? error.message : error} — retrying in ${Math.round(delay / 1000)}s`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new ExportError(String(lastError));
}

function collectFromFile(file) {
  const absolute = path.resolve(process.cwd(), file);
  if (!fs.existsSync(absolute)) {
    throw new ExportError(`Fixture file not found: ${absolute}`);
  }
  const parsed = JSON.parse(fs.readFileSync(absolute, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ExportError("Fixture must be an object mapping table names to arrays");
  }
  const tables = {};
  for (const table of TABLES) {
    const rows = parsed[table.name];
    if (rows === undefined) {
      warn(`fixture is missing table ${table.name}; exporting []`);
      tables[table.name] = [];
      continue;
    }
    tables[table.name] = normalizeRows(table.name, rows, table.filter);
  }
  return { tables, source: `fixture:${path.basename(absolute)}` };
}

function printSummary(tables) {
  const counts = Object.fromEntries(
    TABLES.map((table) => [table.name, (tables[table.name] || []).length])
  );
  for (const [name, count] of Object.entries(counts)) {
    if (count > 0) log(`${name.padEnd(30)} ${String(count).padStart(4)}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.check) {
    const existing = readExistingSnapshot(args.out);
    if (!existing) {
      console.error("[export-content] No snapshot found to check.");
      process.exit(1);
    }
    const { errors, warnings } = validateSnapshot(existing.tables);
    warnings.forEach((warning) => warn(warning));
    if (errors.length) {
      console.error(`[export-content] Snapshot INVALID:\n${formatErrors(errors)}`);
      process.exit(1);
    }
    console.log(
      `[export-content] Snapshot OK — ${existing.contentVersion} (${existing.tables.services?.length || 0} services, ${existing.tables.service_items?.length || 0} sub-services)`
    );
    process.exit(0);
  }

  loadEnvironment();

  const previous = readExistingSnapshot(args.out);

  const source = selectSource(args);
  let collected;
  try {
    log(
      source.kind === "supabase"
        ? "Source: Supabase REST (live)"
        : source.kind === "remote"
          ? `Source: backend snapshot (${source.value})`
          : `Source: fixture (${source.value})`
    );
    collected =
      source.kind === "file"
        ? collectFromFile(source.value)
        : source.kind === "remote"
          ? await collectRemote(source.value)
          : await collectLive();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[export-content] Export failed: ${message}`);
    if (args.soft) {
      if (previous) {
        const { errors } = validateSnapshot(previous.tables);
        if (errors.length === 0) {
          warn(
            `Keeping previous valid snapshot ${previous.contentVersion} (${previous.tables.services?.length || 0} services).`
          );
          process.exit(0);
        }
        console.error("[export-content] Previous snapshot is also invalid; refusing to continue.");
      } else {
        console.error("[export-content] No previous valid snapshot exists.");
      }
    }
    process.exit(1);
  }

  const { errors, warnings } = validateSnapshot(collected.tables);
  warnings.forEach((warning) => warn(warning));

  if (errors.length) {
    console.error(`[export-content] Validation FAILED — snapshot not written:\n${formatErrors(errors)}`);
    if (args.soft && previous) {
      const previousCheck = validateSnapshot(previous.tables);
      if (previousCheck.errors.length === 0) {
        warn(`Keeping previous valid snapshot ${previous.contentVersion}.`);
        process.exit(0);
      }
    }
    process.exit(1);
  }

  const { snapshot, manifest } = buildSnapshot(collected.tables, collected.source);

  // Never replace a snapshot with fewer services than the last valid one.
  if (
    previous &&
    Array.isArray(previous.tables?.services) &&
    previous.tables.services.length > snapshot.tables.services.length
  ) {
    const message = `Export has fewer services (${snapshot.tables.services.length}) than the previous snapshot (${previous.tables.services.length}); refusing to overwrite.`;
    console.error(`[export-content] ${message}`);
    if (args.soft) process.exit(0);
    process.exit(1);
  }

  atomicWrite(args.out, `${JSON.stringify(snapshot, null, 2)}\n`);
  atomicWrite(args.manifest, `${JSON.stringify(manifest, null, 2)}\n`);

  log(`Snapshot written: ${path.relative(ROOT, args.out)}`);
  log(`Manifest written: ${path.relative(ROOT, args.manifest)}`);
  log(`Content version: ${snapshot.contentVersion}`);
  log(`Checksum: ${snapshot.checksum}`);
  log(`Total records: ${manifest.totalRecords}`);
  printSummary(snapshot.tables);
}

main().catch((error) => {
  console.error("[export-content] Unexpected failure:", error);
  process.exit(1);
});
