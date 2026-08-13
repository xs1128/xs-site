import localFont from 'next/font/local';

export const robotoMono = localFont({
  src: [
    {
      path: './roboto-mono-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './roboto-mono-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-roboto-mono',
  display: 'swap',
  fallback: ['monospace'],
});

// 400 only. CSS asks for 700; the design wants that bold synthesised.
export const hubotSans = localFont({
  src: [
    {
      path: './hubot-sans-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-hubot-sans',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'Helvetica Neue', 'sans-serif'],
});
