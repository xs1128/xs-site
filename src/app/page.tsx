import { Suspense } from "react";
import { getHeroImage } from "@/lib/hero-image";
import { siteConfig } from "@/lib/seo";
import HomePageClient from "./home-client";

// ISR: rebuild the shell hourly so a changed hero image shows up.
export const revalidate = 3600;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
};

async function HeroImageFetcher() {
  const { url, blurDataURL } = await getHeroImage();
  return <HomePageClient heroImageUrl={url} heroBlurDataURL={blurDataURL} />;
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Suspense fallback={<HomePageClient heroImageUrl="" heroBlurDataURL={null} />}>
        <HeroImageFetcher />
      </Suspense>
    </>
  );
}
