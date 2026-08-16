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

/* The blog wants real bold, not synthesised — it shipped @fontsource 700 files
   before the merge. Separate instances because adding 700 to the faces above
   would re-cut `.landing-section__headline` and `.expertise-card__title`, which
   is the change this repo tried once and reverted. Attached by
   app/blog/layout.tsx, so these only download on /blog. */
export const hubotSansBlog = localFont({
  src: [
    {
      path: './hubot-sans-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './hubot-sans-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-blog-sans',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'Helvetica Neue', 'sans-serif'],
});

export const robotoMonoBlog = localFont({
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
    {
      path: './roboto-mono-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-blog-mono',
  display: 'swap',
  fallback: ['monospace'],
});
