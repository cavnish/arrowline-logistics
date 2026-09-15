// Rewrites every local /images/... reference in src/* files to the Cloudinary
// URL recorded in server/scripts/_image_map.json (produced by the migration).
// Only standalone path literals are replaced; URLs that merely contain
// "images/..." (e.g. full https URLs) are left untouched.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const mapPath = path.join(__dirname, "_image_map.json");
const srcDir = path.join(repoRoot, "src");

const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const localRefRe = /(?<![\w:/.-])(\/images\/[\w./-]+\.(?:jpg|jpeg|png|gif|webp|avif|svg))/gi;

let totalReplaced = 0;
let totalRefs = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|jsx|css)$/.test(entry.name)) rewriteFile(full);
  }
}

function rewriteFile(file) {
  const original = fs.readFileSync(file, "utf8");
  const matches = original.match(localRefRe) || [];
  totalRefs += matches.length;

  const out = original.replace(localRefRe, (full) => {
    const entry = map[full];
    if (!entry) {
      console.log(`  NO MAP: ${full} (${path.relative(repoRoot, file)})`);
      return full;
    }
    totalReplaced += 1;
    return entry.url;
  });

  if (out !== original) {
    fs.writeFileSync(file, out, "utf8");
    console.log(`  rewrote ${path.relative(repoRoot, file)} (${matches.length} refs)`);
  }
}

walk(srcDir);
console.log(`\nRefs found: ${totalRefs}, replaced: ${totalReplaced}`);