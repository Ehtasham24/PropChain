import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes:{
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
      }
    },
    animation: {
      "caret-blink": "caret-blink 1.25s ease-out infinite",
    },
      colors:{
        primary:'#A98AD5 ',
        mild_purple:'#AD8FD6',
        light_purple:'#f5f4fc',
        secondary:'#FFFFFF',
        neutral_grey:'#9EA9AA',
        light_grey:'#F2F5F6',
        neutral_grey_two:'#626D6F',
        lightBlue:'#BBD9F4'
        
      }
    },
  },
  plugins: [],
}
export default config
