import { useState } from "react";
import { Skill as SkillType } from "../typings";
import { urlFor } from "../sanity";
import { skillGroups } from "../content/skill-groups";

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
function SkillLabel({ name, skill }: { name: string; skill?: SkillType }) {
  const [failed, setFailed] = useState(false);
  // The legacy JavaScript asset contains a Node.js mark; use its text label instead.
  const logo = name !== "JavaScript" && skill?.image?.asset?._ref;
  return <li className="skill-label">
    {logo && !failed && <img src={urlFor(skill.image).width(64).height(64).fit("max").auto("format").url()} alt="" width={24} height={24} loading="lazy" onError={() => setFailed(true)} />}
    <span>{name}</span>
  </li>;
}

export default function Skills({ skills }: { skills: SkillType[] }) {
  return <div className="skills-section">
    <header className="skills-heading"><h3>Skills</h3><h2>My development toolkit.</h2><p>The technologies I use to build, test, and ship.</p></header>
    <div className="skills-categories">
      {skillGroups.map((group, index) => <article className="skills-category" key={group.title}>
        <div className="skills-category-heading"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h4>{group.title}</h4></div>
        <p>{group.description}</p>
        <ul>{group.skills.map(name => <SkillLabel key={name} name={name} skill={skills.find(skill => normalize(skill.title) === normalize(name))} />)}</ul>
      </article>)}
    </div>
  </div>;
}
