import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TD "IMPEKS"',
    short_name: 'IMPEKS',
    description: 'International anthracite and thermal coal supply',
    start_url: '/',
    display: 'standalone',
    background_color: '#04070d',
    theme_color: '#04070d',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
