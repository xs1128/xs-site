import React from 'react';
import { ExpertiseCard } from './ExpertiseCard';
import { AnimatedHeadline } from './AnimatedHeadline';
import { MagneticCTA } from './MagneticCTA';
import { StaticIcon } from '../icons/StaticIcon';

export interface AboutContentProps {
  onScrollToContact: () => void;
  isVisible: boolean;
}

/**
 * About section content with animated headline, introduction, and expertise cards
 * Features scroll-triggered entrance animations and micro-interactions
 */
export function AboutContent({
  onScrollToContact,
  isVisible,
}: AboutContentProps) {
  return (
    <div className="about-content">
      {/* Hero Headline with animated reveal */}
      <AnimatedHeadline
        text="I turn real problems into automated solutions."
        isVisible={isVisible}
      />

      {/* Expertise Cards with staggered entrance animations */}
      <div
        className={`about-content__cards ${isVisible ? 'about-content__cards--visible' : ''}`}
      >
        <ExpertiseCard
          icon={<StaticIcon src="/icons/terminal.svg" alt="" />}
          title="Scripting & Automation"
          description="Streamlining operations through Python, Bash, and Linux/UNIX scripting for custom automation and system management."
          index={0}
        />
        <ExpertiseCard
          icon={<StaticIcon src="/icons/server.svg" alt="" />}
          title="Server Infrastructure"
          description="Managing self-hosted servers with Docker, Docker Compose, and Cloudflare for containerization and domain routing."
          index={1}
        />
        <ExpertiseCard
          icon={<StaticIcon src="/icons/globe.svg" alt="" />}
          title="Infrastructure"
          description="Handling domains and deployments via Cloudflare DNS and SSH for reliable hosting."
          index={2}
        />
      </div>

      {/* Call to Action with magnetic effect */}
      <MagneticCTA onClick={onScrollToContact} isVisible={isVisible} />
    </div>
  );
}
