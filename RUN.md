# How to run Ramadan Goal Companion

You have two processes that need to run **at the same time**:

1. The **backend server** (Node) — handles signup, login, goals, daily progress.
2. The **mobile app** (Expo) — what you actually see and use.

You can run the app in three places: a **web browser**, an **Android/iOS phone**, or an **emulator**. Pick one. The server setup is the same for all three.

---

## Step 1 — Start the backend (do this once, leave it running)

Open **Command Prompt**, then:

```cmd
cd "C:\Users\ameen\OneDrive\Desktop\Apps\Ramadan Tracker\server"
rmdir /s /q node_modules
del /q package-lock.json
copy .env.example .env
npm install
npm run dev
```

You should see:

```
Ramadan Goal Companion server listening on :4000
```

Leave that window open. If you close it, the app can't talk to the backend.

> No SMTP keys yet? That's fine — when you sign up, the 6-digit verification code is printed in this server window. Copy it from there into the app.

---

## Step 2 — Start the mobile app

Open a **second** Command Prompt window:

```cmd
cd "C:\Users\ameen\OneDrive\Desktop\Apps\Ramadan Tracker\mobile"
rmdir /s /q node_modules
del /q package-lock.json
npm install
```

Now choose one of the three options below.

---

### Option A — Run in your web browser (easiest, no phone needed)

```cmd
npx expo start --web
```

It opens **http://localhost:8081** automatically. Done.

**Make it look like a phone:** open Chrome DevTools (F12 or Ctrl+Shift+I), click the device-toolbar icon (Ctrl+Shift+M), and pick "iPhone 14 Pro" or any phone preset. The app is sized for phone screens; it'll feel cramped on a full desktop window.

**No further setup needed for the server URL** — the browser can talk to `localhost:4000` directly.

---

### Option B — Run on your physical phone (real device)

You need:

- The **Expo Go** app on your phone — install from the App Store (iOS) or Play Store (Android).
- Your phone and PC on the **same Wi-Fi network**.

#### B.1 Find your PC's LAN IP

In the second Command Prompt window:

```cmd
ipconfig
```

Look for the section under your active adapter (usually "Wireless LAN adapter Wi-Fi") and find the line **IPv4 Address**, e.g.:

```
IPv4 Address. . . . . . . . . . . : 192.168.1.42
```

Remember that number.

#### B.2 Start Expo

```cmd
npx expo start
```

A QR code appears in the terminal.

#### B.3 Open the app on your phone

- **Android:** Open Expo Go → tap "Scan QR code" → scan the terminal QR.
- **iOS:** Open the iPhone camera → point at the QR → tap the Expo banner that pops up.

The app loads. You'll see the **Get Started** screen with a small "Server: …" line at the bottom.

#### B.4 Point the app at your PC

The "Server: …" line will say `http://localhost:4000` — that won't work from a phone. Tap it. In the **Server URL** screen:

1. Replace `localhost` with your PC's IP from B.1, e.g. `http://192.168.1.42:4000`.
2. Tap **Test connection** — it should say "Server is reachable."
3. Tap **Save**.

You're now connected. Go back and Sign Up / Login.

**If "Test connection" fails:**
- Make sure the server window from Step 1 is still running.
- Make sure phone + PC are on the same Wi-Fi.
- Windows Firewall might be blocking port 4000. Allow Node.js through Private networks when prompted, or run this once as Administrator:
  ```cmd
  netsh advfirewall firewall add rule name="Ramadan App Server" dir=in action=allow protocol=TCP localport=4000
  ```

#### Alternative if your Wi-Fi blocks LAN connections

Some routers (public/hotel Wi-Fi, work Wi-Fi) block phone↔PC traffic. Use a tunnel instead:

```cmd
npx expo start --tunnel
```

This routes traffic through Expo's servers so the phone can find your PC anywhere. The server URL in the app still needs to be your PC's address — but you'd typically need to deploy the backend for a real tunnel use case. For local development, fix the Wi-Fi instead.

---

### Option C — Run in an Android emulator (Android Studio required)

```cmd
npx expo start --android
```

Expo will look for a running Android emulator. If you have Android Studio installed with at least one AVD created, it'll launch the app there. The emulator can reach your PC's localhost via `http://10.0.2.2:4000` — set that in the Server URL screen.

---

## Step 3 — Use the app

1. **Get Started** → Sign Up.
2. Enter name, email, password. Tap **Continue**.
3. Check the **server window** (from Step 1) for the 6-digit code, or your inbox if you configured SMTP.
4. Enter the code → **Verify and continue**.
5. Create a profile (Adult or Child).
6. Tap **Set up goals** → pick a category → multi-select example goals → **Generate**.
7. Back on the Dashboard, tap goals to mark them complete. Tap **Done** any time to leave; nothing is locked or finalized.
8. Settings (gear icon top-right of Dashboard) has Change Password, Update Email, Server URL, Profiles, Log out.

---

## Common errors and fixes

| Error | What it means | Fix |
| --- | --- | --- |
| `Cannot reach http://localhost:4000` (on phone) | Phone is trying to find server on itself, not your PC | Tap "Server" at the bottom of Get Started → enter `http://YOUR_PC_IP:4000` |
| `Unable to resolve "react-dom"` etc. on web | Web deps not installed | Run `npx expo install react-native-web react-dom @expo/metro-runtime` |
| `Network request failed` everywhere | Server isn't running | Re-run `npm run dev` in the server folder |
| `Module not found: better-sqlite3` | Old broken install lingering | Delete `server/node_modules` and `server/package-lock.json`, then `npm install` again |
| QR code scan loads then says "Something went wrong" | Phone and PC on different networks | Switch phone to the same Wi-Fi as PC, or use `npx expo start --tunnel` |

---

## Quick reference

| What you want | Command (in `mobile/`) |
| --- | --- |
| Run in browser | `npx expo start --web` |
| Run on phone (same Wi-Fi) | `npx expo start` then scan QR |
| Run via tunnel | `npx expo start --tunnel` |
| Run on Android emulator | `npx expo start --android` |
| Run on iOS simulator (macOS) | `npx expo start --ios` |

| What you want | Command (in `server/`) |
| --- | --- |
| Start backend in dev mode | `npm run dev` |
| Start backend in prod mode | `npm start` |
