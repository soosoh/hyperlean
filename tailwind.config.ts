/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0F1D',
        card: '#1E293B',
        primary: '#3B82F6',
        success: '#10B981',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
}
