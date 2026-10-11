export interface Project {
  slug: string;
  title: string;
  description: string;
  repositoryUrl: string;
  liveUrl: string;
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

// Add a project here to reuse the same framing and scroll behaviour.
// The illustration represents the Mac mini, rather than a hardware diagram.
export const projects: readonly Project[] = [
  {
    slug: 'homelab',
    title: 'Homelab',
    description:
      'A little computer at home that runs my own apps. Photos, paperwork, and useful tools—all with a home of their own.',
    repositoryUrl: 'https://github.com/xs1128/xs-homelab',
    liveUrl: 'https://homelab.xsooi.com/',
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
        alt: 'A Mac mini sits inside a red circular portal, connected to a lock and a phone with a check mark.',
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
