/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#faf8ff',
        ink: {
          DEFAULT: '#3b2f4a',
          muted: '#6b5f7a',
        },
        'pastel-purple': '#e9d5ff',
        'pastel-purple-deep': '#c4b5fd',
        'pastel-pink': '#fce7f3',
        'pastel-pink-deep': '#f9a8d4',
        'pastel-blue': '#dbeafe',
        'pastel-blue-deep': '#93c5fd',
        'pastel-green': '#d1fae5',
        'pastel-green-deep': '#6ee7b7',
        'pastel-yellow': '#fef9c3',
        'pastel-yellow-deep': '#fde047',
      },
    },
  },
  plugins: [],
}
