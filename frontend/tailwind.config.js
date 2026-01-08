/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Baby blue - primary
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#89CFF0',
          400: '#5bb8e8',
          500: '#38a3d1',
          600: '#2389b5',
          700: '#1d6f94',
          800: '#1b5a79',
          900: '#1c4a65',
        },
        // Soft coral - accent
        accent: {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa8a8',
          400: '#ff8787',
          500: '#ff6b6b',
          600: '#fa5252',
          700: '#f03e3e',
          800: '#e03131',
          900: '#c92a2a',
        },
        // Warm background
        warm: {
          50: '#fefefe',
          100: '#fafaf9',
          200: '#f5f5f4',
          300: '#e7e5e4',
          400: '#d6d3d1',
        },
        // Dark mode backgrounds
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
