/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    './pages/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Roboto as default sans-serif font
      },
    },
  },
  plugins: [],
};