import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import About from "../components/About";
import ContactMe from "../components/ContactMe";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import WorkExperience from "../components/WorkExperience";
import { sanityClient, urlFor } from "../sanity";
import { Experience, PageInfo, Project, Skill, Social } from "../typings";

type Props = {
  pageInfo: PageInfo;
  experiences: Experience[];
  skill: Skill[];
  projects: Project[];
  socials: Social[];
};

const Home = ({ pageInfo, experiences, skill, projects, socials }: Props) => {
  return (
    <div id="portfolio-scroll" className="bg-[rgb(36,36,36)] text-white h-screen snap-y snap-proximity overflow-y-scroll overflow-x-hidden z-0 scrollbar scrollbar-track-gray-400/20 scrollbar-thumb-[#F7AB0A]/80">
      <Head>
        <title>{pageInfo?.name}&apos;s Portfolio</title>
      </Head>

      <Header socials={socials} />
      {/* Hero */}
      <section id="hero" className="snap-start phone-hero-section">
        <Hero pageInfo={pageInfo} />
      </section>
      {/* About */}
      <section id="about" className="snap-center">
        <About pageInfo={pageInfo} />
      </section>
      {/* Experience */}
      <section id="experience" className="snap-center experience-section">
        <WorkExperience experiences={experiences} />
      </section>
      <section id="skills" className="snap-start">
        <Skills skills={skill} />
      </section>

      <section id="projects" className="snap-start">
        <Projects projects={projects} />
      </section>

      <section id="contact" className="snap-start">
        <ContactMe pageInfo={pageInfo} />
      </section>

      <Link href="#hero">
        <footer className="sticky bottom-5 w-full cursor-pointer">
          <div className="flex items-center justify-center">
            <img
              className="h-10 w-10 rounded-full filter grayscale hover:grayscale-0 cursor-pointer"
              src={urlFor(pageInfo?.heroImage).url()}
            />
          </div>
        </footer>
      </Link>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const props = await sanityClient
    .withConfig({ useCdn: false, apiVersion: "2025-02-19", perspective: "published" })
    .fetch<Props>(`{
      "pageInfo": *[_type == "pageInfo"][0],
      "experiences": *[_type == "experience"]{..., technologies[]->},
      "skill": *[_type == "skill"],
      "projects": *[_type == "project"] | order(priority asc){..., technologies[]->},
      "socials": *[_type == "social"]
    }`);
  if (!props.pageInfo) throw new Error("The configured Sanity dataset has no published profile.");
  return { props, revalidate: 60 };
};
