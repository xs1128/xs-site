import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/seo";
import HomePageClient from "./home-client";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
};

async function HeroImageFetcher() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'hero_image_url')
    .single();

  const heroImageUrl = data?.value || '';
  return <HomePageClient heroImageUrl={heroImageUrl} />;
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Suspense fallback={<HomePageClient heroImageUrl="" />}>
        <HeroImageFetcher />
      </Suspense>
    </>
  );
}
