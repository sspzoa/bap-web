import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '밥',
    short_name: '밥',
    description: '한국디지털미디어고등학교 급식 API',
    start_url: '/',
    display: 'fullscreen',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon.ico',
        type: 'image/x-icon',
        sizes: '16x16 32x32',
      },
      {
        src: '/logo/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: './logo/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/logo/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: './logo/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}