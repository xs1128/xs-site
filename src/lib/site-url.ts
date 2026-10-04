const DEFAULT_SITE_URL = 'https://www.xsooi.com';

/** One site-root origin for portfolio and blog metadata, including CI builds. */
function resolveSiteUrl(): string {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL);

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP or HTTPS URL.');
  }

  if (
    process.env.NODE_ENV === 'production' &&
    (url.protocol !== 'https:' ||
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))
  ) {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must be a public HTTPS URL in production.',
    );
  }

  // The apex redirects to www. Ignore paths such as /blog and trailing slashes.
  if (url.hostname === 'xsooi.com') url.hostname = 'www.xsooi.com';
  return url.origin;
}

export const siteUrl = resolveSiteUrl();
