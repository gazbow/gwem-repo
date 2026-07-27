import type { Config } from "tailwindcss";

// Landart brand tokens (Build Spec section 4). Do not invent new colours or fonts.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme, matching the main Landart site (charcoal ground, off-white text, gold accent).
        charcoal: "#363636", // used as text-on-gold, and the page ground
        gold: "#c5a47e", // accent (unchanged)
        cream: "#ece9e3", // primary text / off-white on dark
        page: "#363636", // app background (charcoal)
        ink2: "#2b2b2b", // darker band for contrast (hero / footer)
        surface: "#404040", // raised card surface
        panel: "#47423a", // warm dark fill (selected tiles, side panels)
        muted: "#ada89f", // muted text on dark
        hairline: "#4f4d49", // hairline border on dark
      },
      fontFamily: {
        // ivyora-display is the wordmark serif; Cormorant is the placeholder fallback (spec 4).
        display: ["var(--font-display)", "Cormorant", "Georgia", "serif"],
        body: ["var(--font-body)", "Montserrat", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.18em", // gold uppercase section labels
        button: "0.12em",
      },
      borderRadius: {
        // Firm brand rule: no border-radius anywhere. Corners are square.
        none: "0",
      },
    },
  },
  plugins: [],
};

export default config;
