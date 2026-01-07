

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Strawford", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          mist: "#C0CCD9",
          ink: "#5A082D",
          berry: "#860841",
          cloud: "#ECF1F6",
        },
      },
    },
  },
  plugins: [],
};

