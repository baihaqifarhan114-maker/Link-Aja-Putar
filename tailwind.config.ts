import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        laja: {
          red: "var(--laja-red)",
          "red-dark": "var(--laja-red-dark)",
          magenta: "var(--laja-magenta)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
        },
        muted: "var(--muted)",
        line: "var(--line)",
        bg: "var(--bg)",
        card: "var(--card)",
        halal: {
          DEFAULT: "var(--halal)",
          soft: "var(--halal-soft)",
        },
        warn: "var(--warn)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        xl: "var(--radius)",
        lg: "var(--radius)",
        md: "var(--radius-sm)",
        sm: "var(--radius-sm)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        float: "var(--shadow-float)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        canvas: "390px",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sweep: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "100%": { transform: "translateX(220%) skewX(-20deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        sweep: "sweep 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
