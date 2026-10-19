import { useEffect, useRef, useState } from "react";
import { Experience } from "../typings";
import { urlFor } from "../sanity";

const clamp = (value: number, max: number) => Math.max(0, Math.min(max, value));
const date = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
};
const dates = (item: Experience) => `${date(String(item.dateStarted))} — ${item.isCurrentlyWorkingHere ? "Present" : date(String(item.dateEnded))}`;

export default function WorkExperience({ experiences }: { experiences: Experience[] }) {
  const items = [...experiences].sort((a, b) => new Date(b.dateStarted).getTime() - new Date(a.dateStarted).getTime());
  const [position, setPosition] = useState(0);
  const [introduced, setIntroduced] = useState(false);
  const [selected, setSelected] = useState<Experience | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const gesture = useRef({ x: 0, y: 0, position: 0, down: false, dragged: false });
  const last = Math.max(0, items.length - 1);
  const active = Math.round(position);

  useEffect(() => {
    const root = document.getElementById("portfolio-scroll");
    const section = document.getElementById("experience");
    if (!root || !section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = root.getBoundingClientRect().top - section.getBoundingClientRect().top;
      const travel = Math.max(1, section.offsetHeight - root.clientHeight);
      setPosition(clamp(offset / travel, 1) * last);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIntroduced(true); observer.disconnect(); }
    }, { root, threshold: 0.35 });
    if (stage.current) observer.observe(stage.current);
    update();
    root.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); root.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [last]);

  useEffect(() => {
    if (!selected) return;
    const root = document.getElementById("portfolio-scroll");
    const previous = root?.style.overflowY;
    if (root) root.style.overflowY = "hidden";
    dialog.current?.showModal();
    return () => { if (root) root.style.overflowY = previous || ""; trigger.current?.focus({ preventScroll: true }); };
  }, [selected]);

  const goTo = (index: number) => {
    const next = clamp(index, last);
    setPosition(next);
    const root = document.getElementById("portfolio-scroll");
    const section = document.getElementById("experience");
    if (!root || !section || !last) return;
    const top = root.scrollTop + section.getBoundingClientRect().top - root.getBoundingClientRect().top;
    root.scrollTo({ top: top + (section.offsetHeight - root.clientHeight) * next / last, behavior: "auto" });
  };
  const close = () => { dialog.current?.close(); setSelected(null); };

  return <div className="experience-sticky">
    <div className="experience-heading">
      <h3>Experience</h3>
      <h2>Teams I’ve built with.</h2>
      <p>A few chapters of my engineering journey.</p>
    </div>
    <div ref={stage} className={`experience-stage ${introduced ? "experience-introduced" : ""}`} role="region" aria-label="Career carousel"
      onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); goTo(active + (event.key === "ArrowRight" ? 1 : -1)); } }}
      onPointerDown={event => { gesture.current = { x: event.clientX, y: event.clientY, position, down: true, dragged: false }; }}
      onPointerMove={event => { const g = gesture.current; if (!g.down) return; const dx = event.clientX - g.x; if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(event.clientY - g.y)) { g.dragged = true; setPosition(clamp(g.position - dx / 240, last)); } }}
      onPointerUp={() => { const g = gesture.current; g.down = false; if (g.dragged) goTo(Math.round(position)); }}
      onPointerLeave={() => { if (gesture.current.down && gesture.current.dragged) goTo(Math.round(position)); gesture.current.down = false; }}
      onPointerCancel={() => { gesture.current.down = false; }}>
      <div className="experience-orbit">
        {items.map((item, index) => {
          const distance = index - position;
          // Place every company on an elliptical orbit, including the rear cards.
          const angle = distance * (2 * Math.PI / Math.max(items.length, 3));
          const depth = Math.cos(angle);
          const side = Math.sin(angle);
          return <button type="button" key={item._id} className="experience-panel" aria-label={`View experience at ${item.company}`} aria-haspopup="dialog"
            data-active={active === index} style={{ transform: `translate(-50%, -50%) translate3d(calc(var(--experience-radius) * ${side}), ${(depth - 1) * 90}px, ${(depth - 1) * 320}px) rotateY(${-side * 65}deg)`, zIndex: Math.round((depth + 1) * 10) }}
            onClick={event => { if (gesture.current.dragged) { gesture.current.dragged = false; return; } trigger.current = event.currentTarget; setSelected(item); }}>
            <div className="experience-panel-top"><span>CHAPTER {String(index + 1).padStart(2, "0")}</span><span>↗</span></div>
            <div className={`experience-logo ${item.company.toLowerCase().includes("tenerity") ? "experience-logo-dark" : ""}`}><img src={urlFor(item.companyImage).width(320).fit("max").auto("format").url()} alt="" draggable={false}/></div>
            <div className="experience-panel-copy"><p className="experience-company">{item.company}</p><h4>{item.jobTitle}</h4><p className="experience-dates">{dates(item)}</p>{item.location && <p className="experience-location">📍 {item.location}</p>}<p className="experience-highlight">{item.points?.[0]}</p><span className="experience-details-link">Explore this chapter <span>+</span></span></div>
          </button>;
        })}
      </div>
    </div>
    <div className="experience-controls">
      <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous company">←</button>
      <span aria-live="polite">{items.length ? String(active + 1).padStart(2, "0") : "00"} <span className="experience-count">/ {String(items.length).padStart(2, "0")}</span></span>
      <button type="button" onClick={() => goTo(active + 1)} disabled={active === last} aria-label="Next company">→</button>
    </div>
    <p className="experience-scroll-hint">Drag to rotate · Click to explore <span>Scroll to continue ↓</span></p>
    {selected && <dialog ref={dialog} className="experience-dialog" aria-labelledby="experience-dialog-title" onCancel={close} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="experience-dialog-content">
        <button autoFocus type="button" className="experience-close" onClick={close} aria-label="Close experience details">Close ×</button>
        <p className="experience-eyebrow">Experience</p><p className="experience-company">{selected.company}</p>
        <h2 id="experience-dialog-title">{selected.jobTitle}</h2><p className="experience-dates">{dates(selected)}</p>{selected.location && <p className="experience-location">📍 {selected.location}</p>}
        <ul>{selected.points?.map((point, index) => <li key={index}>{point}</li>)}</ul>
        <div className="experience-technologies">{selected.technologies?.filter(Boolean).map(technology => <span key={technology._id}>{technology.title}</span>)}</div>
      </div>
    </dialog>}
  </div>;
}
