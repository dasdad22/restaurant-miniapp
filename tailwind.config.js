/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e74c3c',
        'primary-dark': '#c0392b',
        secondary: '#f39c12',
        'bg-gray': '#f5f5f5',
      },
    },
  },
  plugins: [],
}
