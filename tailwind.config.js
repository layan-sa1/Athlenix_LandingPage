/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'athlonix': {
          blue: '#2A6FD6',
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
