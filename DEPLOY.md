# Deploying Ramadan Goal Companion (free)

Two pieces ship separately:

| Piece | Hosts | What it is |
|-------|-------|------------|
| **Backend** (`server/`) | Fly.io | Node + SQLite API on a persistent volume |
| **Web app** (`mobile/`) | EAS Hosting or Netlify | The Expo web build |
| **Email** | Resend | Sends the verification codes |

Do them in this order: **Backend → Email → Google OAuth → Web app**.

---

## 0. One-time accounts (all free)

- [Fly.io](https://fly.io) — backend host
- [Resend](https://resend.com) — transactional email
- (Web) an [Expo](https://expo.dev) account if you use EAS Hosting, or [Netlify](https://netlify.com)

Install the Fly CLI (PowerShell):

```powershell
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

Then restart your terminal and run `fly version` to confirm.

---

## 1. Deploy the backend to Fly.io

From the project root:

```powershell
cd server
fly auth login
```

Create the app (the name in `fly.toml` must be globally unique — if it's taken,
pick another and update the `app = "..."` line in `fly.toml`):

```powershell
fly apps create ramadan-goal-companion
```

Create the persistent volume for the database (same region as `primary_region`
in `fly.toml`, default `iad`):

```powershell
fly volumes create ramadan_data --region iad --size 1
```

Set your secrets (fill in real values — see steps 2 and 3 for the email + Google ones):

```powershell
fly secrets set `
  JWT_SECRET="PhWRBwmvs1tApdCUUQJQUorPt5MmtaFaudJwTqVVFYSxxnd4e4mCi0aqF9nHtTS6" `
  SMTP_HOST="smtp.resend.com" `
  SMTP_PORT="587" `
  SMTP_SECURE="false" `
  SMTP_USER="resend" `
  SMTP_PASS="<your-resend-api-key>" `
  EMAIL_FROM_NAME="Ramadan Goal Companion" `
  EMAIL_FROM_ADDRESS="<your-verified-resend-sender>" `
  GOOGLE_CLIENT_ID="106791729690-j9o2s3knbblmoiu82gu73ctir444ataq.apps.googleusercontent.com"
```

> Generate a fresh `JWT_SECRET` if you prefer:
> `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

Deploy:

```powershell
fly deploy
```

Keep it to a single machine (one machine per volume):

```powershell
fly scale count 1
```

Verify it's live:

```powershell
fly status
```

Then open `https://<your-app-name>.fly.dev/health` in a browser — you should see
`{"ok":true}`. **Copy that base URL** (`https://<your-app-name>.fly.dev`); you'll
need it for the web app.

---

## 2. Set up email (Resend)

1. Sign up at [resend.com](https://resend.com).
2. Easiest start: use the built-in sender `onboarding@resend.dev` — set
   `EMAIL_FROM_ADDRESS=onboarding@resend.dev`. (To send from your own domain later,
   add and verify the domain under **Domains**.)
3. **API Keys → Create API Key**, copy it.
4. Put it in the `fly secrets set ... SMTP_PASS="<that key>"` from step 1 and
   `fly deploy` again if you'd already deployed.

Gmail still works too, but Resend is more reliable and avoids the spam-folder issue.

---

## 3. Update Google Sign-In for production

In [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services →
Credentials → your Web OAuth client**:

- **Authorized JavaScript origins:** add your web app URL (e.g.
  `https://ramadan-goal-companion.netlify.app` or your EAS Hosting URL).
- **Authorized redirect URIs:** add the same origin (and your Expo auth redirect if
  you build the native app).
- If others will sign in, move the app from **Testing** to **In production** on the
  OAuth consent screen (or add their emails as test users).

---

## 4. Deploy the web app

Point the build at your live backend and export it. From the project root:

```powershell
cd mobile
$env:EXPO_PUBLIC_API_BASE = "https://<your-app-name>.fly.dev"
npx expo export -p web
```

This produces `mobile/dist/`. Host it free, either way:

**Option A — EAS Hosting (Expo's own):**

```powershell
npx eas login
npx eas deploy
```

**Option B — Netlify (drag-and-drop):**
Go to Netlify → **Add new site → Deploy manually** → drag the `mobile/dist` folder in.

Either way you get a public URL. Add that URL to Google OAuth (step 3).

---

## 5. Final checks

- Visit the web app URL, sign up with a real email → you get a code → verify → in.
- Check the backend logs if anything's off: `fly logs` (run in `server/`).
- The data persists across deploys because it's on the `ramadan_data` volume.

## Updating later

- **Backend code change:** `cd server; fly deploy`
- **Web change:** re-run the `expo export` + deploy from step 4
- **Next year's Ramadan dates:** edit `RAMADAN_START_DATE` / `RAMADAN_END_DATE` in
  `server/fly.toml`, then `fly deploy`
