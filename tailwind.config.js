/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        fm: {
          red: { DEFAULT: "#D42B22", dark: "#E63228" },
          mint: { DEFAULT: "#1DB88E", dark: "#3EDEB5" },
          cream: "#F5F0EB",
          dark: "#111111",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Syne'", "'Helvetica Neue'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
