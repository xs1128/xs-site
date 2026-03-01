export interface Post {
  id: string;
  title: string;
  date: string;
  summary: string;
  slug: string;
}

export interface Series {
  id: string;
  slug: string;
  title: string;
  description: string;
  posts: Post[];
}

export interface FunnyPicture {
  id: string;
  image: string;
  title: string;
  location: string;
  date: string;
}
