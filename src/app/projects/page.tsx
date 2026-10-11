import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProjectPanel } from '@/components/projects/ProjectPanel';
import { ProjectScroll } from '@/components/projects/ProjectScroll';
import { projects } from '@/lib/projects';
import styles from '@/components/projects/projects.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Personal projects by Xinsheng Ooi, starting with Homelab.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects | Xinsheng Ooi',
    description: 'Personal projects by Xinsheng Ooi, starting with Homelab.',
    url: '/projects',
  },
};

export default function ProjectsPage() {
  return (
    <main className={styles.page}>
      <ProjectScroll />
      <nav className={styles.navigation} aria-label="Back to main site">
        <Link href="/" className={styles.link}>
          <ArrowLeft size={18} aria-hidden="true" />
          Home
        </Link>
      </nav>
      <h1 className={styles.visuallyHidden}>Projects</h1>
      {projects.map((project, index) => (
        <ProjectPanel
          key={project.slug}
          project={project}
          preload={index === 0}
        />
      ))}
    </main>
  );
}
