import { Easing } from 'react-native';

// Smooth deceleration — default easing for transitions and list entries
export const easeStandard = Easing.bezier(0.4, 0.0, 0.2, 1);

// Fast out — for confirmations and completions (goal check, Done tap)
export const easeCompletion = Easing.bezier(0.2, 0.0, 0.0, 1);

export const durations = {
  focusGlow: 120,     // OTP cell border glow on focus
  togglePhase1: 140,  // Checkbox scale on completion
  togglePhase2: 220,  // Checkbox glow ring expand and dissolve
  listItem: 200,      // Profile settings row slide-in
  listStagger: 30,    // Delay between each settings row
  goalEntry: 220,     // Goal list item fade+slide on initial load
  goalStagger: 40,    // Delay between each goal item
  doneButtonIn: 240,  // Done button slide-up reveal after first toggle
  dayCardPulse: 260,  // Home day card single pulse on mount
  doneTap: 320,       // Done tap → screen fade before navigation
  logout: 320,        // Logout → screen fade before signOut
};
