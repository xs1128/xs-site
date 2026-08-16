import { cache } from 'react';
import sharp from 'sharp';
import { getHeroImageUrl } from './supabase/queries';

const BLUR_WIDTH = 20;

export interface HeroImage {
  url: string;
  blurDataURL: string | null;
}

export const getHeroImage = cache(async (): Promise<HeroImage> => {
  const url = await getHeroImageUrl();
  if (!url) return { url: '', blurDataURL: null };

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);

    const blur = await sharp(Buffer.from(await response.arrayBuffer()))
      .resize(BLUR_WIDTH)
      .webp({ quality: 40 })
      .toBuffer();

    return {
      url,
      blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
    };
  } catch (error) {
    console.error('Error generating hero blur placeholder:', error);
    return { url, blurDataURL: null };
  }
});
