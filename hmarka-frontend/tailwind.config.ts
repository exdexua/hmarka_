import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#00E5FF", // Electric Cyan
        "secondary": "#CCFF00", // Lime Green
        "background-light": "#f5f8f8",
        "background-dark": "#121212", // Deep Anthracite
        "surface": "#0A0A0A",
        "border-color": "#2E2E2E",
        "text-muted": "#8A8F98",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["Manrope", "sans-serif"],
        "mono": ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        "DEFAULT": "0px",
        "sm": "4px",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
    },
  },
  plugins: [
require('@tailwindcss/typography')],
};

export default config;
