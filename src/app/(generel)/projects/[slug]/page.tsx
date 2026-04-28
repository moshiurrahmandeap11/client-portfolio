import ProjectDetailCard from "@/app/components/projectsComponents/ProjectDetailCard/ProjectDetailCard";
import { projects } from "@/app/utils/projects";

// For Next.js App Router with async params
const ProjectDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  // Await the params
  const { slug } = await params;

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return <div className="text-white">Project not found</div>;
  }

  return (
    <div className="py-6">
      <ProjectDetailCard project={project} />
    </div>
  );
};

export default ProjectDetailsPage;
