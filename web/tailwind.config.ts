import type { Config } from 'tailwindcss';
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cinema: { amber:'#FDB813', amberHover:'#FFC940', black:'#0F0F0F', charcoal:'#141414', surface:'#181818', surfaceElevated:'#222222', border:'#2E2E2E', muted:'#A3A3A3', posterCream:'#FFFDF7', posterSurface:'#FFF8E7' },
      },
      fontFamily: { cairo:['var(--font-cairo)','sans-serif'], cinzel:['var(--font-cinzel)','serif'], sans:['var(--font-cairo)','var(--font-jakarta)','sans-serif'], mono:['var(--font-mono)','monospace'] },
      borderRadius:{sharp:'2px',arch:'4px'},
      boxShadow:{'cinema-offset-dark':'3px 3px 0px #FFFFFF','cinema-offset-light':'4px 4px 0px #0F0F0F','cinema-ambient':'0 8px 24px -4px rgba(253, 184, 19, 0.18)'},
      backgroundImage:{'cinema-card-grad':'linear-gradient(145deg, #1E1E1E, #141414)','cinema-card-light':'linear-gradient(145deg, #FFFFFF, #FFF8E7)','clapper-stripes':'repeating-linear-gradient(-45deg, #FDB813 0px, #FDB813 10px, #0F0F0F 10px, #0F0F0F 20px)'}
    }
  }, plugins: []
};
export default config;
