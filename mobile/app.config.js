// Dynamic Expo config. Everything still lives in app.json; this file only overlays
// the backend URL so it can come from an environment variable at build time.
//
//   - Local dev:  unset -> defaults to http://localhost:4000
//   - Production: set EXPO_PUBLIC_API_BASE to your deployed HTTPS backend, e.g.
//       EXPO_PUBLIC_API_BASE=https://ramadan-goal-companion.fly.dev npx expo export -p web
//
// The app's lib/api.js already reads EXPO_PUBLIC_API_BASE first, but wiring it into
// extra.apiBaseUrl too keeps native builds and the in-app "Server URL" display correct.
export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE ||
      config.extra?.apiBaseUrl ||
      'http://localhost:4000',
  },
});
