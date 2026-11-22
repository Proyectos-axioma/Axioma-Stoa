import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders } from 'astro/config';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/consts';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
    site: SITE_URL,
    integrations: [
        mdx(),
// Para que no se indexe el keystatic
        sitemap({
            filter: (page) => !page.includes('/keystatic'),
        }),
        icon(),
        react(),
// En modo estático (ej. demo en GitHub Pages), Keystatic solo se carga en desarrollo (astro dev).
// Cuando conectes un adaptador SSR (Netlify/Vercel), puedes descomentar keystatic() para producción.
        ...(isDev ? [keystatic()] : []),
    ],

    fonts: [
        {
            provider: fontProviders.local(),
            name: 'Atkinson',
            cssVariable: '--font-atkinson',
            fallbacks: ['sans-serif'],
            options: {
                variants: [
                    {
                        src: ['./src/assets/fonts/atkinson-regular.woff'],
                        weight: 400,
                        style: 'normal',
                        display: 'swap',
                    },
                    {
                        src: ['./src/assets/fonts/atkinson-bold.woff'],
                        weight: 700,
                        style: 'normal',
                        display: 'swap',
                    },
                ],
            },
        },
    ],
    vite: {
        plugins: [tailwindcss()],
    },
});