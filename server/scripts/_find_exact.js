async function probe(q, needle) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q + " filetype:bitmap")}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1280&format=json&origin=*`;
  const res = await fetch(url, { headers: { "User-Agent": "ArrowlineCMS/1.0" } });
  const pages = Object.values((await res.json())?.query?.pages || {});
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii || !/^image\/(jpeg|png|webp)$/i.test(ii.mime)) continue;
    if (needle && !p.title.includes(needle)) continue;
    console.log("EXACT:", JSON.stringify(p.title));
    console.log("  url:", ii.url);
    console.log("  thumb:", ii.thumburl);
    console.log("  lic:", ii.extmetadata?.LicenseShortName?.value, ii.width + "x" + ii.height);
  }
  await new Promise((r) => setTimeout(r, 1500));
}
await probe("Bassens Docks warehouse NARA", "Bassens");
await probe("forklifts load crates trailer trucks warehouse", "Forklifts");