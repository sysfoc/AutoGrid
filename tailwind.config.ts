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
        "app-text": "#182641",
        "app-button": "#DC2626",
        "app-button-hover": "#B91C1C",
      },
    },
  },
  plugins: [flowbite.plugin()],
};

export default config;
