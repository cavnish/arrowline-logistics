# 🚛 Arrowline Logistics — Backend API

Production-ready Node.js + Express server that **stores customer inquiries in MongoDB** and **sends professional email notifications** (both to the internal Arrowline team and an acknowledgement to the customer).

---

## ✨ Features

- ✅ `POST /api/lead` — validates and stores inquiries in MongoDB
- ✅ Sends beautifully formatted HTML email to the Arrowline team
- ✅ Sends acknowledgement email to the customer with reference number
- ✅ Rate limiting (20 inquiries per IP per hour)
- ✅ CORS-locked to allowed origins
- ✅ Input validation & sanitisation
- ✅ Health check endpoint at `/health`
- ✅ Admin endpoint `GET /api/leads` (protected by API key)
- ✅ Handles email failures gracefully — inquiry still saved to DB

---

## 🚀 Quick Start (Local Development)

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Set up MongoDB

**Option A — Local MongoDB:**
```bash
# Install MongoDB Community Edition and start it:
mongod --dbpath /path/to/data
```
Your URI will be: `mongodb://localhost:27017/arrowline`

**Option B — MongoDB Atlas (recommended for production):**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas), create a free cluster
2. Add a database user + whitelist your IP (or `0.0.0.0/0` for anywhere)
3. Copy the connection string — it looks like:
   ```
   mongodb+srv://<user>:<pass>@cluster.xxx.mongodb.net/arrowline?retryWrites=true&w=majority
   ```

### 3. Set up SMTP for email

**Recommended: Gmail with App Password**
1. Enable **2-Step Verification** on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate a new App Password (16 characters, no spaces)
4. Use it as `SMTP_PASS` in `.env`

**Alternative providers:**
- **Zoho Mail** (`smtp.zoho.in`, port 587) — for `@arrowlinelogistics.in`
- **SendGrid**, **Mailgun**, **AWS SES** — for high volume
- **Google Workspace** — same as Gmail

### 4. Create `.env`

```bash
cp .env.example .env
```

Then edit `.env` and fill in:
- `MONGODB_URI` — your MongoDB connection string
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — your email credentials
- `NOTIFY_EMAILS` — comma-separated list of team emails (e.g. `mundra@arrowlinelogistics.in,vinay@arrowlinelogistics.in`)
- `CORS_ORIGIN` — your frontend URL (e.g. `http://localhost:5173,https://www.arrowlinelogistics.in`)

### 5. Run the server

```bash
npm run dev     # with auto-reload
# or
npm start       # production
```

You should see:
```
✅ Connected to MongoDB
🚛 Arrowline API running on http://localhost:5000
```

### 6. Configure the frontend

In the **root** of the React project (not `server/`), create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Restart the Vite dev server. Now every contact form submission on the site will:
1. `POST` to `http://localhost:5000/api/lead`
2. Store the inquiry in your MongoDB `leads` collection
3. Send an HTML email to your team
4. Send an acknowledgement email to the customer
5. Return a reference number back to the frontend

---

## 📮 Testing the API

```bash
curl -X POST http://localhost:5000/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Client",
    "company": "Test Corp Pvt Ltd",
    "email": "test@example.com",
    "phone": "+91 9876543210",
    "service": "Road Transport (FTL Services)",
    "message": "20 ft container from Mundra to Delhi NCR."
  }'
```

Expected response:
```json
{
  "ok": true,
  "referenceNumber": "ALQ-847293",
  "storedInDatabase": true,
  "emailSent": true,
  "message": "Inquiry received. Our routing team will respond within 2 hours."
}
```

---

## 🚢 Production Deployment

### Recommended Stack
| Component | Provider |
|---|---|
| API Hosting | **Render**, **Railway**, **Fly.io**, or **AWS EC2** |
| Database | **MongoDB Atlas** (M0 free tier is enough to start) |
| Email | **Zoho Mail** (free for custom domain), **SendGrid**, or **AWS SES** |
| Domain | Point `api.arrowlinelogistics.in` to your API host |

### Deploy to Render (easiest)
1. Push this `server/` folder to a GitHub repo
2. Go to [render.com](https://render.com), create a new **Web Service**
3. Point it to your repo, set the build command to `npm install` and start command to `node index.js`
4. Add all `.env` variables in the Environment section
5. Deploy!

### Deploy to Railway
1. `npm install -g @railway/cli`
2. `railway login && railway init && railway up`
3. Add env vars in Railway dashboard

### After Deploying
- Update the frontend `.env`:
  ```env
  VITE_API_URL=https://api.arrowlinelogistics.in
  ```
- Rebuild the frontend: `npm run build`
- Add `https://www.arrowlinelogistics.in` to `CORS_ORIGIN` in the server env

---

## 🔐 Admin: View All Inquiries

Add `ADMIN_API_KEY=<some-strong-random-string>` to your `.env`, then:

```bash
curl https://api.arrowlinelogistics.in/api/leads?limit=20 \
  -H "x-api-key: <your-key>"
```

Returns JSON of all recent inquiries. Build a simple admin dashboard on top of this later if needed.

---

## 📊 MongoDB Schema

```js
{
  referenceNumber: "ALQ-847293",   // unique
  name: "Test Client",
  company: "Test Corp Pvt Ltd",
  email: "test@example.com",       // indexed
  phone: "+91 9876543210",
  service: "Road Transport (FTL Services)",
  message: "20 ft container from Mundra to Delhi NCR.",
  status: "new",                   // new | contacted | quoted | won | lost
  emailSent: true,
  emailSentAt: ISODate("..."),
  source: "website",
  ipAddress: "203.0.113.45",
  userAgent: "Mozilla/5.0 ...",
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

Query examples:
```js
// Recent 10 inquiries
db.leads.find().sort({createdAt: -1}).limit(10)

// All "new" leads that haven't been contacted
db.leads.find({status: "new"})

// Leads for a specific service
db.leads.find({service: /Coastal/})
```

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `MongoDB connection error` | Verify `MONGODB_URI` and network access rules in Atlas |
| `SMTP authentication failed` | Use an **App Password**, not your regular Gmail password |
| Emails go to spam | Set up **SPF + DKIM + DMARC** records for your domain |
| CORS errors from frontend | Add your frontend URL to `CORS_ORIGIN` |
| Rate limit hit | Adjust the `max` in `leadLimiter` in `index.js` |

---

## 📝 License

Proprietary © Arrowline Logistics Pvt Ltd.
