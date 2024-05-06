import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f1e6ff",
          100: "#d4b0ff",
          200: "#bf8aff",
          300: "#a154ff",
          400: "#8f33ff",
          500: "#7300ff",
          600: "#6900e8",
          700: "#5200b5",
          800: "#3f008c",
          900: "#30006b",
        },
        secondary: {
          500: "#19FB9B",
        },
        grey: {
          100: "#E4E4E4",
          200: "#F2F2F2",
          300: "#E4E4E4",
          400: "#BFBFBF",
          500: "#808080",
          600: "#414141",
          700: "#292929",
          800: "#1F1F1F",
          900: "#141414",
        },
        background: "#0F0C13",
        modal: "#19161C",
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "1800px",
      // => @media (min-width: 1800px) { ... }
    },
  },
  plugins: [],
};
export default config;
