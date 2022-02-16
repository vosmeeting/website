module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ripple: (theme) => ({
      colors: theme('colors'),
      darken: 0.1,
    }),
    extend: {
      colors: {
        'vosm-blue': '#084F86',
        'vosm-light-blue': '#AFDEEF',
      },
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
    },
    fontFamily: {
      sans: ['lexend', 'sans-serif'],
      serif: ['EB Garamond', 'serif'],
    },
  },
  plugins: [
    require('tailwindcss-ripple')(),
    require('@tailwindcss/typography'),
  ],
}
