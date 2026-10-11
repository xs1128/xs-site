import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/projects';
import { ProjectScene } from './ProjectScene';
import styles from './projects.module.css';

export function ProjectPanel({
  project,
  preload = false,
}: {
  project: Project;
  preload?: boolean;
}) {
  const headingId = `project-${project.slug}`;

  return (
    <>
      <ProjectScene
        labelledBy={headingId}
        header={
          <header className={styles.heading}>
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
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            </div>
          </header>
        }
        artwork={
          <picture className={styles.picture}>
            <source
              media="(max-width: 960px) and (orientation: portrait)"
              srcSet="/projects/homelab-mobile.svg"
            />
            <Image
              src={project.artwork.src}
              alt={project.artwork.alt}
              width={project.artwork.width}
              height={project.artwork.height}
              className={styles.image}
              sizes="90vw"
              preload={preload}
            />
          </picture>
        }
      />
      {project.chapters.map((chapter) => (
        <ProjectScene
          key={chapter.slug}
          kind={chapter.slug}
          labelledBy={`${headingId}-${chapter.slug}`}
          header={null}
          artwork={
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
              />
            </picture>
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
      ))}
      <section
        className={styles.ending}
        aria-labelledby={`${headingId}-ending`}
      >
        <h3 id={`${headingId}-ending`}>
          My own little
          <br />
          <span>corner of the internet.</span>
        </h3>
        <div className={styles.endingDetails}>
          <p>
            That’s a homelab: a place to run things myself, try new ideas, and
            learn how it all works. This one happens to fit on my desk.
          </p>
          <a
            className={styles.visitLink}
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the homelab <ArrowUpRight size={24} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
