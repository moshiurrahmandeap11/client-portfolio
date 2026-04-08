"use client";

import { skillsTools } from "@/app/utils/skillsTools";
import Link from "next/link";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const SkillsToolsComponents = () => {
  const [activeTab, setActiveTab] = useState("all");

  // ক্যাটাগরি অনুযায়ী আলাদা করুন
  const frontend = skillsTools.filter((skill) =>
    [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "Shadcn UI",
      "Material UI",
      "Framer Motion",
      "React.js",
      "Redux",
      "Next.js",
    ].includes(skill.name),
  );

  const backend = skillsTools.filter((skill) =>
    ["Node.js", "Express.js", "MongoDB", "PostgreSQL"].includes(skill.name),
  );

  const tools = skillsTools.filter((skill) =>
    ["Vercel", "Git", "Github", "Figma", "Postman", "npm", "VS Code"].includes(
      skill.name,
    ),
  );

  const getSkills = () => {
    if (activeTab === "frontend") return frontend;
    if (activeTab === "backend") return backend;
    if (activeTab === "tools") return tools;
    return skillsTools;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Skills & Tools
        </h1>
        <p className="text-blue-400 font-semibold text-xl md:text-2xl">
          For Learning & debugging purposes
        </p>
        <p className="text-gray-300 w-full mt-4 font-medium text-base md:text-lg leading-relaxed">
          As a full-stack Software Engineer, I specialize in building scalable
          web applications using modern technologies such as Next.js, React, and
          Tailwind CSS. I&apos;m also expanding my expertise into DevOps and
          cloud practices to create efficient, maintainable, robust web
          solutions.
        </p>
      </div>

      {/* Tabs and Skills Section */}
      <div className="space-y-8">
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 rounded-lg transition-all duration-300 font-medium ${
              activeTab === "all"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            All Skills
          </button>
          <button
            onClick={() => setActiveTab("frontend")}
            className={`px-5 py-2.5 rounded-lg transition-all duration-300 font-medium ${
              activeTab === "frontend"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Frontend
          </button>
          <button
            onClick={() => setActiveTab("backend")}
            className={`px-5 py-2.5 rounded-lg transition-all duration-300 font-medium ${
              activeTab === "backend"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Backend
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`px-5 py-2.5 rounded-lg transition-all duration-300 font-medium ${
              activeTab === "tools"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            Tools
          </button>
        </div>

        {/* Skills Count */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Showing {getSkills().length} of {skillsTools.length} skills
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {getSkills().map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.id}
                className="group flex flex-col items-center gap-2 p-4 bg-gray-800/40 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm"
              >
                <Icon className="text-3xl sm:text-4xl text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                <span className="text-xs sm:text-sm font-medium text-gray-400 group-hover:text-white transition-colors duration-300 text-center">
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {getSkills().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No skills found in this category.</p>
          </div>
        )}
      </div>
      <div className="flex py-8 items-center justify-between">
        <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-900 cursor-pointer">
          <IoIosArrowBack />
          <Link href="/projects" className="text-white font-bold">
            Projects
          </Link>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-900 cursor-pointer">
          <Link href="/experience" className="text-white font-bold">
            Experience
          </Link>
          <IoIosArrowForward />
        </div>
      </div>
    </div>
  );
};

export default SkillsToolsComponents;
