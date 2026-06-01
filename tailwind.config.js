/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#020008',
        'deep-violet': '#1a0533',
        'electric-rose': '#ff2d78',
        gold: '#e2a84b',
        'ice-blue': '#a8d8ff',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        handwritten: ['"Dancing Script"', 'cursive'],
      },
    },
  },
  plugins: [],
}
