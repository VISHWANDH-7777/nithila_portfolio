/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          900: "#0b1321"
        },
        cyanx: {
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488"
        },
        bluex: {
          400: "#38bdf8",
          500: "#0ea5e9"
        }
      },
      boxShadow: {
        soft: "0 10px 35px rgba(15, 23, 42, 0.11)",
        glow: "0 0 0 1px rgba(20, 184, 166, 0.3), 0 12px 24px rgba(20, 184, 166, 0.25)"
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(56, 189, 248, 0.45)" },
          "100%": { boxShadow: "0 0 0 16px rgba(56, 189, 248, 0)" }
        }
      },
      animation: {
        floatY: "floatY 6s ease-in-out infinite",
        gradientShift: "gradientShift 12s ease infinite",
        pulseRing: "pulseRing 1.9s ease-out infinite"
      }
    }
  },
  plugins: []
};
