/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--color-pink)',
          hover: 'var(--color-pink-hover)',
          soft: 'var(--color-pink-soft)',
        }
      },
      fontFamily: {
        sans: ['Readex Pro', 'sans-serif'],
        mono: ['Readex Pro', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
