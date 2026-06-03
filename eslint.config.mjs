import next from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  ...next,
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**'],
  },
  {
    rules: {
      // Markdown content and the picture marquee render arbitrary remote image
      // URLs. next/image throws on hostnames not declared in next.config, so
      // a plain <img> is the correct choice here.
      '@next/next/no-img-element': 'off',
    },
  },
]

export default eslintConfig
