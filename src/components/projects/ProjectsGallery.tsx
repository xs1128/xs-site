import { ArrowDown } from 'lucide-react';
import Footer from '@/components/blog/ui/Footer';
import { KineticSculpture } from './KineticSculpture';
import { SunField } from './SunField';
import { WorkGallery } from './WorkGallery';

export function ProjectsGallery() {
  return (
    <div className="projects-gallery">
      <header className="projects-hero">
        <h1 className="projects-hero__title">
          Projects<span>.</span>
        </h1>
        <KineticSculpture />
        <div className="projects-hero__copy">
          <p>
            A little obsession.
            <br />A lot of making.
          </p>
          <a href="#selected-work" className="projects-explore">
            <span className="projects-explore__icon">
              <ArrowDown size={24} strokeWidth={1.5} aria-hidden="true" />
            </span>
            Explore the work
          </a>
        </div>
      </header>

      <section
        id="selected-work"
        aria-labelledby="selected-work-title"
        className="projects-collection"
      >
        <div className="projects-collection__heading">
          <h2 id="selected-work-title">
            Selected <em>work</em>
            <span aria-hidden="true">.</span>
          </h2>
        </div>
        <WorkGallery />
      </section>

      <SunField />
      <Footer />
    </div>
  );
}
