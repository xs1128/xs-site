export interface Post {
  id: number;
  title: string;
  date: string;
  summary: string;
  slug: string;
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
