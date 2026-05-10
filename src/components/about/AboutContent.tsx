import React from 'react';
import type { AboutContentProps } from '@/types';
import { ExpertiseCard } from './ExpertiseCard';
import { AnimatedHeadline } from './AnimatedHeadline';
import { MagneticCTA } from './MagneticCTA';
import { StaticIcon } from '../icons/StaticIcon';
import { useIntersectionAnimation } from '@/hooks/useIntersectionAnimation';

/**
 * About section content with animated headline, introduction, and expertise cards
 * Features scroll-triggered entrance animations and micro-interactions
 */
export function AboutContent({ onScrollToContact, isSmallScreen }: AboutContentProps) {
  const { isVisible } = useIntersectionAnimation({
    threshold: 0.15,
    rootMargin: '-50px'
  });

  const handleScrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
    onScrollToContact();
  };

  return (
    <div className="about-content">
      {/* Hero Headline with animated reveal */}
      <AnimatedHeadline
        text="I turn real problems into automated solutions."
        isVisible={isVisible}
      />

      {/* Expertise Cards with staggered entrance animations */}
      <div className={`about-content__cards ${isVisible ? 'about-content__cards--visible' : ''}`}>
        <ExpertiseCard
          icon={<StaticIcon src="/icons/terminal.svg" alt="Scripting & Automation" />}
          title="Scripting & Automation"
          description="Streamlining operations through Python, Bash, and Linux/UNIX scripting for custom automation and system management."
          isSmallScreen={isSmallScreen}
        />
        <ExpertiseCard
          icon={<StaticIcon src="/icons/server.svg" alt="Server Infrastructure" />}
          title="Server Infrastructure"
          description="Managing self-hosted servers with Docker, Docker Compose, and Cloudflare for containerization and domain routing."
          isSmallScreen={isSmallScreen}
        />
        <ExpertiseCard
          icon={<StaticIcon src="/icons/globe.svg" alt="Infrastructure" />}
          title="Infrastructure"
          description="Handling domains and deployments via Cloudflare DNS and SSH for reliable hosting."
          isSmallScreen={isSmallScreen}
        />
      </div>

      {/* Call to Action with magnetic effect */}
      <MagneticCTA
        onClick={handleScrollToContact}
        isSmallScreen={isSmallScreen}
        isVisible={isVisible}
      />
    </div>
  );
}
