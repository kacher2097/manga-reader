/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',
          dark: '#CC5500',
        },
        background: {
          DEFAULT: '#1A1A1A',
          light: '#2D2D2D',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto', 'sans-serif'],
        anime: ['Anime Ace', 'cursive'],
      },
      height: {
        header: '80px',
        hero: '400px',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
} 