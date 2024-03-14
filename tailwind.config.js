module.exports = {
  content: ['./views/**/*.{js,ts,jsx,tsx}'],
  theme: {
    ripple: (theme) => ({
      colors: theme('colors'),
      darken: 0.1
    }),
    extend: {
      colors: {
        'vosm-blue': '#084F86',
        'vosm-light-blue': '#AFDEEF'
      },
      minHeight: (theme) => ({
        ...theme('spacing')
      })
    },
    fontFamily: {
      sans: ['lexend', 'sans-serif'],
      serif: ['EB Garamond', 'serif']
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require('tailwindcss-ripple')(), require('@tailwindcss/typography')]
};
