#!/usr/bin/env node
/**
 * Content pipeline regression tests.
 *
 * Exercises the real exporter against fixtures and a fake Supabase REST API:
 *  1. valid export writes snapshot + manifest;
 *  2. drafts/private settings are filtered out;
 *  3. pagination reads every row past the 1000-row page size;
 *  4. a failed/invalid export never overwrites a good snapshot;
 *  5. --soft keeps the previous valid snapshot and exits 0;
 *  6. strict mode fails the build;
 *  7. the committed snapshot contains only publishable rows and no secrets.
 *
 * All writes happen in a temp directory; committed files are never modified.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EXPORTER = path.join(ROOT, "scripts", "export-content.mjs");
const SNAPSHOT = path.join(ROOT, "src", "data", "content-snapshot.json");

const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), "arrowline-content-test-"));
const OUT = path.join(TEMP_ROOT, "snapshot.json");
const MANIFEST = path.join(TEMP_ROOT, "snapshot.manifest.json");

let passed = 0;
const failures = [];

function check(condition, label, detail = "") {
  if (condition) {
    passed += 1;
    console.log(`  ✔ ${label}`);
  } else {
    failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
    console.error(`  ✘ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

function run(args, env = {}) {
  const result = spawnSync(process.execPath, [EXPORTER, ...args], {
    cwd: ROOT,
    env: { ...process.env, ...env },
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    output: `${result.stdout || ""}\n${result.stderr || ""}`,
  };
}

// Async variant used when the test itself hosts the fake Supabase server:
// spawnSync blocks this process's event loop, which would deadlock the server.
function runAsync(args, env = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [EXPORTER, ...args], {
      cwd: ROOT,
      env: { ...process.env, ...env },
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      resolve({ status: -1, stdout, stderr: `${stderr}\n${error.message}`, output: `${stdout}\n${stderr}\n${error.message}` });
    });
    child.on("close", (status) => {
      resolve({ status, stdout, stderr, output: `${stdout}\n${stderr}` });
    });
  });
}

function sha(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function fixtureFromSnapshot() {
  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT, "utf8"));
  return snapshot.tables;
}

function makeServiceRow(index) {
  return {
    id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    slug: `pagination-service-${index}`,
    title: `Pagination Service ${index}`,
    hero_image: `https://res.cloudinary.com/demo/image/upload/service-${index}.jpg`,
    is_published: true,
    display_order: index,
  };
}

async function startFakeSupabase(services) {
  const requests = [];
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const match = url.pathname.match(/^\/rest\/v1\/([a-z_]+)$/);
    if (!match) {
      res.writeHead(404).end("not found");
      return;
    }
    const table = match[1];
    const offset = Number(url.searchParams.get("offset") || 0);
    const limit = Number(url.searchParams.get("limit") || 1000);
    requests.push({ table, offset, limit });

    let rows = [];
    if (table === "services") rows = services.slice(offset, offset + limit);
    else if (table === "site_content") {
      rows = offset === 0
        ? [
            { id: "c1", content_key: "hero_description", content_value: "Test", is_published: true },
            { id: "c2", content_key: "draft_only", content_value: "Draft", is_published: false },
          ]
        : [];
    } else if (table === "site_settings") {
      rows = offset === 0
        ? [
            { id: "s1", setting_key: "phone", setting_value: "+91 00000 00000", is_public: true },
            { id: "s2", setting_key: "secret_setting", setting_value: "hidden", is_public: false },
          ]
        : [];
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(rows));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, requests, url: `http://127.0.0.1:${server.address().port}` };
}

async function main() {
  console.log("[test] Content pipeline\n");

  const validFixture = path.join(TEMP_ROOT, "valid-fixture.json");
  fs.writeFileSync(validFixture, JSON.stringify(fixtureFromSnapshot()));

  // 1. Valid export
  console.log("[test] 1. Valid fixture export");
  const valid = run(["--from-file", validFixture, "--out", OUT, "--manifest", MANIFEST]);
  check(valid.status === 0, "exporter exits 0", valid.output.slice(-400));
  check(fs.existsSync(OUT), "snapshot written");
  check(fs.existsSync(MANIFEST), "manifest written");
  const firstSnapshot = JSON.parse(fs.readFileSync(OUT, "utf8"));
  check(Boolean(firstSnapshot.contentVersion && firstSnapshot.checksum), "snapshot has version + checksum");
  check(firstSnapshot.tables.services.length > 0, "snapshot has services");
  const firstHash = sha(OUT);

  // 2. Drafts and private settings
  console.log("\n[test] 2. Published/public filtering");
  check(!firstSnapshot.tables.site_content.some((row) => row.content_key === "draft_only"), "draft content excluded");
  check(!firstSnapshot.tables.site_settings.some((row) => row.setting_key === "secret_setting"), "private settings excluded");
  const allFiltered = Object.entries(firstSnapshot.tables).every(([table, rows]) => {
    const filter = table === "site_settings" ? "is_public" : "is_published";
    return rows.every((row) => row[filter] === true || row[filter] === undefined);
  });
  check(allFiltered, "every exported row is published/public");

  // 3. Soft failure preserves the snapshot
  console.log("\n[test] 3. Invalid export preserves previous snapshot (soft)");
  const invalidFixture = path.join(TEMP_ROOT, "invalid-fixture.json");
  fs.writeFileSync(invalidFixture, JSON.stringify({ service_items: [{ id: "orphan", title: "No parent" }] }));
  const soft = run(["--from-file", invalidFixture, "--out", OUT, "--manifest", MANIFEST, "--soft"]);
  check(soft.status === 0, "--soft exits 0", soft.output.slice(-400));
  check(sha(OUT) === firstHash, "previous snapshot bytes unchanged");
  check(/Keeping previous valid snapshot/i.test(soft.output), "logs snapshot preservation");

  // 4. Strict failure is nonzero and still preserves
  console.log("\n[test] 4. Strict invalid export fails without overwriting");
  const strict = run(["--from-file", invalidFixture, "--out", OUT, "--manifest", MANIFEST]);
  check(strict.status !== 0, "strict export exits nonzero", `status=${strict.status}`);
  check(sha(OUT) === firstHash, "strict failure preserved previous snapshot");
  check(/Validation FAILED/i.test(strict.output), "validation failure is reported");

  // 5. --check passes on the committed snapshot
  console.log("\n[test] 5. Committed snapshot check");
  const checkResult = run(["--check"]);
  check(checkResult.status === 0, "--check exits 0", checkResult.output.slice(-400));

  // 6. Committed snapshot has no private/draft rows or secrets
  console.log("\n[test] 6. Committed snapshot safety");
  const committed = JSON.parse(fs.readFileSync(SNAPSHOT, "utf8"));
  const privateRows = Object.entries(committed.tables).flatMap(([table, rows]) => {
    const filter = table === "site_settings" ? "is_public" : "is_published";
    return rows.filter((row) => row[filter] === false).map(() => `${table}.${filter}`);
  });
  check(privateRows.length === 0, "no unpublished/private rows in committed snapshot", privateRows.slice(0, 5).join(", "));

  const snapshotText = fs.readFileSync(SNAPSHOT, "utf8");
  const forbidden = [
    /SUPABASE_SERVICE_ROLE_KEY/i,
    /VERCEL_DEPLOY_HOOK_URL/i,
    /RESEND_API_KEY/i,
    /CLOUDINARY_API_SECRET/i,
    /ADMIN_API_KEY/i,
    /service_role/i,
    /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/,
  ];
  const foundForbidden = forbidden.filter((pattern) => pattern.test(snapshotText));
  check(foundForbidden.length === 0, "no secret-looking content in snapshot", foundForbidden.map(String).join(", "));

  // 7. Pagination past 1000 rows through the real exporter
  console.log("\n[test] 7. Live export pagination (1200 rows)");
  const pagedSnapshot = path.join(TEMP_ROOT, "paged.json");
  const pagedManifest = path.join(TEMP_ROOT, "paged.manifest.json");
  const services = Array.from({ length: 1200 }, (_, index) => makeServiceRow(index + 1));
  const fake = await startFakeSupabase(services);
  try {
    const paged = await runAsync(["--out", pagedSnapshot, "--manifest", pagedManifest], {
      SUPABASE_URL: fake.url,
      SUPABASE_SERVICE_ROLE_KEY: "test-key-not-a-real-secret",
      SUPABASE_ANON_KEY: "",
      SUPABASE_KEY: "",
    });
    check(paged.status === 0, "live export exits 0", paged.output.slice(-600));
    const pagedData = JSON.parse(fs.readFileSync(pagedSnapshot, "utf8"));
    check(pagedData.tables.services.length === 1200, "all 1200 service rows exported", `got ${pagedData.tables.services.length}`);
    const servicePages = fake.requests.filter((row) => row.table === "services");
    check(servicePages.length >= 2, "pagination issued multiple requests", `got ${servicePages.length}`);
    check(
      servicePages.some((row) => row.offset === 1000),
      "second page requested at offset 1000"
    );
    check(pagedData.tables.site_content.length === 1, "draft content filtered in live export");
    check(pagedData.tables.site_settings.length === 1, "private settings filtered in live export");
  } finally {
    await new Promise((resolve) => fake.server.close(resolve));
  }

  // 8. Fake outage + --soft preserves the paged snapshot
  console.log("\n[test] 8. Supabase outage keeps last good snapshot");
  const pagedHash = sha(pagedSnapshot);
  const offline = run(["--soft", "--out", pagedSnapshot, "--manifest", pagedManifest], {
    SUPABASE_URL: "http://127.0.0.1:1",
    SUPABASE_SERVICE_ROLE_KEY: "test-key-not-a-real-secret",
  });
  check(offline.status === 0, "outage with --soft exits 0", offline.output.slice(-400));
  check(sha(pagedSnapshot) === pagedHash, "snapshot unchanged after outage");
  check(/Keeping previous valid snapshot/i.test(offline.output), "outage logs fallback to previous snapshot");

  const strictOffline = run(["--out", pagedSnapshot, "--manifest", pagedManifest], {
    SUPABASE_URL: "http://127.0.0.1:1",
    SUPABASE_SERVICE_ROLE_KEY: "test-key-not-a-real-secret",
  });
  check(strictOffline.status !== 0, "outage without --soft fails the export");
  check(sha(pagedSnapshot) === pagedHash, "strict outage preserved snapshot");

  console.log("");
  if (failures.length) {
    console.error(`[test] ❌ ${failures.length} failure(s), ${passed} passed`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }
  console.log(`[test] ✅ ${passed} content pipeline checks passed`);
}

main()
  .catch((error) => {
    console.error("[test] Unexpected failure:", error);
    process.exit(1);
  })
  .finally(() => {
    fs.rmSync(TEMP_ROOT, { recursive: true, force: true });
  });
