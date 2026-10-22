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
            target="_blank"
            rel="noopener noreferrer"
            className="projects-text-link"
          >
            Visit {work.title} <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          {work.repositoryUrl && (
            <a
              href={work.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="projects-text-link"
            >
              View source <ArrowUpRight size={18} aria-hidden="true" />
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
