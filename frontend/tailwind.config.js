/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cinema-at-night palette
        marquee: {
          bg: '#0A0D16',      // near-black navy, the house lights down
          raised: '#131826',   // card / panel surface
          line: '#232A3D',     // hairline borders
        },
        gold: {
          DEFAULT: '#D4A24C',  // marquee bulb gold
          bright: '#F0C97A',
          dim: '#8A6B33',
        },
        velvet: {
          DEFAULT: '#B23A32',  // rope-line crimson, used for ratings/badges
          bright: '#D65950',
        },
        ink: {
          DEFAULT: '#F3F0E8',  // warm off-white text
          muted: '#9AA0B4',    // secondary text
          faint: '#5C6478',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(212, 162, 76, 0.25)',
      },
      backgroundImage: {
        'film-grain':
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)",
      },
      backgroundSize: {
        grain: '3px 3px',
      },
    },
  },
  plugins: [],
}
