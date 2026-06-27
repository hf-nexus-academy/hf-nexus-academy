import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        navy: {
          950: "#0A1628",
          900: "#0D1C32",
          800: "#142847",
          700: "#1C3A63",
          600: "#27507F",
          500: "#3A6896",
        },
        gold: {
          50: "#FBF6E9",
          100: "#F4E8C4",
          300: "#E3CD96",
          500: "#C9A961",
          600: "#AD8A45",
          700: "#8B6D33",
        },
        cream: {
          50: "#FAF8F3",
          100: "#F3EEE3",
        },
        ink: {
          700: "#2D3548",
          500: "#5B6377",
          300: "#9AA1B0",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0A1628",
          foreground: "#FAF8F3",
        },
        secondary: {
          DEFAULT: "#C9A961",
          foreground: "#0A1628",
        },
        destructive: {
          DEFAULT: "#B3433D",
          foreground: "#FAF8F3",
        },
        muted: {
          DEFAULT: "#F3EEE3",
          foreground: "#5B6377",
        },
        accent: {
          DEFAULT: "#E3CD96",
          foreground: "#0A1628",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0A1628",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0A1628",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "arch-pattern": "url('/images/pattern-arch.svg')",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s ease-out forwards",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
