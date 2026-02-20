import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'DM Mono'", "Courier New", "monospace"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        brand: {
          green: "#00ff88",
          "green-dim": "#00c060",
          "green-dark": "#001a0d",
          red: "#ff4060",
          "red-dark": "#1a0005",
          yellow: "#ffaa00",
          "yellow-dark": "#1a1200",
        },
        surface: {
          DEFAULT: "#050508",
          card: "#0a0a12",
          border: "#1a1a2e",
          muted: "#111",
        },
      },
      keyframes: {
        scanline: {
          "0%, 100%": { transform: "translateY(-80px)", opacity: "0" },
          "50%": { transform: "translateY(80px)", opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        scanline: "scanline 1.8s ease-in-out infinite",
        fadeUp: "fadeUp 0.2s ease",
        slideUp: "slideUp 0.28s ease",
        pulse2: "pulse2 2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
