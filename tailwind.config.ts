import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#ea580c',
          dark: '#1c1917',
          light: '#f5f5f4',
        }
      }
    },
  },
  plugins: [],
} satisfies Config