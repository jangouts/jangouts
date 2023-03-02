/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.js',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',

        black: '#000',
        white: '#fff',

        primary: {
          dark: 'var(--colors-primary-dark)',
          DEFAULT: 'var(--colors-primary)',
          lighter: 'var(--colors-primary-lighter)'
        },

        secondary: {
          DEFAULT: 'var(--colors-secondary)',
          lighter: 'var(--colors-secondary-lighter)'
        },

        inverse: 'var(--colors-inverse)',
      }
    },
  },
  plugins: [],
}
