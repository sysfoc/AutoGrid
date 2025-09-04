import flowbite from "flowbite-react/tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        "app-bg": "#1bc742",            // button background
        "app-hover": "#16a837",        // Use this for button hovers
        "app-border": "#22d949",       // Slightly lighter for borders
        "app-dark": "#138d2e", 
        "app-button" : "#662bcc",
        "app-button-hover": "#5524ab"      // For dark mode or accents
      },
    },
  },
  plugins: [flowbite.plugin()],
};

export default config;
