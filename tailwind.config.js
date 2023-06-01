/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,ejs}", "./dist/views/**/*.{html,js,ts,ejs}"],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}