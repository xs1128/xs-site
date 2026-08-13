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
  // CTA arrow (U+2193) isn't in Roboto Mono. Extra families here redraw it.
  fallback: ['monospace'],
  adjustFontFallback: false,
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
