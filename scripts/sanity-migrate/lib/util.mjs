/** Small helpers shared by the transform layer. */

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

let keyCounter = 0;
export function key(prefix = "k") {
  keyCounter += 1;
  return `${prefix}${keyCounter}`;
}

export function sortByOrder(rows) {
  return [...(rows || [])].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export function onlyPublished(rows) {
  return (rows || []).filter((row) => row.is_published !== false);
}

/**
 * Normalise the various shapes the CMS stores string lists in:
 *  - ["a", "b"]
 *  - '["a","b"]' (JSON string)
 *  - [["Title","Description"], ["Title2","Description2"]]
 *  - [{ title, desc }]
 * Returns a flat string[]; for [title, desc] pairs it keeps "title — desc".
 */
export function toStringList(value) {
  if (value == null) return [];
  let parsed = value;
  if (typeof parsed === "string") {
    const trimmed = parsed.trim();
    if (!trimmed) return [];
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return [trimmed];
    }
  }
  if (!Array.isArray(parsed)) {
    if (typeof parsed === "object") {
      const obj = parsed;
      if (obj.title) return [obj.desc || obj.description ? `${obj.title} — ${obj.desc || obj.description}` : obj.title];
      return [];
    }
    return [String(parsed)];
  }
  const out = [];
  for (const item of parsed) {
    if (item == null) continue;
    if (Array.isArray(item)) {
      const [title, desc] = item;
      if (title != null && desc != null) out.push(`${title} — ${desc}`);
      else if (title != null) out.push(String(title));
    } else if (typeof item === "object") {
      const obj = item;
      if (obj.title != null) out.push(obj.desc || obj.description ? `${obj.title} — ${obj.desc || obj.description}` : String(obj.title));
    } else if (typeof item === "string") {
      out.push(item);
    }
  }
  return out;
}

/** Convert plain text (double-newline separated) into a Sanity Portable Text array. */
export function toPortableText(text) {
  const paragraphs = String(text || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((paragraph, index) => ({
    _type: "block",
    _key: key("blk"),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key("span"), text: paragraph, marks: [] }],
  }));
}

export function ref(id) {
  return { _type: "reference", _ref: id };
}

export function compact(object) {
  const out = {};
  for (const [k, v] of Object.entries(object)) {
    if (v === undefined) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}
