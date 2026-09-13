async function probe(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q + " filetype:bitmap")}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1280&format=json&origin=*`;
  const res = await fetch(url, { headers: { "User-Agent": "ArrowlineCMS/1.0" } });
  if (!res.ok) { console.log("   HTTP", res.status); return; }
  const pages = Object.values((await res.json())?.query?.pages || {});
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii || !/^image\/(jpeg|png|webp)$/i.test(ii.mime)) continue;
    console.log("  ", ii.extmetadata?.LicenseShortName?.value, "|", p.title.slice(0, 95), "|", ii.width + "x" + ii.height);
  }
}
console.log("WAREHOUSE CORRIDOR:"); await probe("warehouse corridor");
await new Promise((r) => setTimeout(r, 1500));
console.log("LOGISTICS WAREHOUSE:"); await probe("logistics warehouse interior");
await new Promise((r) => setTimeout(r, 1500));
console.log("WAREHOUSE AISLE:"); await probe("warehouse aisle shelves");
await new Promise((r) => setTimeout(r, 1500));
console.log("FORKLIFT WAREHOUSE:"); await probe("forklift warehouse");
await new Promise((r) => setTimeout(r, 1500));
console.log("STOCKROOM SHELVES:"); await probe("stockroom shelves warehouse");