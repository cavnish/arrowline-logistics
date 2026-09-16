import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const EMAIL = "web.grow.india07@gmail.com";
const PASSWORD = process.env.ADMIN_API_KEY;

const { data: byEmail } = await supabase.auth.admin.listUsers({ page: 1, perPage: 100 });
const user = (byEmail.users || []).find((u) => u.email === EMAIL);
if (!user) {
  console.log("USER NOT FOUND");
  process.exit(1);
}
console.log("user:", user.id, "| confirmed:", user.email_confirmed_at, "| last_sign_in:", user.last_sign_in_at);

const { data, error } = await supabase.auth.admin.updateUserById(user.id, { password: PASSWORD });
if (error) {
  console.log("PASSWORD SET FAIL:", error.message);
  process.exit(1);
}
console.log("PASSWORD SET OK for", data.user.email);

const { error: signErr } = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
console.log("signInWithPassword test:", signErr ? "FAIL " + signErr.message : "OK");