"use client";

import Image from "next/image";
import { useState } from "react";
import { CiShare1 } from "react-icons/ci";
import { FaGithub } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

type Project = {
  id: number;
  title: string;
  short_description: string;
  descriptioin: string;
  techStack: string[];
  features: string[];
  challenges: string[];
  learnings: string[];
  links: { name: string; url: string }[];
  screenshots: string[];
};

const ProjectDetailCard = ({ project }: { project: Project }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === project.screenshots.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? project.screenshots.length - 1 : prevIndex - 1,
    );
  };

  const openModal = (img: string) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  return (
    <div className="space-y-6 text-gray-300">
      {/* Title */}
      <h1 className="text-3xl font-bold text-white">{project.title}</h1>

      {/* Description */}
      <p className="leading-relaxed text-gray-400">{project.descriptioin}</p>

      {/* Tech Stack */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="bg-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">Features</h2>
        <ul className="list-disc list-inside space-y-1">
          {project.features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      </div>

      {/* Challenges */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">Challenges</h2>
        <ul className="list-disc list-inside space-y-1">
          {project.challenges.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Learnings */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">Learnings</h2>
        <ul className="list-disc list-inside space-y-1">
          {project.learnings.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>

      {/* Links */}
      <div className="flex gap-4 pt-4">
        {project.links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            className="flex items-center gap-2 bg-orange-800 px-4 py-2 rounded-md text-gray-300 font-semibold hover:text-white transition"
          >
            {link.name === "GitHub" ? (
              <FaGithub size={20} />
            ) : (
              <CiShare1 size={20} />
            )}
            {link.name}
          </a>
        ))}
      </div>

      {/* Screenshots Slider */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Screenshots</h2>

        {/* Slider Container */}
        <div className="relative group">
          {/* Main Image */}
          <div
            className="relative w-full h-75 sm:h-100 md:h-125 cursor-pointer overflow-hidden rounded-lg"
            onClick={() => openModal(project.screenshots[currentIndex])}
          >
            <Image
              src={project.screenshots[currentIndex]}
              alt={`${project.title} screenshot ${currentIndex + 1}`}
              fill
              className="object-contain rounded-lg border border-gray-700 bg-gray-900 transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Navigation Buttons */}
          {project.screenshots.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <FiChevronRight size={24} />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {project.screenshots.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {project.screenshots.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === idx
                      ? "w-8 h-2 bg-white"
                      : "w-2 h-2 bg-gray-500 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Thumbnails for Desktop */}
          {project.screenshots.length > 1 && (
            <div className="hidden md:grid grid-cols-4 gap-2 mt-4">
              {project.screenshots.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative h-20 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    currentIndex === idx
                      ? "border-white scale-95"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for full screen image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="relative max-w-7xl w-full mx-4">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <IoClose size={32} />
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedImage}
                alt="Full screen screenshot"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailCard;
