/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pc-bg': '#0D1117',         // True Blue-Black
        'pc-surface': '#161B22',    // Deep Navy Slate
        'pc-accent': '#3895D3',     // Azure Digital
        'pc-cyan': '#4DBCFF',       // Electric Cyan
        'pc-text': '#F0F6FC',       // Off-White
        'pc-muted': '#C9D1D9',      // Light Gray
      }
    },
  },
  plugins: [],
}