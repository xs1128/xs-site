'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Menu } from 'lucide-react';
import { FullScreenNav } from '@/components/navigation/FullScreenNav';

export interface ProjectNavigationProps {
  appearance?: 'paper' | 'dark';
  backToGallery?: boolean;
}

export function ProjectNavigation({
  appearance = 'paper',
  backToGallery = false,
}: ProjectNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        className="projects-nav"
        data-appearance={appearance}
        aria-label="Projects navigation"
      >
        <Link
          href={backToGallery ? '/projects' : '/'}
          className="projects-nav__home"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          <span className="projects-nav__label">
            {backToGallery ? 'All projects' : 'Portfolio'}
          </span>
        </Link>
        <div className="projects-nav__actions">
          <a
            href="https://github.com/xs1128"
            target="_blank"
            rel="noopener noreferrer"
            className="projects-nav__github"
            aria-label="GitHub profile (opens in a new tab)"
          >
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.08c-3.12.68-3.78-1.32-3.78-1.32-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.94.1-.73.39-1.22.71-1.5-2.49-.28-5.11-1.25-5.11-5.54 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.62 5.25-5.12 5.53.4.35.76 1.03.76 2.08v3.07c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
            </svg>
            <span>GitHub</span>
          </a>
          <button
            type="button"
            className="projects-nav__menu"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={30} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </nav>
      <FullScreenNav
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        homeSections={false}
      />
    </>
  );
}
