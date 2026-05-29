import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0b1f33",
        ink: "#17212b",
        muted: "#5f6f80",
        line: "#d8e1ea",
        soft: "#f6f8fb",
        accent: "#1f9d7a",
        "accent-dark": "#14755b"
      },
      boxShadow: {
        trust: "0 16px 40px rgba(11, 31, 51, 0.09)"
      },
      borderRadius: {
        card: "8px"
      }
    }
  },
  plugins: []
};

export default config;
