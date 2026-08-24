import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#18233F',
          950: '#0A0F1D',
          900: '#0E1626',
          800: '#18233F',
          700: '#263452',
          600: '#3A4C73',
          500: '#526694',
          100: '#EAEFF8',
          50: '#F4F7FC',
        },
        primary: {
          navy: '#18233F',
          'navy-light': '#263452',
          'navy-dark': '#0E1626',
        },
        gold: {
          DEFAULT: '#F4B41A',
          900: '#704D03',
          800: '#996805',
          700: '#C78808',
          600: '#E8A20E',
          500: '#F4B41A',
          400: '#F9CA54',
          300: '#FDE191',
          200: '#FEF1CD',
          100: '#FFF8E6',
          50: '#FFFCF5',
          light: '#FFF0C7',
        },
        cream: {
          DEFAULT: '#FCFBF7',
          canvas: '#FCFBF7',
          surface: '#F3F1EA',
          card: '#FFFFFF',
          border: '#E6E2D8',
        },
        neutral: {
          white: '#FFFFFF',
          'off-white': '#FCFBF7',
          surface: '#F3F1EA',
          dark: '#1C2434',
          muted: '#687083',
          border: '#E6E2D8',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          "'Manrope'",
          "'Inter'",
          "'Segoe UI'",
          'Roboto',
          "'Helvetica Neue'",
          'Arial',
          'sans-serif',
        ],
        display: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          "'Manrope'",
          "'Inter'",
          'sans-serif',
        ],
      },
      borderRadius: {
        'card': '24px',
        'card-lg': '32px',
        'button': '14px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(24, 35, 63, 0.05), 0 4px 10px -2px rgba(24, 35, 63, 0.02)',
        'elevated': '0 20px 45px -10px rgba(24, 35, 63, 0.09), 0 8px 16px -4px rgba(24, 35, 63, 0.03)',
        'gold-glow': '0 10px 25px -5px rgba(24, 35, 63, 0.08)',
        'ink-glow': '0 20px 40px -10px rgba(14, 22, 38, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
