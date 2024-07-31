/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/tailwind.scss";`
      }
    }
  }
}

