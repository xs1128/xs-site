import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import HomePageClient from "./home-client";

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
    <Suspense fallback={<HomePageClient heroImageUrl="" />}>
      <HeroImageFetcher />
    </Suspense>
  );
}
