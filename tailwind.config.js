/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#04060d',
          900: '#070a14',
          850: '#0b1020',
          800: '#0f162c',
        },
        gold: {
          300: '#f7e199',
          400: '#edd072',
          500: '#d4af37',
          600: '#b89428',
          700: '#99761a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
