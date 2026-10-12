/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        quest: '0 0 22px rgba(239, 68, 68, 0.6)',
        amber: '0 0 12px rgba(245, 158, 11, 0.1)',
      },
      colors: {
        parchment: '#f8ead0',
        ember: '#f59e0b',
        ruby: '#ef4444',
        slateglass: 'rgba(15, 23, 42, 0.8)',
      },
    },
  },
  plugins: [],
}
