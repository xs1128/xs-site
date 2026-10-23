export interface Work {
  slug: string;
  title: string;
  category: string;
  description: string;
  stack: readonly string[];
  highlights: readonly string[];
  repositoryUrl?: string;
  liveUrl: string;
  liveLabel?: string;
  // Hand-copied from the public profile; update `asOf` with the numbers.
  instagram?: {
    handle: string;
    followers: number;
    posts: number;
    asOf: string;
  };
  cover: { src: string; alt: string };
}

export interface Project extends Work {
  repositoryUrl: string;
  chapters: readonly {
    slug: 'apps' | 'access' | 'layers';
    title: string;
    emphasis: string;
    description: string;
    artwork?: string;
    mobileArtwork?: string;
    alt: string;
  }[];
  ending: {
    title: string;
    emphasis: string;
    body: string;
    linkLabel: string;
    linkUrl: string;
  };
  artwork?: {
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
    ending: {
      title: 'My own little',
      emphasis: 'corner of the internet.',
      body: 'That’s a homelab: a place to run things myself, try new ideas, and learn how it all works. This one happens to fit on my desk.',
      linkLabel: 'Explore the homelab',
      linkUrl: 'https://homelab.xsooi.com/',
    },
    artwork: {
      src: '/projects/homelab.svg',
      alt: 'A sketch sheet of a silver Mac mini, with overhead and front studies, cable drawings, and conceptual network and software diagrams.',
      width: 1200,
      height: 720,
    },
  },
  {
    slug: 'portfolio',
    title: 'Portfolio & Blog',
    category: 'Frontend, full-stack & publishing',
    description:
      'One site with two jobs: a quiet introduction to me, and a notebook where I write about what I build. Posts live in Supabase and go live from a small admin app.',
    stack: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Three.js'],
    highlights: [
      'A scroll-snapped introduction, an about section, and a contact form.',
      'A Markdown blog with series, code blocks, and a terminal cube that counts posts and visits.',
      'A separate admin app that publishes posts and refreshes the site on demand.',
      'Keyboard navigation, responsive layouts, and reduced-motion support.',
    ],
    repositoryUrl: 'https://github.com/xs1128/site',
    liveUrl: '/',
    liveLabel: 'Visit the site',
    cover: {
      src: '/projects/portfolio-artwork.webp',
      alt: 'Floating ivory and glass interface panels with an orange sphere in a charcoal studio.',
    },
    chapters: [
      {
        slug: 'layers',
        title: 'One site.',
        emphasis: 'Two front doors.',
        description:
          'Under the page sit the layers: my introduction, the about pillars, a contact ring, and the blog. Underneath it all, Next.js and Supabase keep the posts flowing.',
        alt: 'An isometric web page lifts apart into layers: the name on the front page, three numbered pillars, a ring of contact text, a blog page with a cube, and an engine slab. A dashed line runs from an admin card to the blog layer.',
      },
    ],
    ending: {
      title: 'Built to show the work,',
      emphasis: 'and to write it down.',
      body: 'This is where I introduce myself and keep notes on what I build. Write a post in the admin app, and the blog updates itself.',
      linkLabel: 'Read the blog',
      linkUrl: '/blog',
    },
  },
];

const [homelab, site] = projects;

export const works: readonly Work[] = [
  homelab,
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
    liveLabel: 'Submit a confession',
    instagram: {
      handle: 'nthu_confession',
      followers: 1157,
      posts: 360,
      asOf: 'October 2026',
    },
    cover: {
      src: '/projects/confession-favicon.webp',
      alt: 'The NTHU Confession favicon: a panda and a dog sharing a hug beside a lake.',
    },
  },
  site,
];
