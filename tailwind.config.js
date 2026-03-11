/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C547',
          dark: '#B8860B',
          muted: 'rgba(212, 175, 55, 0.5)',
        },
        sidebar: '#181818',
        surface: '#303030',
        /* Image-style: main chat bg #202123, sidebar #181818, bubbles/input #303030 */
        dark: {
          DEFAULT: '#202123',   /* main chat area background */
          100: '#181818',       /* sidebar */
          200: '#303030',       /* message bubbles, input bar */
          300: '#343541',       /* hover/active sidebar item */
          400: '#565869',
          500: '#6e6e80',
        },
        accent: {
          DEFAULT: '#303030',
          hover: '#191919',
        },
      },
      borderRadius: {
        'curve': '18px',
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
    },
  },
  plugins: [],
}