"use client";

import Link from "next/link";

type Project = {
  title: string;
  short_description: string;
  slug: string;
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="border border-gray-800 rounded-xl p-5 bg-[#18181B] transition-all duration-300 hover:scale-[1.05] hover:shadow-lg">
      <Link href={`/projects/${project.slug}`}>
        {/* Title */}
        <h2 className="text-lg font-semibold text-white">{project.title}</h2>

        {/* Description */}
        <p className="text-gray-400 font-medium mt-2 text-sm leading-relaxed">
          {project.short_description}
        </p>

        {/* Learn More */}
        <div className="mt-4">
          <span className="text-gray-400 hover:text-gray-300 transition-colors">
            Learn More...
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
