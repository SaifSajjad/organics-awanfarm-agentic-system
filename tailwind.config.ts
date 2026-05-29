import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        farm: {
          green: "#0f4d23",
          heritage: "#0E2419",
          leaf: "#7da23f",
          cream: "#f7f3e8",
          meadow: "#FDFCF7",
          milk: "#FFFFFF",
          wheat: "#c89f41",
          gold: "#CBA72F",
          sage: "#ABCFB8",
          ink: "#16331f",
          success: "#22C55E",
          warning: "#F59E0B"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        label: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(15, 77, 35, 0.12)",
        "soft-card": "0 12px 32px rgba(14, 36, 25, 0.06)",
        premium: "0 24px 70px rgba(14, 36, 25, 0.14)",
        "premium-lg": "0 32px 90px rgba(14, 36, 25, 0.18)"
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "soft-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "quantity-pop": {
          "0%": { transform: "scale(0.92)", opacity: "0.65" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "pin-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(203, 167, 47, 0.55)" },
          "50%": { boxShadow: "0 0 0 14px rgba(203, 167, 47, 0)" }
        },
        "ai-pulse": {
          "0%, 100%": { boxShadow: "0 22px 60px rgba(14, 36, 25, 0.22)" },
          "50%": { boxShadow: "0 22px 60px rgba(14, 36, 25, 0.22), 0 0 0 10px rgba(203, 167, 47, 0.18)" }
        },
        "sticky-rise": {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 700ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "fade-in-up-delay-1": "fade-in-up 700ms cubic-bezier(0.4, 0, 0.2, 1) 120ms both",
        "fade-in-up-delay-2": "fade-in-up 700ms cubic-bezier(0.4, 0, 0.2, 1) 240ms both",
        "fade-in-up-delay-3": "fade-in-up 700ms cubic-bezier(0.4, 0, 0.2, 1) 360ms both",
        "soft-float": "soft-float 7s ease-in-out infinite",
        "quantity-pop": "quantity-pop 180ms cubic-bezier(0.4, 0, 0.2, 1)",
        "pin-pulse": "pin-pulse 2.4s ease-in-out infinite",
        "ai-pulse": "ai-pulse 2.8s ease-in-out infinite",
        "sticky-rise": "sticky-rise 420ms cubic-bezier(0.4, 0, 0.2, 1) both"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
