/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        bree: ["Bree Serif", "serif"],
        caveat: ["Caveat", "cursive"],
        comfort: ["Comfort", "cursive"],
        gloria: ["Gloria Hallelujah", "cursive"],
        indie: ["Indie Flower", "cursive"],
        macondo: ["Macondo", "cursive"],
        protest: ["Protest Riot", "cursive"],
        shadows: ["Shadows Into Light", "cursive"],
      },
    },
  },
  plugins: [],
};
