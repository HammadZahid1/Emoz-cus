/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'bg-base': '#0d1117',
        'bg-card': '#161b22',
        'bg-input': '#1c2330',
        'border-color': '#30363d',
        'accent-green': '#23c55e',
        'accent-green-dark': '#16a34a',
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        'text-muted': '#6e7681',
      },
    },
  },
  plugins: [],
};
