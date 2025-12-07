/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'from-amber-500/0',
    'via-amber-500',
    'to-amber-500/0',
    'from-orange-500/0',
    'via-orange-500',
    'to-orange-500/0',
    'from-indigo-500/0',
    'via-indigo-500',
    'to-indigo-500/0',
    'from-purple-500/0',
    'via-purple-500',
    'to-purple-500/0',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  plugins: [],
};
