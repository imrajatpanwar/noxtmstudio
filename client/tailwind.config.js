/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1A18',
        panel: '#1f1f1d',
        line: '#33332f',
        accent: '#3A5E48',
        accent2: '#2a4a36',
        muted: '#8a857a',
        cream: '#F5F2ED',
        cream2: '#E8E0D0',
        sand: '#E8E0D0',
        forest: '#22372B',
        teal: '#3A5E48',
        sage: '#8FB89A',
        gold: '#E8E0D0',
        coral: '#3A5E48',
        ocean: '#22372B',
        plum: '#3A5E48',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        scrollline: 'scrollline 1.8s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollline: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '40%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
