import React from 'react';
import type { AboutContentProps } from '@/types';
import { ExpertiseCard } from './ExpertiseCard';
import { StaticIcon } from '../icons/StaticIcon';

/**
 * About section content with headline, introduction, and expertise cards
 * Displays the main content of the about section
 */
export function AboutContent({ onScrollToContact, isSmallScreen }: AboutContentProps) {
  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
    onScrollToContact();
  };

  return (
    <div className="about-content">
      {/* Hero Headline */}
      <h2 className="about-content__headline">
        I turn real problems into automated solutions.
      </h2>

      {/* Introduction */}
      <div className="about-content__intro">
        <p className="about-content__intro-text">
          I'm Xinsheng. From deployment pipelines to system monitoring, I build automation that keeps things running smoothly.
        </p>
      </div>

      {/* Expertise Cards */}
      <div className="about-content__cards">
        <ExpertiseCard
          icon={<StaticIcon src="/icons/terminal.svg" alt="Scripting & Automation" />}
          title="Scripting & Automation"
          description="Streamlining operations through Python, Bash, and Linux/UNIX scripting for custom automation and system management."
        />
        <ExpertiseCard
          icon={<StaticIcon src="/icons/server.svg" alt="Homelab Infrastructure" />}
          title="Homelab Infrastructure"
          description="Managing self-hosted servers with Docker, Docker Compose, and Cloudflare for containerization and domain routing."
        />
        <ExpertiseCard
          icon={<StaticIcon src="/icons/globe.svg" alt="Infrastructure" />}
          title="Infrastructure"
          description="Handling domains and deployments via Cloudflare DNS and SSH for reliable hosting."
        />
      </div>

      {/* Call to Action */}
      <div className="about-content__cta" onClick={handleScrollToContact}>
        <div className="about-content__cta-arrow">↓</div>
        <p className="about-content__cta-text">Have a problem that needs solving?</p>
        <p className="about-content__cta-subtext">Let's chat - I'd love to hear about it</p>
      </div>
    </div>
  );
}
