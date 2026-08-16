import { getHeroImage } from '@/lib/blog/hero-image';
import { siteConfig, blogUrl } from '@/lib/blog/seo';
import HomePageClient from './home-client';

// ISR: rebuild the shell hourly so a changed hero image shows up.
export const revalidate = 3600;

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: blogUrl('/'),
  description: siteConfig.description,
};

export default async function Home() {
  const { url, blurDataURL } = await getHeroImage();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomePageClient heroImageUrl={url} heroBlurDataURL={blurDataURL} />
    </>
  );
}
