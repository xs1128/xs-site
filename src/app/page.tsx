import { createClient } from "@/lib/supabase/server";
import HomePageClient from "./home-client";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'hero_image_url')
    .single();

  const heroImageUrl = data?.value || '';
  return <HomePageClient heroImageUrl={heroImageUrl} />;
}
