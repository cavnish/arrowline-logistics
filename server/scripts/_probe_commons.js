const q = "container truck on highway India logistics";
const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1200&format=json&origin=*`;
const res = await fetch(url, { headers: { "User-Agent": "ArrowlineCMS/1.0 (admin tool)" } });
const j = await res.json();
const pages = j?.query?.pages ? Object.values(j.query.pages) : [];
for (const p of pages) {
  const ii = p.imageinfo?.[0];
  console.log("TITLE:", p.title);
  console.log("  mime:", ii?.mime, "| w:", ii?.width, "h:", ii?.height, "| size:", ii?.size);
  console.log("  thumb:", ii?.thumburl);
  console.log("  lic:", ii?.extmetadata?.LicenseShortName?.value, "| artist:", ii?.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, "").slice(0, 60));
}