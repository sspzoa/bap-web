export default function manifest() {
  return {
    name: '밥.net',
    short_name: '밥.net',
    description: '한국디지털미디어고등학교 급식 API',
    display: 'fullscreen',
    appleWebApp: true,
    orientation: 'natural',
    theme_color: '#000000',
    background_color: '#ffffff',
    icons: [
      {
        src: '/favicon.ico',
        type: 'image/x-icon',
        sizes: '16x16 32x32',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: './icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: './icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}