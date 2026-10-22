import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { works } from '@/lib/projects';
import { WorkDetails } from '@/components/projects/WorkDetails';
import { ProjectNavigation } from '@/components/projects/ProjectNavigation';
import { ProjectScroll } from '@/components/projects/ProjectScroll';
import styles from '@/components/projects/projects.module.css';

export function generateStaticParams() {
  return works.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = works.find((item) => item.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: `${project.title} | Xinsheng Ooi`,
      description: project.description,
      url: `/projects/${slug}`,
      images: [
        {
          url: project.cover.src,
          alt: project.cover.alt,
        },
      ],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = works.find((item) => item.slug === slug);
  if (!project) notFound();
  return (
    <main className={styles.page}>
      <ProjectScroll />
      <ProjectNavigation backToGallery />
      <div className="projects-detail">
        <h1 className="projects-detail__title">
          {project.title}
          <span>.</span>
        </h1>
        <WorkDetails work={project} />
      </div>
    </main>
  );
}
