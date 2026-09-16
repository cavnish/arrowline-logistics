import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const email = process.env.ADMIN_EMAIL || "web.grow.india07@gmail.com";
const password = process.env.ADMIN_API_KEY;

const { data: users, error: listErr } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
if (listErr) {
  console.log("LIST_USERS_ERROR:", listErr.message);
  process.exit(1);
}
const user = (users.users || []).find((u) => u.email === email);
console.log("USER_FOUND:", user ? "YES" : "NO");
if (user) {
  console.log("USER_ID:", user.id);
  console.log("EMAIL_CONFIRMED_AT:", user.email_confirmed_at);
  console.log("BANNED:", user.banned_until || null);
  console.log("DELETED:", user.deleted_at || null);
  console.log("PHONE_CONFIRMED:", user.phone_confirmed_at || null);
  console.log("LAST_SIGN_IN:", user.last_sign_in_at || null);
  console.log("CREATED_AT:", user.created_at);
}

const { data: sign, error: signErr } = await supabase.auth.signInWithPassword({ email, password });
console.log("SIGNIN_WITH_PASSWORD:", signErr ? "FAIL -> " + signErr.message : "OK user=" + (sign?.user?.email || "?"));