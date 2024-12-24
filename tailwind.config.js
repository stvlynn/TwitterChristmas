/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      animation: {
        snowfall: 'snowfall 3s linear infinite',
        snowflakeWiggle: 'snowflakeWiggle 6s ease-in-out infinite',
      },
      keyframes: {
        snowfall: {
          '0%': {
            transform: 'translateY(-100%) translateX(0)',
          },
          '50%': {
            transform: 'translateY(50vh) translateX(100px)',
          },
          '100%': {
            transform: 'translateY(100vh) translateX(0)',
          },
        },
        snowflakeWiggle: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '50%': {
            transform: 'translateX(20px)',
          },
        },
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(4px)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
