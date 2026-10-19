import { useEffect } from "react";
import {
  FoldablePhone,
  PhoneDevice,
  FoldToggle,
  useFoldablePhone,
} from "./iphone-duo";
function ScrollFold() {
  const { progress } = useFoldablePhone();
  useEffect(() => {
    const root = document.getElementById("portfolio-scroll"),
      hero = document.getElementById("hero");
    if (!root || !hero) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const travel = Math.max(1, hero.offsetHeight - root.clientHeight);
      const offset =
        root.getBoundingClientRect().top - hero.getBoundingClientRect().top;
      progress.set(
        reduced.matches ? 1 : Math.max(0, Math.min(1, offset / travel)),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    root.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [progress]);
  return null;
}
export default function PhoneHero() {
  return (
    <FoldablePhone className="portfolio-phone">
      <ScrollFold />
      <PhoneDevice
        modelSrc="/models/iphone-duo.glb"
        coverSrc="/phone/cover.png"
        screenSrc="/phone/inside.png"
        rotation={-6}
        blur={10}
        parallax={0.2}
      />
      <div className="phone-controls">
        <span>Scroll to unfold ↓</span>
        <FoldToggle className="heroButton" />
      </div>
    </FoldablePhone>
  );
}
