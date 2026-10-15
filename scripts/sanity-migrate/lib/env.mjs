import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

/** Minimal .env loader (no dependency). Existing process env wins. */
function loadDotEnv() {
  const file = resolve(root, ".env");
  if (!existsSync(file)) return;
  for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadDotEnv();

export const config = {
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  sanityProjectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  sanityDataset: process.env.SANITY_DATASET || "production",
  sanityApiVersion: process.env.SANITY_API_VERSION || "2024-10-01",
  sanityToken: process.env.SANITY_MIGRATION_TOKEN || process.env.SANITY_API_WRITE_TOKEN || "",
  dumpDir: process.env.MIGRATION_DUMP_DIR || resolve(root, "dump"),
};

export function requireForExport() {
  const missing = [];
  if (!config.supabaseUrl) missing.push("SUPABASE_URL");
  if (!config.supabaseKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) throw new Error(`Missing env for export: ${missing.join(", ")}`);
}

export function requireForWrite() {
  const missing = [];
  if (!config.sanityProjectId) missing.push("SANITY_PROJECT_ID");
  if (!config.sanityToken) missing.push("SANITY_MIGRATION_TOKEN");
  if (missing.length) throw new Error(`Missing env for --write: ${missing.join(", ")}`);
}
