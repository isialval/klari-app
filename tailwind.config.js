/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        backgroundPink: "#E7BEC6",
        backgroundWhite: "#FFFFFF",
        primaryPink: "#BB6276",
        secondaryPink: "#580423",
      },
    },
  },
  plugins: [],
};
