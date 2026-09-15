import fs from "node:fs";
const map = JSON.parse(fs.readFileSync("scripts/_image_map.json","utf8"));
for (const k of ["/images/favicon.png","/images/road-transport.jpg","/images/truck-fleet-yard.jpg","/images/hero-logistics.jpg","/images/hero-trucks-city.jpg"]) {
  console.log(k, "->", map[k]?.url);
}
