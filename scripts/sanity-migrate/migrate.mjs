#!/usr/bin/env node
/**
 * Arrowline Logistics — Supabase (CMS tables) → Sanity migration.
 *
 * Usage:
 *   node migrate.mjs              # export + transform, dry-run (no writes)
 *   node migrate.mjs --export     # only export CMS tables to ./dump
 *   node migrate.mjs --write      # upload images + write documents to Sanity
 *
 * Transactional tables (leads, lead_notes, admin_sessions) are never touched.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { config, requireForExport, requireForWrite } from "./lib/env.mjs";
import { exportAllTables } from "./lib/supabase.mjs";
import { buildDocuments } from "./lib/transform.mjs";
import { assetStats, saveAssetCache, writeDocuments } from "./lib/sanity.mjs";

const args = new Set(process.argv.slice(2));
const exportOnly = args.has("--export");
const write = args.has("--write");
const help = args.has("--help") || args.has("-h");

if (help) {
  process.stdout.write(
    [
      "Supabase CMS -> Sanity migration",
      "",
      "  node migrate.mjs            dry-run (export + transform, no writes)",
      "  node migrate.mjs --export   export CMS tables to ./dump only",
      "  node migrate.mjs --write    upload images and write documents to Sanity",
      "",
    ].join("\n"),
  );
  process.exit(0);
}

function saveDump(dump) {
  mkdirSync(config.dumpDir, { recursive: true });
  for (const [table, rows] of Object.entries(dump)) {
    writeFileSync(resolve(config.dumpDir, `${table}.json`), JSON.stringify(rows, null, 2));
  }
  const manifest = Object.fromEntries(Object.entries(dump).map(([table, rows]) => [table, rows.length]));
  writeFileSync(resolve(config.dumpDir, "manifest.json"), JSON.stringify(manifest, null, 2));
}

async function main() {
  requireForExport();
  if (write) requireForWrite();

  process.stdout.write(`\n→ Exporting CMS tables from Supabase\n`);
  const { dump, problems } = await exportAllTables();
  saveDump(dump);
  process.stdout.write(`  dump written to ${config.dumpDir}\n`);
  if (problems.length) {
    process.stdout.write(`  ⚠ some tables could not be read:\n    - ${problems.join("\n    - ")}\n`);
  }

  if (exportOnly) {
    process.stdout.write("\n✓ Export complete (no Sanity writes).\n");
    return;
  }

  process.stdout.write(`\n→ Transforming to Sanity documents${write ? " (writing)" : " (dry-run)"}\n`);
  const { docs, report } = await buildDocuments(dump, { write });
  saveDump(dump);
  if (write) saveAssetCache();

  process.stdout.write("\n  Documents by type:\n");
  for (const [type, count] of Object.entries(report.byType).sort()) {
    process.stdout.write(`    ${type.padEnd(18)} ${count}\n`);
  }
  process.stdout.write(`    ${"TOTAL".padEnd(18)} ${docs.length}\n`);

  if (report.warnings.length) {
    process.stdout.write(`\n  ⚠ ${report.warnings.length} warning(s):\n`);
    for (const warning of report.warnings.slice(0, 50)) process.stdout.write(`    - ${warning}\n`);
  }

  const result = await writeDocuments(docs, { dryRun: !write });
  if (write) {
    const stats = assetStats();
    process.stdout.write(`\n  images uploaded: ${stats.uploaded}, reused: ${stats.reused}\n`);
    process.stdout.write(`\n✓ Wrote ${result.written} documents to ${config.sanityProjectId}/${config.sanityDataset}.\n`);
  } else {
    process.stdout.write(`\n✓ Dry-run complete. Re-run with --write to apply.\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`\n✗ Migration failed: ${error?.message || error}\n`);
  process.exitCode = 1;
});
