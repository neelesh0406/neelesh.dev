import { useRef, useState } from "react";
import { Project } from "../typings";
import { urlFor } from "../sanity";
import Link from "next/link";

export default function Projects({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const navigate = (index: number) => {
    const element = track.current;
    if (!element) return;
    element.scrollTo({ left: index * element.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return <div className="projects-showcase">
    <h3 className="projects-label">Projects</h3>
    <div className="project-controls"><button type="button" aria-label="Previous project" disabled={active === 0} onClick={() => navigate(active - 1)}>←</button><span aria-live="polite">{projects.length ? active + 1 : 0} / {projects.length}</span><button type="button" aria-label="Next project" disabled={active >= projects.length - 1} onClick={() => navigate(active + 1)}>→</button></div>
    <div ref={track} className="projects-track" role="region" aria-label="Personal projects" tabIndex={0}
      onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); navigate(Math.max(0, Math.min(projects.length - 1, active + (event.key === "ArrowRight" ? 1 : -1)))); } }}
      onScroll={event => setActive(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}>
      {projects.map((project, index) => <article className="project-slide" key={project._id}>
        <Link href={project.linkToBuild} className="project-preview"><img src={urlFor(project.image).width(1400).fit("max").auto("format").url()} alt={`${project.title} preview`} /></Link>
        <div className="project-copy"><p className="project-number">PROJECT {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</p>
          <Link href={project.linkToBuild}><h4>{project.title}</h4></Link>
          <div className="project-technologies">{(project.technologyLabels ?? project.technologies?.filter(Boolean).map(technology => technology.title) ?? []).map(label => <span key={label}>{label}</span>)}</div>
          <p className="project-summary">{project.summary}</p>
          <div className="project-links"><Link className="project-visit" href={project.linkToBuild}>{project.linkToBuild.startsWith("https://github.com/") ? "View on GitHub" : "View project"} ↗</Link>{project.liveUrl && <Link className="project-visit" href={project.liveUrl}>Live demo ↗</Link>}</div>
        </div>
      </article>)}
    </div>

    <div className="project-accent" aria-hidden="true" />
  </div>;
}
