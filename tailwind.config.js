/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        whatsapp: "#25D366",
        "whatsapp-dark": "#128C7E",
        "whatsapp-light": "#DCF8C6",
      },
    },
  },
  plugins: [],
};
