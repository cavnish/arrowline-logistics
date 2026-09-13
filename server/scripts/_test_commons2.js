// probe with filetype:bitmap filter
async function test(concept) {
  const q = concept + " filetype:bitmap";
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=1280&format=json&origin=*`;
  const res = await fetch(url, { headers: { "User-Agent": "ArrowlineCMS/1.0" } });
  if (!res.ok) { console.log(concept, "-> HTTP", res.status, (await res.text()).slice(0,100)); return; }
  const j = await res.json();
  const pages = Object.values(j?.query?.pages || {});
  for (const p of pages.slice(0,4)) {
    const ii = p.imageinfo?.[0];
    console.log(p.title?.slice(0,50), "| mime:", ii?.mime, "| w:", ii?.width, "| lic:", ii?.extmetadata?.LicenseShortName?.value);
  }
}
await test("intermodal container truck highway");
await new Promise(r => setTimeout(r, 800));
await test("modern warehouse interior racking pallets");
