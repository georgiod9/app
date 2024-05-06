import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      bg: '#1B1D28',
      white: '#FFFFFF',
      green: '#53D48F',
      yellow: '#FFFE00',
      red: '#FDA5A5',
      blue: '#92C5FD',
    },
    extend: {
    },
  },
  plugins: [],
};
export default config;
