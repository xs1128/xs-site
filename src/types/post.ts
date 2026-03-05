export interface Post {
  id: number;
  title: string;
  date: string;
  summary: string;
  slug: string;
  featured_image?: string | null;
  tags?: string[];
  read_time?: number | null;
  author_name?: string | null;
  content?: string | null;
}

export interface Series {
  id: number;
  slug: string;
  title: string;
  description: string;
  posts: Post[];
}

export interface FunnyPicture {
  id: number;
  image: string;
  title: string;
  location: string;
  date: string;
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface SeriesPost extends Post {
  order_in_series: number;
}

export interface PostWithSeries extends Post {
  series?: SeriesDetail[];
}

export interface SeriesDetail {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  posts: SeriesPost[];
}
