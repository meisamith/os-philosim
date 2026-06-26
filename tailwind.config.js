/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0f",
        panel: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.08)",
        accent: "#6366f1",
        eating: "#10b981",
        hungry: "#f59e0b",
        deadlock: "#f43f5e",
        waiting: "#64748b",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};