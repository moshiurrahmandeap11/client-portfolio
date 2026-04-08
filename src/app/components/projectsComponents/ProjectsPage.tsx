import { projects } from "@/app/utils/projects";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ProjectCard from "./ProjectsCard/ProjectCard";

const ProjectsPage = () => {
  return (
    <div className="py-4">
      <h1 className="text-3xl font-bold text-white">Projects</h1>
      <p className="text-gray-300 font-bold text-3xl py-4">
        A lot of ideas,but some are still under development!
      </p>
      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <div className="flex items-center justify-between py-8">
        <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-900 cursor-pointer">
          <IoIosArrowBack />
          <Link href="/about" className="text-white font-bold">
            About
          </Link>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-900 cursor-pointer">
          <Link href="/skills-tools" className="text-white font-bold">
            Skill & Tools
          </Link>
          <IoIosArrowForward />
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
