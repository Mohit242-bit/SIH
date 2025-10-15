/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'terminal-green': '#00ff41',
        'terminal-green-dark': '#00dd37',
        'terminal-bg': '#0a0e0a',
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'Courier New', 'Courier', 'monospace'],
      },
      boxShadow: {
        'terminal': '0 0 20px rgba(0, 255, 65, 0.4)',
        'terminal-lg': '0 0 30px rgba(0, 255, 65, 0.3)',
      },
    },
  },
  plugins: [],
}
