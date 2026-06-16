# Ramadan Goal Companion

A mobile application that helps Muslims plan, manage, and track daily goals
across the thirty days of Ramadan.

This repo contains two pieces:

- `mobile/` — Expo React Native app (the user-facing mobile application).
- `server/` — Node.js backend that handles authentication, email OTP, Google
  Sign-In verification, AI goal expansion, and storage.

The app is mobile-only. Run it on an iOS or Android device (or simulator) via
Expo Go during development.

---

## 1. Prerequisites

- Node.js 20+ and npm
- iOS Simulator (macOS) or Android emulator, **or** the Expo Go app on your
  physical phone.
- (Optional but recommended for a real production experience) credentials for:
  - **SMTP** — any provider that supports SMTP (Resend, SendGrid, Mailgun,
    Postmark, or a Gmail App Password). Used to send the 6-digit verification
    code from `Ramadan Goal Companion Auth`.
  - **Google OAuth 2.0 client ID** — from Google Cloud Console.
  - **Anthropic API key** — for AI expansion of custom goals into a 30-day
    checklist. Without one, the app falls back to a deterministic per-day
    template.

The app **works end-to-end without any of these keys** in development: when
SMTP is not configured the server logs the OTP to stdout so you can finish
signup locally, and goal expansion uses the rule-based fallback.

---

## 2. Backend setup (`server/`)

```bash
cd server
npm install
cp .env.example .env
# fill in values you have; leave the rest blank
npm run dev
```

The server listens on `http://localhost:4000`. Data is stored in
`server/data.sqlite` (created automatically).

### Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP port (default `4000`). |
| `JWT_SECRET` | Long random string used to sign session tokens. **Required for production.** |
| `RAMADAN_START_DATE` / `RAMADAN_END_DATE` | Gregorian dates that bracket Ramadan for the active year. While "today" is inside this window, goals are locked and the dashboard reports the current Ramadan day. |
| `EMAIL_FROM_NAME` | Defaults to `Ramadan Goal Companion Auth`. This is the verified sender brand shown on the verification email. **Do not change to a third-party brand.** |
| `EMAIL_FROM_ADDRESS` | The verified sender address you registered with your SMTP provider. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | SMTP transport settings. Leave blank in development — the OTP will be printed to the server console. |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 **Web** Client ID for your Google Cloud project. The mobile SDK exchanges its native id-token through this audience. |
| `ANTHROPIC_API_KEY` | Optional. Enables real AI expansion of custom goals into a 30-day checklist. |
| `ANTHROPIC_MODEL` | Optional model override (default `claude-opus-4-7`). |

### What the backend exposes

- `POST /auth/signup` — create unverified account, issue OTP
- `POST /auth/verify` — verify OTP, issue session JWT
- `POST /auth/resend` — resend OTP (with 30s cooldown)
- `POST /auth/login` — email + password login
- `POST /auth/google` — exchange a Google id-token for a session JWT
- `GET  /auth/me` — current user
- `POST /auth/change-password`
- `POST /auth/request-email-change` / `POST /auth/confirm-email-change`
- `GET/POST/PATCH/DELETE /profiles*` — profile CRUD (one account, many profiles)
- `GET/POST/DELETE /goals*` — goal management, locked once Ramadan starts (423)
- `GET /progress/today` — today's day-by-day entries
- `POST /progress/toggle/:dayId` — toggle a single day's entry

---

## 3. Mobile setup (`mobile/`)

```bash
cd mobile
npm install
npm start
```

Open the QR code in Expo Go on your phone, or press `i` / `a` for
simulators.

### Configure the API base URL

`mobile/app.json` -> `expo.extra.apiBaseUrl` defaults to
`http://localhost:4000`. On a physical phone you need to point it at your
computer's LAN IP, e.g. `http://192.168.1.42:4000`. Edit `app.json` or pass
the value via `EXPO_PUBLIC_API_BASE`-style overrides as you prefer.

### Configure Google Sign-In

In Google Cloud Console create OAuth 2.0 Client IDs:

- **Web** client (required) — set its client id as both
  `expo.extra.googleWebClientId` and the server's `GOOGLE_CLIENT_ID`.
- **iOS** client — bundle id `com.ramadangoalcompanion.app`.
- **Android** client — package `com.ramadangoalcompanion.app` with your
  development SHA-1.

Drop the resulting IDs into `mobile/app.json` (`googleWebClientId`,
`googleIosClientId`, `googleAndroidClientId`). The Google button stays
disabled until at least one client id is present.

The flow:

1. `expo-auth-session` opens Google's account picker.
2. Google returns an `id_token`.
3. The mobile app calls `POST /auth/google` with that token.
4. The server verifies the token's signature and audience against
   `GOOGLE_CLIENT_ID`, creates or links the account, and returns a session
   JWT.

No age or profile-type prompt is shown during Google sign-in. The profile
type (Adult / Child) is chosen later, inside the in-app onboarding.

---

## 4. Verifying the spec end-to-end

Once both processes are running:

1. **Sign up** — enter name, email, password. Check the server console (or
   inbox) for the 6-digit code. Verify -> you are signed in and persisted.
2. **Create a profile** — Adult or Child. Profile picker (ChatGPT-style)
   lets you create as many as you want and switch between them instantly.
3. **Set up goals** — pick a category (Salah, Quran, Charity, Family,
   Adhkar, Dua), see 4–5 example goals, multi-select, tap Generate. Or
   `Create your own goal` for a free-form entry that gets expanded into 30
   daily items.
4. **Dashboard** — shows only today's entries, sorted by progress. Tapping
   an entry toggles it on the spot without navigating away. The Done
   button returns you to the dashboard without finalising anything; you can
   re-enter and continue.
5. **Settings** — Account info, change password, update email (with code
   verification on the new address), account security, logout.
6. **Logout** — fully clears the secure-store token + cached user. You
   land back on the Get Started screen. There are no phantom users.
7. **Ramadan lock** — when today's date is between
   `RAMADAN_START_DATE` and `RAMADAN_END_DATE`, all add / remove
   controls are hidden, the API returns `423 ramadan_locked` for write
   attempts, and the dashboard counter advances from Day 1 to Day 30.

---

## 5. Strict palette

The whole app obeys the spec palette without deviation:

| Token | Hex |
| --- | --- |
| Background | `#004643` |
| Headline | `#fffffe` |
| Paragraph | `#abd1c6` |
| Button | `#f9bc60` |
| Button text | `#001e1d` |
| Illustration stroke | `#001e1d` |
| Illustration main | `#e8e4e6` |
| Illustration highlight | `#f9bc60` |
| Illustration secondary | `#abd1c6` |
| Illustration tertiary | `#e16162` |

---

## 6. Layout

- `mobile/App.js` — providers + navigation
- `mobile/src/screens/*` — every screen described in the spec
- `mobile/src/components/*` — Screen, Header, Button, Input, Card,
  Checkbox, CategoryIcon, ProfileIcon
- `mobile/src/context/*` — AuthContext, ProfileContext
- `mobile/src/lib/api.js` — typed fetch wrapper with friendly error messages
- `mobile/src/data/goalLibrary.js` — the 50 adult + 50 child goals
- `server/src/routes/*` — auth, profiles, goals, progress
- `server/src/lib/*` — auth helpers, mailer, Google verifier, AI expander,
  Ramadan window math
