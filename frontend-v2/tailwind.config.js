/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1630",
          "navy-soft": "#15284A",
          gold: "#C89B3C",
          copper: "#8B4E2E",
          ivory: "#F5F1E8",
          mist: "#E7E0D2",
          ink: "#111827"
        }
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["Manrope", "Segoe UI", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 24px 60px rgba(11, 22, 48, 0.16)",
        glow: "0 0 0 1px rgba(200, 155, 60, 0.2), 0 18px 48px rgba(11, 22, 48, 0.24)"
      },
      backgroundImage: {
        "brand-grid": "radial-gradient(circle at 1px 1px, rgba(200,155,60,0.12) 1px, transparent 0)",
        "hero-fade": "linear-gradient(135deg, rgba(11,22,48,0.96) 0%, rgba(21,40,74,0.86) 48%, rgba(139,78,46,0.38) 100%)"
      }
    }
  },
  plugins: []
};
