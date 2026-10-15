import { createClient } from "@sanity/client";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { config } from "./env.mjs";

export const sanity = createClient({
  projectId: config.sanityProjectId || "unconfigured",
  dataset: config.sanityDataset,
  apiVersion: config.sanityApiVersion,
  token: config.sanityToken || undefined,
  useCdn: false,
});

const assetCacheFile = resolve(config.dumpDir, ".assets.json");

function readAssetCache() {
  if (!existsSync(assetCacheFile)) return {};
  try {
    return JSON.parse(readFileSync(assetCacheFile, "utf8"));
  } catch {
    return {};
  }
}

let assetCache = readAssetCache();

export function saveAssetCache() {
  mkdirSync(dirname(assetCacheFile), { recursive: true });
  writeFileSync(assetCacheFile, JSON.stringify(assetCache, null, 2));
}

let uploadedCount = 0;
let reusedCount = 0;

/**
 * Turn a remote image URL (e.g. Cloudinary) into a Sanity image field value,
 * uploading the binary to Sanity assets the first time it is seen.
 *
 * In dry-run mode (write=false) no upload happens; the URL is recorded so the
 * generated document preview still shows where the image will come from.
 */
export async function resolveImage(url, alt, { write }) {
  if (!url || typeof url !== "string") return undefined;

  const key = url.trim();
  if (!key) return undefined;

  if (!write) {
    return { _type: "image", alt: alt || undefined, _pendingUrl: key };
  }

  if (assetCache[key]) {
    reusedCount += 1;
    return { _type: "image", alt: alt || undefined, asset: { _type: "reference", _ref: assetCache[key] } };
  }

  const response = await fetch(key);
  if (!response.ok) {
    throw new Error(`Failed to download image (${response.status}): ${key}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = decodeURIComponent(key.split("/").pop() || "image.jpg").split("?")[0];
  const asset = await sanity.assets.upload("image", buffer, { filename });

  assetCache[key] = asset._id;
  uploadedCount += 1;
  return { _type: "image", alt: alt || undefined, asset: { _type: "reference", _ref: asset._id } };
}

export function assetStats() {
  return { uploaded: uploadedCount, reused: reusedCount };
}

/** Write documents to Sanity in batches, idempotently (createOrReplace). */
export async function writeDocuments(documents, { dryRun, batchSize = 50 }) {
  if (dryRun) {
    process.stdout.write(`  [dry-run] would write ${documents.length} documents\n`);
    return { written: 0 };
  }
  let written = 0;
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    const mutations = batch.map((doc) => ({ createOrReplace: doc }));
    await sanity.mutate(mutations);
    written += batch.length;
    process.stdout.write(`  wrote ${written}/${documents.length}\n`);
  }
  return { written };
}
