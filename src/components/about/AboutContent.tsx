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
          icon={<StaticIcon src="/icons/globe.svg" alt="" />}
          title="Full-Stack Engineering"
          description="TypeScript and Python web apps with React, Next.js, FastAPI, and PostgreSQL."
          index={0}
        />
        <ExpertiseCard
          icon={<StaticIcon src="/icons/server.svg" alt="" />}
          title="Infrastructure"
          description="Docker Compose stacks with VPN, Cloudflare DNS, Prometheus, and Grafana."
          index={1}
        />
        <ExpertiseCard
          icon={<StaticIcon src="/icons/terminal.svg" alt="" />}
          title="Automation"
          description="Python and Bash for automation, GitHub Actions & Jenkins CI/CD, batch tooling, and Linux workflows."
          index={2}
        />
      </div>

      {/* Call to Action with magnetic effect */}
      <MagneticCTA onClick={onScrollToContact} isVisible={isVisible} />
    </div>
  );
}
