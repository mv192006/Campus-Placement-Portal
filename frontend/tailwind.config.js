/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f8ff',
          100: '#e0f0fe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a7f8',
          500: '#0084f4',
          600: '#0066cc', // Apple blue
          700: '#0052a3',
          800: '#00468a',
          900: '#003a73',
          950: '#00254d',
        },
        apple: {
          gray: '#f5f5f7',
          dark: '#1d1d1f',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'none': 'none',
      }
    },
  },
  plugins: [],
};
