# 🗄️ Complete MongoDB + Email Setup Guide for Arrowline

This is your **exact step-by-step guide** to collect customer inquiries in your MongoDB Atlas cluster and receive email notifications.

Your Atlas cluster host: `cluster0.3kftk1c.mongodb.net`

---

## 📋 What You Need Before Starting

- ✅ Your MongoDB Atlas cluster (you already have this)
- ✅ A database username + password from Atlas
- ✅ An email account for sending notifications (Gmail recommended for testing)
- ⏱️ ~15 minutes

---

# PART 1 — Get Your MongoDB Connection String (5 min)

### Step 1.1 — Create a database user

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → sign in
2. Left sidebar → **SECURITY** → **Database Access**
3. Click **"+ ADD NEW DATABASE USER"**
4. Choose **"Password"** authentication method
5. Username: `arrowline-app` (or anything you like)
6. Password: click **"Autogenerate Secure Password"** → **COPY IT NOW** (you won't see it again)
7. **Database User Privileges** → **"Read and write to any database"**
8. Click **"Add User"**

### Step 1.2 — Whitelist your IP

1. Left sidebar → **SECURITY** → **Network Access**
2. Click **"+ ADD IP ADDRESS"**
3. For **testing**: click **"ALLOW ACCESS FROM ANYWHERE"** (`0.0.0.0/0`)
   *For production, you'll restrict this to just your deployment's IP later.*
4. Click **"Confirm"**

### Step 1.3 — Build your connection string

Take this template:
```
mongodb+srv://<db_username>:<db_password>@cluster0.3kftk1c.mongodb.net/arrowline?retryWrites=true&w=majority
```

Replace:
- `<db_username>` → the username you created (e.g. `arrowline-app`)
- `<db_password>` → the password you copied

⚠️ **If your password contains special characters** (`@`, `#`, `$`, `%`, `:`, `/`, `?`), URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `:` → `%3A`

Your final string will look like:
```
mongodb+srv://arrowline-app:Kx8h2%40Mq7Zn@cluster0.3kftk1c.mongodb.net/arrowline?retryWrites=true&w=majority
```

**Save this — you'll paste it into `.env` in a minute.**

---

# PART 2 — Get Your SMTP (Email) Credentials (5 min)

## Option A — Gmail (fastest for testing)

1. Enable **2-Step Verification** on your Google account:  
   [myaccount.google.com/security](https://myaccount.google.com/security) → 2-Step Verification → Turn On

2. Create an **App Password**:  
   [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)  
   → App name: "Arrowline Website" → **Create**  
   → You'll see a 16-character password like `abcd efgh ijkl mnop`  
   → **Copy it (remove the spaces)** → e.g. `abcdefghijklmnop`

3. Your SMTP credentials are:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=abcdefghijklmnop      ← the 16-char app password (no spaces)
   ```

## Option B — Zoho Mail (recommended for `@arrowlinelogistics.in` domain)

1. Sign into Zoho Mail admin console
2. Create a mailbox `mundra@arrowlinelogistics.in`
3. Generate an app-specific password: Settings → Security → App Passwords
4. Your credentials:
   ```
   SMTP_HOST=smtp.zoho.in
   SMTP_PORT=587
   SMTP_USER=mundra@arrowlinelogistics.in
   SMTP_PASS=<your-zoho-app-password>
   ```

---

# PART 3 — Run the Backend Locally (3 min)

### Step 3.1 — Install dependencies

Open a terminal in the project root:

```bash
cd server
npm install
```

### Step 3.2 — Create `.env` file

```bash
cp .env.example .env
```

### Step 3.3 — Edit `server/.env`

Open the file and fill in the real values:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173,https://www.arrowlinelogistics.in

# From Part 1 above
MONGODB_URI=mongodb+srv://arrowline-app:YOUR_ENCODED_PASS@cluster0.3kftk1c.mongodb.net/arrowline?retryWrites=true&w=majority

# From Part 2 above
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop
FROM_EMAIL=mundra@arrowlinelogistics.in

# WHO gets notified for each new inquiry (comma-separated)
NOTIFY_EMAILS=mundra@arrowlinelogistics.in,vinay@arrowlinelogistics.in
```

### Step 3.4 — Start the server

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚛 Arrowline API running on http://localhost:5000
```

### Step 3.5 — Test it

Open a new terminal and run:
```bash
curl -X POST http://localhost:5000/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "company": "Test Corp",
    "email": "your-email@gmail.com",
    "phone": "+919876543210",
    "service": "Road Transport",
    "message": "Test inquiry"
  }'
```

Expected response:
```json
{
  "ok": true,
  "referenceNumber": "ALQ-834271",
  "storedInDatabase": true,
  "emailSent": true,
  "message": "Inquiry received..."
}
```

✅ Check your Gmail inbox — you should receive **2 emails**:
1. Internal notification to your team
2. Client acknowledgement to the test email

✅ Check MongoDB Atlas → **Browse Collections** → you'll see the `arrowline` database with a `leads` collection containing your test inquiry.

---

# PART 4 — Connect the Frontend (1 min)

### In the **project root** (NOT the `server/` folder):

Create a file called `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Then restart your Vite dev server:
```bash
# Stop your running Vite server (Ctrl+C) and restart:
npm run dev
```

**That's it!** Now every form submission on your website will:
1. POST to `http://localhost:5000/api/lead`
2. Save the inquiry to MongoDB Atlas
3. Send emails to your team + client
4. Show green ✓ "Saved to DB" and "Email Sent" badges in the success modal

---

# PART 5 — Deploy to Production (10 min)

You have 3 great free options:

## 🚀 Option A — Deploy to Render (recommended)

1. Push your project to a GitHub repo
2. Go to [render.com](https://render.com) → sign up (free)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub → select your Arrowline repo
5. Configure:
   - **Name**: `arrowline-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free
6. Scroll to **"Environment Variables"** → add all the same variables from `server/.env`  
   Also add:
   - `NODE_VERSION=20`
7. Click **"Create Web Service"**
8. Wait ~2 minutes. Your API is live at something like `https://arrowline-api.onrender.com`

Now update your **frontend** `.env`:
```env
VITE_API_URL=https://arrowline-api.onrender.com
```

Rebuild frontend & deploy.

## 🚀 Option B — Deploy to Railway

1. Install: `npm install -g @railway/cli`
2. `cd server && railway login && railway init && railway up`
3. Go to [railway.app](https://railway.app) → your project → **Variables** tab → add all env vars
4. Get your public URL from the **Settings** tab

## 🚀 Option C — Deploy to Vercel (as serverless functions)

If you already deploy your frontend to Vercel, use serverless functions instead:

1. Create `api/lead.js` in the **root** of your project (Vercel auto-detects `/api/*` as serverless)
2. Vercel handles the deployment — no separate server needed

*Ask if you'd like me to build this option — I can create the Vercel-serverless version too.*

---

# PART 6 — Verify Everything Works

Test the full flow:
1. Open your website (localhost or production)
2. Submit an inquiry through the "Get a Free Quote" form
3. Check the success modal — you should see:
   - ✅ Green "Saved to DB" badge
   - ✅ Green "Email Sent" badge
   - A real reference number like `ALQ-234891`
4. Click **"Download PDF Slip"** → beautiful branded PDF downloads
5. Check MongoDB Atlas → **Browse Collections** → `arrowline.leads` → your inquiry is there
6. Check your email inbox → 2 emails received

---

# 🛠️ Troubleshooting

| Problem | Solution |
|---|---|
| `MongoServerError: bad auth` | Wrong username/password. Regenerate the DB user password in Atlas → Database Access. Remember to URL-encode special chars. |
| `MongooseServerSelectionError` | IP not whitelisted. Go to Atlas → Network Access → add your IP or `0.0.0.0/0` for testing. |
| `SMTP: Invalid login` | For Gmail, you MUST use an **App Password**, not your regular password. Also confirm 2-Step Verification is enabled. |
| Emails go to spam | Set up SPF, DKIM, DMARC DNS records for your domain. Or use a service like SendGrid/Postmark. |
| Frontend shows "Mock Mode" | Check that `.env` in the ROOT (not `server/`) has `VITE_API_URL` set, AND you restarted `npm run dev`. |
| CORS error in browser console | Add your frontend URL to `CORS_ORIGIN` in `server/.env` (comma-separated). |

---

# 📊 View Your Inquiries

## In MongoDB Atlas Dashboard
1. Atlas → **Database** → **Browse Collections**
2. Database: `arrowline` → Collection: `leads`
3. Each row is one inquiry with all details

## Via API (protected admin endpoint)

Add `ADMIN_API_KEY=your-random-secret-here` to `server/.env`, then:
```bash
curl https://arrowline-api.onrender.com/api/leads?limit=50 \
  -H "x-api-key: your-random-secret-here"
```

---

# 🔒 Production Security Checklist

- [ ] Restrict Network Access in Atlas to only your API server's IP
- [ ] Rotate MongoDB password every 90 days
- [ ] Use a dedicated `no-reply@arrowlinelogistics.in` for SMTP sender
- [ ] Set up SPF, DKIM, DMARC DNS records for your domain
- [ ] Add `ADMIN_API_KEY` environment variable
- [ ] Set `CORS_ORIGIN` to only your production frontend domain (remove `*`)
- [ ] Enable MongoDB Atlas monitoring & alerts
- [ ] Set up a daily backup export from MongoDB Atlas

---

Need help with any step? Just ask! 🚛
