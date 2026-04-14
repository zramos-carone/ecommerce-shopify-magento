import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        secondary: '#666666',
        success: '#00b341',
        warning: '#ffa500',
        error: '#cc0000',
      },
    },
  },
  plugins: [],
}

export default config
