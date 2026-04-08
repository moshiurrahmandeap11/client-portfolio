import { projects } from "@/app/utils/projects";
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
    </div>
  );
};

export default ProjectsPage;
