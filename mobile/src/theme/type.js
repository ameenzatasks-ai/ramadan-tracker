// Typography. Each weight is loaded as its own font family (see App.js useFonts),
// so we reference the exact family per role rather than relying on fontWeight —
// React Native does not synthesise weights from a single family the way the web does.
//
//   Fraunces — a soft, old-style serif with warmth and character. Used for display
//              and headings to give the app a calm, considered, slightly spiritual voice.
//   Inter    — a clean, highly legible humanist sans. Used for all body and UI text.
export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  heading: 'Fraunces_600SemiBold',
  body: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  // System fallbacks used until the custom fonts finish loading.
  serifFallback: 'Georgia',
  sansFallback: 'System',
};

export const type = {
  display:     { fontFamily: fonts.displayBold, fontSize: 36, lineHeight: 43, letterSpacing: -0.5 },
  h1:          { fontFamily: fonts.heading, fontSize: 27, lineHeight: 33, letterSpacing: -0.3 },
  h2:          { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  body:        { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyStrong:  { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24 },
  small:       { fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  smallStrong: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  eyebrow:     { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.4 },
  button:      { fontFamily: fonts.bold, fontSize: 16, letterSpacing: 0.2 },
};
