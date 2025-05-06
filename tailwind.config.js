/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'neon-pink': '#FF00FF',
        'neon-cyan': '#00FFFF',
        'neon-lime': '#39FF14',
        'cyber-bg': '#0a0a0a', // Dark background
        'cyber-surface': '#1a1a1a', // Slightly lighter surface
        'cyber-border': '#444444', // Border color
        'cyber-text': '#e0e0e0', // Main text
        'cyber-muted': '#888888', // Muted text
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "neon-glow": {
          '0%, 100%': { textShadow: '0 0 5px theme(colors.neon-cyan), 0 0 10px theme(colors.neon-cyan), 0 0 20px theme(colors.neon-cyan)' },
          '50%': { textShadow: '0 0 10px theme(colors.neon-pink), 0 0 20px theme(colors.neon-pink), 0 0 30px theme(colors.neon-pink)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neon-glow": "neon-glow 3s linear infinite",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ['Courier New', 'monospace'], // Example cyberpunk font
      },
      boxShadow: {
        'neon-cyan': '0 0 5px theme(colors.neon-cyan), 0 0 10px theme(colors.neon-cyan)',
        'neon-pink': '0 0 5px theme(colors.neon-pink), 0 0 10px theme(colors.neon-pink)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}