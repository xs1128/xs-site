import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/projects';
import { ProjectScene } from './ProjectScene';
import { HomelabStatus } from './HomelabStatus';
import { MacMiniArtwork } from './MacMiniArtwork';
import { SiteArtwork } from './SiteArtwork';
import styles from './projects.module.css';

export function ProjectPanel({
  project,
  preload = false,
}: {
  project: Project;
  preload?: boolean;
}) {
  const headingId = `project-${project.slug}`;
  const chapter = project.chapters.at(-1);

  return (
    <>
      <header className={`${styles.heading} ${styles.projectHeader}`}>
        <div className={styles.titleGroup}>
          <h2 id={headingId} className={styles.title}>
            {project.title}
          </h2>
        </div>
        <div className={styles.introduction}>
          <p className={styles.description}>{project.description}</p>
          <a
            className={styles.link}
            href={project.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} on GitHub (opens in a new tab)`}
          >
            GitHub
            <ArrowUpRight size={28} aria-hidden="true" />
          </a>
        </div>
      </header>
      {chapter && (
        <ProjectScene
          key={chapter.slug}
          kind={chapter.slug}
          labelledBy={`${headingId}-${chapter.slug}`}
          header={null}
          artwork={
            project.slug === 'homelab' ? (
              <MacMiniArtwork alt={chapter.alt} />
            ) : project.slug === 'portfolio' ? (
              <SiteArtwork alt={chapter.alt} />
            ) : (
              chapter.artwork && (
                <picture className={styles.picture}>
                  <source
                    media="(max-width: 960px) and (orientation: portrait)"
                    srcSet={chapter.mobileArtwork}
                  />
                  <Image
                    src={chapter.artwork}
                    alt={chapter.alt}
                    width={1200}
                    height={800}
                    className={styles.image}
                    sizes="90vw"
                    preload={preload}
                  />
                </picture>
              )
            )
          }
          caption={
            <figcaption className={styles.storyCaption}>
              <h3
                id={`${headingId}-${chapter.slug}`}
                className={styles.storyTitle}
              >
                {chapter.title}
                <br />
                <span>{chapter.emphasis}</span>
              </h3>
              <p>{chapter.description}</p>
            </figcaption>
          }
        />
      )}
      {project.slug === 'homelab' && <HomelabStatus />}
      <section
        className={styles.ending}
        aria-labelledby={`${headingId}-ending`}
      >
        <h3 id={`${headingId}-ending`}>
          {project.ending.title}
          <br />
          <span>{project.ending.emphasis}</span>
        </h3>
        <div className={styles.endingDetails}>
          <p>{project.ending.body}</p>
          <a
            className={styles.visitLink}
            href={project.ending.linkUrl}
            {...(project.ending.linkUrl.startsWith('/')
              ? {}
              : { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {project.ending.linkLabel}{' '}
            <ArrowUpRight size={28} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
