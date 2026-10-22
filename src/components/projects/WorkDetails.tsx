'use client';

import dynamic from 'next/dynamic';
import { ArrowUpRight, X } from 'lucide-react';
import { projects, type Work } from '@/lib/projects';

const ProjectPanel = dynamic(
  () => import('./ProjectPanel').then((module) => module.ProjectPanel),
  {
    loading: () => (
      <p className="projects-work__loading">Opening the homelab…</p>
    ),
  },
);

export interface WorkDetailsProps {
  work: Work;
  onClose?: (animate: boolean) => void;
}

export function WorkDetails({ work, onClose }: WorkDetailsProps) {
  const project = projects.find((item) => item.slug === work.slug);
  return (
    <section
      id={`details-${work.slug}`}
      className="projects-work"
      aria-label={`${work.title} details`}
    >
      <div className="projects-work__intro">
        <p className="projects-work__label">{work.category}</p>
        {onClose && (
          <button
            type="button"
            className="projects-work__close"
            aria-label={`Close ${work.title}`}
            onClick={(event) => onClose(event.detail > 0)}
          >
            <X size={20} aria-hidden="true" /> Close
          </button>
        )}
        {work.instagram && (
          <div className="projects-work__social">
            <dl className="projects-work__stats">
              <div>
                <dt>Posts</dt>
                <dd>{work.instagram.posts.toLocaleString('en-US')}</dd>
              </div>
              <div>
                <dt>Followers</dt>
                <dd>{work.instagram.followers.toLocaleString('en-US')}</dd>
              </div>
            </dl>
            <a
              href={`https://www.instagram.com/${work.instagram.handle}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="projects-text-link projects-work__instagram"
              aria-label={`Follow @${work.instagram.handle} on Instagram (opens in a new tab)`}
            >
              Follow @{work.instagram.handle}
              <ArrowUpRight size={24} aria-hidden="true" />
            </a>
            <p className="projects-work__as-of">As of {work.instagram.asOf}</p>
          </div>
        )}
        <p className="projects-work__summary">{work.description}</p>
        <div className="projects-work__built">
          <h4>What I built</h4>
          <ul>
            {work.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
        <div className="projects-work__stack" aria-label="Technologies">
          {work.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="projects-work__links">
          <a
            href={work.liveUrl}
            {...(work.liveUrl.startsWith('/')
              ? {}
              : { target: '_blank', rel: 'noopener noreferrer' })}
            className="projects-text-link"
          >
            {work.liveLabel ?? `Visit ${work.title}`}{' '}
            <ArrowUpRight size={22} aria-hidden="true" />
          </a>
          {work.repositoryUrl && (
            <a
              href={work.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="projects-text-link"
            >
              View source <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      {project && (
        <div className="projects-work__story">
          <ProjectPanel project={project} />
        </div>
      )}
      {onClose && (
        <button
          type="button"
          className="projects-work__close projects-work__back"
          onClick={(event) => onClose(event.detail > 0)}
        >
          <X size={20} aria-hidden="true" /> Back to the gallery
        </button>
      )}
    </section>
  );
}
