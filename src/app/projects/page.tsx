import type { Metadata } from 'next';
import { ProjectsGallery } from '@/components/projects/ProjectsGallery';
import { ProjectNavigation } from '@/components/projects/ProjectNavigation';
import styles from '@/components/projects/projects.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Useful builds, playful details, and interactive experiments by Xinsheng Ooi. Explore the projects and play with the possibilities.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects | Xinsheng Ooi',
    description:
      'Useful builds, playful details, and interactive experiments by Xinsheng Ooi.',
    url: '/projects',
    images: [{ url: '/projects/gallery-hero.webp', width: 1672, height: 941 }],
  },
};

export default function ProjectsPage() {
  return (
    <main className={styles.page}>
      <ProjectNavigation appearance="dark" />
      <ProjectsGallery />
    </main>
  );
}
