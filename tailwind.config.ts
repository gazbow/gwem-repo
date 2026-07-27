import type { Config } from "tailwindcss";

// Landart brand tokens (Build Spec section 4). Do not invent new colours or fonts.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#363636",
        gold: "#c5a47e",
        page: "#ece9e3", // off-white page background
        surface: "#ffffff", // card / surface white
        panel: "#faf8f4", // warm off-white panel
        muted: "#8a8680", // muted text
        hairline: "#d8d4cc", // hairline border
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
