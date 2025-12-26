/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        os: {
          bg: "#1e1e2e", // Dark OS background example
          sidebar: "#181825",
          accent: "#cba6f7",
          text: "#cdd6f4",
          subtext: "#a6adc8",
          overlay: "rgba(30, 30, 46, 0.8)",
        }
      }
    },
  },
  plugins: [],
}
