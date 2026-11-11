// tailwind.config.cjs
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'in': 'fade-in 0.15s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
        'slide-in-from-top-1': 'slide-in-from-top 0.15s ease-out',
      },
    },
  },
  plugins: [],
};