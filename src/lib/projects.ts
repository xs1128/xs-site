export interface Work {
  slug: string;
  title: string;
  category: string;
  description: string;
  stack: readonly string[];
  highlights: readonly string[];
  repositoryUrl?: string;
  liveUrl: string;
  cover: { src: string; alt: string };
}

export interface Project extends Work {
  repositoryUrl: string;
  chapters: readonly {
    slug: 'apps' | 'access';
    title: string;
    emphasis: string;
    description: string;
    artwork: string;
    mobileArtwork: string;
    alt: string;
  }[];
  artwork: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const projects: readonly Project[] = [
  {
    slug: 'homelab',
    title: 'Homelab',
    category: 'Infrastructure & automation',
    description:
      'A little computer at home that runs my own apps. Photos, paperwork, and useful tools—all with a home of their own.',
    stack: ['Docker', 'Tailscale', 'Self-hosting'],
    highlights: [
      'A home for photo storage, documents, and everyday tools on a Mac mini.',
      'Private remote access through Tailscale, alongside public web services.',
      'A live service dashboard and a scroll-driven look inside the machine.',
    ],
    repositoryUrl: 'https://github.com/xs1128/xs-homelab',
    liveUrl: 'https://homelab.xsooi.com/',
    cover: {
      src: '/projects/homelab-cover.webp',
      alt: 'A silver Mac mini floats above a stone plinth in a sunlit architectural room.',
    },
    chapters: [
      {
        slug: 'apps',
        title: 'One little box.',
        emphasis: 'Lots of little helpers.',
        description:
          'Think of it as a tiny house for my apps. One keeps my photos, one sorts my paperwork, and others take care of repetitive jobs.',
        artwork: '/projects/homelab-apps.svg',
        mobileArtwork: '/projects/homelab-apps-mobile.svg',
        alt: 'A Mac mini connects to comic panels showing a photo album, a document, and an automated workflow.',
      },
      {
        slug: 'access',
        title: 'At home.',
        emphasis: 'Even when I’m not.',
        description:
          'Some apps are open on the web. My private ones use Tailscale—like a special key that lets my own devices reach them from anywhere.',
        artwork: '/projects/homelab-access.svg',
        mobileArtwork: '/projects/homelab-access-mobile.svg',
        alt: 'A Mac mini opens into layers showing its cooling fan, logic board, and power supply, beside a lock and a phone with a check mark.',
      },
    ],
    artwork: {
      src: '/projects/homelab.svg',
      alt: 'A sketch sheet of a silver Mac mini, with overhead and front studies, cable drawings, and conceptual network and software diagrams.',
      width: 1200,
      height: 720,
    },
  },
];

export const works: readonly Work[] = [
  ...projects,
  {
    slug: 'nthu-confession',
    title: 'NTHU Confession',
    category: 'Interface design & full-stack development',
    description:
      'An anonymous space for NTHU students to share stories, thoughts, and confessions. Every submission is reviewed before publication.',
    stack: ['React', 'Vite', 'Supabase', 'i18next'],
    highlights: [
      'An anonymous submission flow with a separate moderation interface.',
      'English and Chinese interfaces with language detection.',
      'A responsive form experience built around a calm, expressive visual identity.',
    ],
    liveUrl: 'https://confession.sloppylabs.com/',
    cover: {
      src: '/projects/confession-favicon.webp',
      alt: 'The NTHU Confession favicon: a panda and a dog sharing a hug beside a lake.',
    },
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    category: 'Frontend & interaction design',
    description:
      'My little corner of the web: a quiet introduction, a focused look at my experience, and a more playful home for the things I make.',
    stack: ['Next.js', 'React', 'TypeScript', 'CSS'],
    highlights: [
      'A minimal portfolio with scroll-linked typography and section transitions.',
      'An interactive projects gallery with a custom particle sculpture.',
      'Keyboard navigation, responsive layouts, and reduced-motion support.',
    ],
    repositoryUrl: 'https://github.com/xs1128/site',
    liveUrl: '/',
    cover: {
      src: '/projects/portfolio-artwork.webp',
      alt: 'Floating ivory and glass interface panels with an orange sphere in a charcoal studio.',
    },
  },
  {
    slug: 'blog',
    title: 'Blog',
    category: 'Full-stack & publishing',
    description:
      'A place to write about what I am building and learning, with a custom publishing system behind the scenes.',
    stack: ['Next.js', 'Supabase', 'PostgreSQL', 'Markdown'],
    highlights: [
      'Posts, series, and Markdown articles in a custom reading interface.',
      'Supabase-backed content, media storage, and an admin publishing workflow.',
      'An interactive terminal cube that gives the landing page its own character.',
    ],
    repositoryUrl: 'https://github.com/xs1128/site',
    liveUrl: '/blog',
    cover: {
      src: '/projects/blog-sketch.webp',
      alt: 'A simple ink sketch of an open book with an orange bookmark.',
    },
  },
];
