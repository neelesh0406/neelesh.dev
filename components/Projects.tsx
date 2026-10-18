import React from "react";
import { motion } from "framer-motion";
import { Project } from "../typings";
import { urlFor } from "../sanity";
import Link from "next/link";

type Props = {
  projects: Project[];
};

export default function Projects({ projects }: Props) {
  return (
    <div className="h-screen relative flex overflow-hidden flex-col text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-0">
      <h3 className="absolute top-20 md:top-24 uppercase tracking-[20px] text-gray-500 text-2xl">
        Projects
      </h3>
      <div className="relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#F7AB0A]/80 scrollbar-thin">
        {/* projects */}
        {projects?.map((project, i) => (
          <div
            key={i}
            className="w-screen flex-shrink-0 snap-center flex flex-col space-y-5 items-center justify-center p-16 md:p-30 xl:p-44 h-screen"
          >
            <Link href={project?.linkToBuild} className="block w-full max-w-3xl h-[28vh] md:h-[34vh] flex-shrink-0">
              <motion.img
                initial={{ y: -300, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2 }}
                // viewport={{ once: true }}
                src={urlFor(project.image).width(1400).fit("max").auto("format").url()}
                alt={`${project.title} preview`}
                className="h-full w-full object-contain cursor-pointer hover:grayscale"
              />
            </Link>
            <div className="space-y-5 md:space-y-10 px-0 md:px-10 max-w-6xl">
              <Link href={project?.linkToBuild}>
                <h4 className="text-3xl md:text-4xl font-semibold text-center cursor-pointer hover:text-[#F7AB0A] transition-all">
                  <span className="underline decoration-[#F7AB0A]/50">
                    Case Study {i + 1} of {projects.length}:
                  </span>{" "}
                  {project?.title}
                </h4>
              </Link>

              <div className="flex items-center space-x-2 justify-center">
                {project?.technologies?.map((technology) => (
                  <img
                    className="h-10 w-10 flex-shrink-0 object-contain"
                    alt={technology.title}
                    key={technology._id}
                    src={urlFor(technology.image).url()}
                  />
                ))}
              </div>

              <p className="text-lg text-center md:text-left">
                {project?.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full absolute top-[30%] bg-[#f70a3757]/50 left-0 h-[500px] -skew-y-12" />
    </div>
  );
}
