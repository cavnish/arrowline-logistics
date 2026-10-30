// Load server/.env relative to this file, not the process working directory.
// This keeps `node server/index.js` (run from the repo root) working exactly
// like `npm start` inside server/, and prevents the frontend's root .env from
// being loaded by mistake (which would leave ADMIN_API_KEY / Supabase unset).
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, ".env") });
