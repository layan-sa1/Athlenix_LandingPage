/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'athlonix': {
          blue: '#00B5FF',
          blueLight: '#00B5FF',
          blueText: '#0284C7', // WCAG-safer shade for text/borders on light backgrounds — #00B5FF alone fails contrast on white
          cyan: '#22D3EE',
          dark: '#0A0A0F',
          graphite: '#111118',
          charcoal: '#1A1A24',
          warm: '#14141C',
        }
      },
      fontFamily: {
        'display': ['"Poppins"', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'athlonix': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
