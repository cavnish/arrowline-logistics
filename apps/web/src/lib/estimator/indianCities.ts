/**
 * Pan-India city / industrial-hub dataset used by the Transit Time Estimator.
 * Only an approximate geographic dataset (name + state + lat/lng) — it powers
 * an offline haversine-based distance & transit model so the tool works with
 * zero network calls. A real routing API (Directions/OSRM) can be swapped in
 * behind the routeEstimator service later without touching the UI.
 */

export interface City {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  aliases?: string[];
  /** Preferred hub on the Arrowline network (used for quick-route chips). */
  isHub?: boolean;
}

const c = (
  id: string,
  name: string,
  state: string,
  lat: number,
  lng: number,
  aliases?: string[],
  isHub?: boolean
): City => ({ id, name, state, lat, lng, aliases, isHub });

export const CITIES: City[] = [
  // ---- Gujarat ----
  c("mundra", "Mundra", "Gujarat", 22.8394, 69.7213, ["Mundra Port"], true),
  c("gandhidham", "Gandhidham", "Gujarat", 23.0756, 70.1333, ["Adipur"], true),
  c("anjar", "Anjar", "Gujarat", 23.1147, 70.0271),
  c("bhuj", "Bhuj", "Gujarat", 23.242, 69.6669),
  c("kandla", "Kandla", "Gujarat", 23.033, 70.212, ["Deendayal Port"]),
  c("jamnagar", "Jamnagar", "Gujarat", 22.4707, 70.0577, [], true),
  c("rajkot", "Rajkot", "Gujarat", 22.3039, 70.8022, [], true),
  c("morbi", "Morbi", "Gujarat", 22.8173, 70.8377),
  c("ahmedabad", "Ahmedabad", "Gujarat", 23.0225, 72.5714, ["Amdavad"], true),
  c("gandhinagar", "Gandhinagar", "Gujarat", 23.2156, 72.6369),
  c("mehsana", "Mehsana", "Gujarat", 23.588, 72.3693),
  c("vadodara", "Vadodara", "Gujarat", 22.3072, 73.1812, ["Baroda"], true),
  c("anand", "Anand", "Gujarat", 22.5645, 72.9289),
  c("bharuch", "Bharuch", "Gujarat", 21.7051, 72.9959),
  c("dahej", "Dahej", "Gujarat", 21.7182, 72.5854),
  c("surat", "Surat", "Gujarat", 21.1702, 72.8311, ["Hazira"], true),
  c("navsari", "Navsari", "Gujarat", 20.9517, 72.9324),
  c("valsad", "Valsad", "Gujarat", 20.6103, 72.926),
  c("vapi", "Vapi", "Gujarat", 20.3718, 72.9066),
  c("bhavnagar", "Bhavnagar", "Gujarat", 21.7645, 72.1519),
  c("nadiad", "Nadiad", "Gujarat", 22.691, 72.8636),
  // ---- Rajasthan ----
  c("jaipur", "Jaipur", "Rajasthan", 26.9124, 75.7873, [], true),
  c("ajmer", "Ajmer", "Rajasthan", 26.4499, 74.6399),
  c("udaipur", "Udaipur", "Rajasthan", 24.5854, 73.7125),
  c("jodhpur", "Jodhpur", "Rajasthan", 26.2389, 73.0243, [], true),
  c("bikaner", "Bikaner", "Rajasthan", 28.0229, 73.3119),
  c("kota", "Kota", "Rajasthan", 25.2138, 75.8648),
  c("alwar", "Alwar", "Rajasthan", 27.553, 76.6346),
  c("bhiwadi", "Bhiwadi", "Rajasthan", 28.2104, 76.872),
  c("neemrana", "Neemrana", "Rajasthan", 27.9617, 76.7366),
  c("pilani", "Pilani", "Rajasthan", 28.367, 75.6013),
  c("bhilwara", "Bhilwara", "Rajasthan", 25.3505, 74.635),
  c("chittorgarh", "Chittorgarh", "Rajasthan", 24.8841, 74.6311),
  c("beawar", "Beawar", "Rajasthan", 26.1011, 74.3203),
  c("pali", "Pali", "Rajasthan", 25.771, 73.3234),
  c("sri-ganganagar", "Sri Ganganagar", "Rajasthan", 29.9038, 73.8772),
  c("bharatpur", "Bharatpur", "Rajasthan", 27.2173, 77.4901),
  // ---- Delhi NCR ----
  c("delhi", "Delhi", "Delhi", 28.6139, 77.209, ["New Delhi", "Delhi NCR", "Dilli", "North Delhi", "Pitampura", "Okhla"], true),
  c("gurugram", "Gurugram", "Haryana", 28.4595, 77.0266, ["Gurgaon", "Manesar"], true),
  c("noida", "Noida", "Uttar Pradesh", 28.5355, 77.391, ["Greater Noida"], true),
  c("ghaziabad", "Ghaziabad", "Uttar Pradesh", 28.6692, 77.4538),
  c("faridabad", "Faridabad", "Haryana", 28.4089, 77.3178),
  c("sonipat", "Sonipat", "Haryana", 28.9931, 77.0151, ["Kundli"]),
  c("palwal", "Palwal", "Haryana", 28.1462, 77.3297),
  // ---- Haryana & Punjab ----
  c("panipat", "Panipat", "Haryana", 29.3909, 76.9635),
  c("karnal", "Karnal", "Haryana", 29.6857, 76.9905),
  c("ambala", "Ambala", "Haryana", 30.3782, 76.7769),
  c("hisar", "Hisar", "Haryana", 29.1492, 75.7217),
  c("chandigarh", "Chandigarh", "Punjab", 30.7333, 76.7794, ["Mohali", "Panchkula"], true),
  c("ludhiana", "Ludhiana", "Punjab", 30.901, 75.8573, [], true),
  c("amritsar", "Amritsar", "Punjab", 31.634, 74.8723),
  c("jalandhar", "Jalandhar", "Punjab", 31.326, 75.5762),
  c("patiala", "Patiala", "Punjab", 30.3398, 76.3869),
  c("bathinda", "Bathinda", "Punjab", 30.211, 74.9499),
  c("srinagar", "Srinagar", "Jammu & Kashmir", 34.0837, 74.7973),
  // ---- Uttar Pradesh ----
  c("lucknow", "Lucknow", "Uttar Pradesh", 26.8467, 80.9462, [], true),
  c("kanpur", "Kanpur", "Uttar Pradesh", 26.4499, 80.3319, ["Kanpur Nagar"]),
  c("agra", "Agra", "Uttar Pradesh", 27.1767, 78.0081),
  c("meerut", "Meerut", "Uttar Pradesh", 28.9845, 77.7064),
  c("aligarh", "Aligarh", "Uttar Pradesh", 27.8831, 78.0787),
  c("mathura", "Mathura", "Uttar Pradesh", 27.4924, 77.6737),
  c("moradabad", "Moradabad", "Uttar Pradesh", 28.8386, 78.7733),
  c("bareilly", "Bareilly", "Uttar Pradesh", 28.367, 79.4304),
  c("jhansi", "Jhansi", "Uttar Pradesh", 25.4484, 78.5685),
  c("prayagraj", "Prayagraj", "Uttar Pradesh", 25.4358, 81.8463, ["Allahabad"]),
  c("varanasi", "Varanasi", "Uttar Pradesh", 25.3176, 82.9739, ["Banaras", "Kashi"]),
  // ---- Maharashtra ----
  c("mumbai", "Mumbai", "Maharashtra", 19.076, 72.8777, ["Bombay", "Sion", "Bhiwandi"], true),
  c("navi-mumbai", "Navi Mumbai", "Maharashtra", 19.033, 73.0297, ["Vashi", "Panvel"]),
  c("jnpt", "JNPT (Nhava Sheva)", "Maharashtra", 18.9513, 72.9555, ["Jawaharlal Nehru Port", "Nhava Sheva"]),
  c("thane", "Thane", "Maharashtra", 19.2183, 72.9781),
  c("pune", "Pune", "Maharashtra", 18.5204, 73.8567, ["Pimpri", "Chinchwad", "Chakan", "Talegaon"], true),
  c("nashik", "Nashik", "Maharashtra", 19.9975, 73.7898),
  c("aurangabad", "Aurangabad", "Maharashtra", 19.8762, 75.3433, ["Chhatrapati Sambhajinagar"]),
  c("ahmednagar", "Ahmednagar", "Maharashtra", 19.0948, 74.738),
  c("solapur", "Solapur", "Maharashtra", 17.6599, 75.9064),
  c("kolhapur", "Kolhapur", "Maharashtra", 16.705, 74.2433),
  c("sangli", "Sangli", "Maharashtra", 16.8524, 74.6054),
  c("nagpur", "Nagpur", "Maharashtra", 21.1458, 79.0882, [], true),
  // ---- Madhya Pradesh ----
  c("indore", "Indore", "Madhya Pradesh", 22.7196, 75.8577, ["Pithampur", "Dewas"], true),
  c("dewasa", "Dewas", "Madhya Pradesh", 22.9646, 76.0554),
  c("pithampur", "Pithampur", "Madhya Pradesh", 22.618, 75.698),
  c("ujjain", "Ujjain", "Madhya Pradesh", 23.1765, 75.7885),
  c("ratlam", "Ratlam", "Madhya Pradesh", 23.3315, 75.0366),
  c("mandsaur", "Mandsaur", "Madhya Pradesh", 24.0718, 75.0694),
  c("bhopal", "Bhopal", "Madhya Pradesh", 23.2599, 77.4126, [], true),
  c("gwalior", "Gwalior", "Madhya Pradesh", 26.2183, 78.1828),
  c("jabalpur", "Jabalpur", "Madhya Pradesh", 23.1815, 79.9864),
  // ---- Telangana ----
  c("hyderabad", "Hyderabad", "Telangana", 17.385, 78.4867, ["Secunderabad", "Cyberabad", "Shamshabad"], true),
  c("warangal", "Warangal", "Telangana", 17.9689, 79.5941),
  // ---- Karnataka ----
  c("bengaluru", "Bengaluru", "Karnataka", 12.9716, 77.5946, ["Bangalore", "Whitefield", "Bidadi"], true),
  c("mysuru", "Mysuru", "Karnataka", 12.2958, 76.6394, ["Mysore"]),
  c("tumakuru", "Tumakuru", "Karnataka", 13.3391, 77.107, ["Tumkur"]),
  c("davanagere", "Davanagere", "Karnataka", 14.4644, 75.9218),
  c("belagavi", "Belagavi", "Karnataka", 15.8497, 74.4977, ["Belgaum"]),
  c("hubballi", "Hubballi", "Karnataka", 15.3647, 75.124, ["Hubli", "Dharwad"]),
  c("mangaluru", "Mangaluru", "Karnataka", 12.9141, 74.856, ["Mangalore", "New Mangalore Port"]),
  // ---- Tamil Nadu ----
  c("chennai", "Chennai", "Tamil Nadu", 13.0827, 80.2707, ["Madras", "Sriperumbudur", "Oragadam"], true),
  c("hosur", "Hosur", "Tamil Nadu", 12.7409, 77.8253),
  c("salem", "Salem", "Tamil Nadu", 11.6643, 78.146),
  c("coimbatore", "Coimbatore", "Tamil Nadu", 11.0168, 76.9558, [], true),
  c("tiruchirappalli", "Tiruchirappalli", "Tamil Nadu", 10.7905, 78.7047, ["Trichy"]),
  c("madurai", "Madurai", "Tamil Nadu", 9.9252, 78.1198),
  c("thoothukudi", "Thoothukudi", "Tamil Nadu", 8.7642, 78.1348, ["Tuticorin", "V.O.C. Port"]),
  c("erode", "Erode", "Tamil Nadu", 11.341, 77.7172),
  // ---- Andhra Pradesh ----
  c("visakhapatnam", "Visakhapatnam", "Andhra Pradesh", 17.6868, 83.2185, ["Vizag"], true),
  c("vijayawada", "Vijayawada", "Andhra Pradesh", 16.5062, 80.648),
  c("guntur", "Guntur", "Andhra Pradesh", 16.3067, 80.4365),
  c("kakinada", "Kakinada", "Andhra Pradesh", 16.9891, 82.2475),
  c("nellore", "Nellore", "Andhra Pradesh", 14.4426, 79.9865),
  c("tirupati", "Tirupati", "Andhra Pradesh", 13.6288, 79.4192),
  // ---- Kerala ----
  c("kochi", "Kochi", "Kerala", 9.9312, 76.2673, ["Cochin", "Ernakulam"], true),
  c("thrissur", "Thrissur", "Kerala", 10.5276, 76.2144),
  c("kozhikode", "Kozhikode", "Kerala", 11.2588, 75.7804, ["Calicut"]),
  c("kollam", "Kollam", "Kerala", 8.8932, 76.6141, ["Quilon"]),
  c("thiruvananthapuram", "Thiruvananthapuram", "Kerala", 8.5241, 76.9366, ["Trivandrum"]),
  // ---- Goa ----
  c("panaji", "Panaji", "Goa", 15.4909, 73.8278, ["Panjim"]),
  c("mormugao", "Mormugao", "Goa", 15.2667, 73.9667, ["Marmagao", "Vasco da Gama"]),
  // ---- Odisha ----
  c("bhubaneswar", "Bhubaneswar", "Odisha", 20.2961, 85.8244, [], true),
  c("cuttack", "Cuttack", "Odisha", 20.4625, 85.8828),
  c("rourkela", "Rourkela", "Odisha", 22.2604, 84.8536),
  // ---- Chhattisgarh ----
  c("raipur", "Raipur", "Chhattisgarh", 21.2514, 81.6296, [], true),
  c("bhilai", "Bhilai", "Chhattisgarh", 21.1938, 81.3509),
  c("bilaspur-cg", "Bilaspur", "Chhattisgarh", 22.0797, 82.1491),
  // ---- Jharkhand & West Bengal ----
  c("jamshedpur", "Jamshedpur", "Jharkhand", 22.8046, 86.2029),
  c("ranchi", "Ranchi", "Jharkhand", 23.3441, 85.3096),
  c("dhanbad", "Dhanbad", "Jharkhand", 23.7957, 86.4304),
  c("kolkata", "Kolkata", "West Bengal", 22.5726, 88.3639, ["Calcutta", "Howrah"], true),
  c("haldia", "Haldia", "West Bengal", 22.0667, 88.1194),
  c("durgapur", "Durgapur", "West Bengal", 23.5204, 87.3119),
  c("asansol", "Asansol", "West Bengal", 23.6739, 86.9524),
  c("siliguri", "Siliguri", "West Bengal", 26.7271, 88.3953),
  // ---- Bihar ----
  c("patna", "Patna", "Bihar", 25.5941, 85.1376),
  c("muzaffarpur", "Muzaffarpur", "Bihar", 26.1209, 85.3647),
  // ---- North-East ----
  c("guwahati", "Guwahati", "Assam", 26.1445, 91.7362, ["Dispur"], true),
  c("dibrugarh", "Dibrugarh", "Assam", 27.4728, 94.912),
];

export const CITY_HUBS = CITIES.filter((city) => city.isHub);

/** Case-insensitive find of a city by exact hub name or alias. */
export function findCityByName(query: string): City | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return CITIES.find(
    (city) =>
      city.name.toLowerCase() === q ||
      (city.aliases || []).some((a) => a.toLowerCase() === q)
  );
}

interface CityMatch {
  city: City;
  score: number;
}

function scoreCity(city: City, q: string): number {
  const name = city.name.toLowerCase();
  const state = city.state.toLowerCase();
  const aliases = (city.aliases || []).map((a) => a.toLowerCase());
  if (name.startsWith(q)) return 0;
  if (aliases.some((a) => a.startsWith(q))) return 1;
  if (name.includes(q)) return 2;
  if (aliases.some((a) => a.includes(q))) return 3;
  if (state.startsWith(q) || state.includes(q)) return 4;
  return Number.MAX_SAFE_INTEGER;
}

/** Fuzzy autocomplete across names, aliases, and states. Sorted by relevance. */
export function searchCities(query: string, limit = 8): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const matches: CityMatch[] = [];
  for (const city of CITIES) {
    const score = scoreCity(city, q);
    if (score !== Number.MAX_SAFE_INTEGER) {
      matches.push({ city, score });
    }
  }
  matches.sort((a, b) => a.score - b.score || a.city.name.localeCompare(b.city.name));
  return matches.slice(0, limit).map((m) => m.city);
}