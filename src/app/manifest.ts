import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '밥.net',
    short_name: '밥.net',
    description: '한국디지털미디어고등학교 급식 API',
    start_url: '/',
    display: 'fullscreen',
    orientation: 'portrait-primary,
    theme_color: '#000000',
    background_color: '#ffffff',
    icons: [
      {
        src: './favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
      {
        src: './logo/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: './logo/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: './logo/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: './logo/android-icon-36x36.png',
        sizes: '36x36',
        type: 'image/png',
      },
      {
        src: './logo/android-icon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: './logo/android-icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: './logo/android-icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: './logo/android-icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: './logo/android-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
