import flowbite from "flowbite-react/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Your existing green colors - kept unchanged
        "app-bg": "#1bc742",            // button background
        "app-hover": "#16a837",        // Use this for button hovers
        "app-border": "#22d949",       // Slightly lighter for borders
        "app-dark": "#138d2e", 
        "app-button": "#1bc742",
        "app-button-hover": "#16a837",

        // New comprehensive green color system
        primary: {
          DEFAULT: '#1bc742',  // Main green (buttons, links, brand)
          hover: '#16a837',    // Hover state
          light: '#f1fff4',    // Light green backgrounds, secondary buttons
        },
        
        text: {
          DEFAULT: '#1a1a1a',  // Main text color
          secondary: '#666666', // Secondary text
          inverse: '#ffffff',   // Text on dark/green backgrounds
        },
        
        background: {
          DEFAULT: '#ffffff',  // Main background
          secondary: '#f8f8f8', // Cards, sections
          dark: '#1a1a1a',     // Dark mode background
        },
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    function({ addBase }: { addBase: any }) {
      addBase({
        ':root': {
          '--primary': '#1bc742',
          '--primary-hover': '#16a837',
          '--primary-light': '#f1fff4',
          '--text': '#1a1a1a',
          '--text-secondary': '#666666',
          '--text-inverse': '#ffffff',
          '--bg': '#ffffff',
          '--bg-secondary': '#f8f8f8',
        },
        '.dark': {
          '--primary': '#1bc742',      // Keep same green in dark mode
          '--primary-hover': '#16a837',
          '--primary-light': '#0d4a1a', // Darker green for dark mode backgrounds
          '--text': '#ffffff',
          '--text-secondary': '#d1d5db',
          '--text-inverse': '#1a1a1a',
          '--bg': '#1a1a1a',
          '--bg-secondary': '#2d2d2d',
        },
      })
    }
  ],
};

export default config;