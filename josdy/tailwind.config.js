/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jhodsy: {
          bg: '#05080D',
          deep: '#071426',
          navy: '#0B192D',
          surface: '#0D1B30',
          card: '#101F35',
          cardGlass: 'rgba(13, 27, 48, 0.75)',
          border: 'rgba(255, 255, 255, 0.12)',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          silver: '#D8D8D8',
          silverLight: '#E7E7E7',
          silverMuted: '#BFC3C8',
          textMuted: '#8994A3',
          textSubtle: '#AEB6C2',
          accent: '#0A2540',
          whatsapp: '#25D366'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-silver': '0 0 25px rgba(216, 216, 216, 0.15)',
        'glow-navy': '0 0 40px rgba(11, 25, 45, 0.6)',
        'card-dark': '0 8px 32px rgba(0, 0, 0, 0.45)',
        'phone-frame': '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.15)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
