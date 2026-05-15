"use client";
import Image from "next/image";
import Link from "next/link";
import { CiShare1 } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import axiosInstance from "../../sharedComponents/AxiosInstance/AxiosInstance";
import { useEffect, useState } from "react";

interface ProfileData {
    _id: string;
    profilePicture?: {
        url: string;
        publicId: string;
        mediaType: string;
    } | null;
    resume?: {
        url: string;
        fileName: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

const HomePage = () => {

  const [profileInfo, setProfileInfo] = useState<ProfileData | null>(null);

    useEffect(() => {
        // 1. First: Load from localStorage instantly
        const cachedData = localStorage.getItem("profileData");
        if (cachedData) {
            setProfileInfo(JSON.parse(cachedData));
        }

        // 2. Then: Fetch fresh data from server and update
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get("/profile");
                const profileData = res.data.data;
                
                // Save to localStorage
                localStorage.setItem("profileData", JSON.stringify(profileData));
                
                // Update state with fresh data
                setProfileInfo(profileData);
            } catch (error) {
                console.log("Failed to fetch profile:", error);
            }
        };
        
        fetchProfile();
    }, []);

  const profilePicture = profileInfo?.profilePicture?.url;
  const resumeUrl = profileInfo?.resume?.url;



  return (
    <div className="mt-6 max-w-6xl mx-auto md:px-4">
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
        {/* Left side - Profile Image with Glass Badges Below */}
        <div className="md:w-1/3 flex justify-center">
          <div className="relative mt-10 md:mt-0 flex flex-col items-center">
            {/* Main Profile Image */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl shadow-black/30 backdrop-blur-sm z-10">
<Image
    src={profilePicture || "/profile.jpg"}  
    alt="Moshiur Rahman - Professional Portrait"
    fill
    className="object-cover"
    priority
/>
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
            </div>

            {/* Glass Ring */}
            <div className="absolute top-[44%] -translate-y-1/2 w-68 h-68 sm:w-76 sm:h-76 md:w-84 md:h-84 rounded-full border border-white/10 backdrop-blur-3xl bg-white/2" />

            {/* Badges Below Image - Horizontal Row with Dots */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-6 sm:mt-8 z-10">
              <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 bg-white/10 backdrop-blur-2xl text-white/90 text-[10px] sm:text-xs md:text-sm font-medium rounded-full border border-white/20 shadow-lg shadow-black/20 hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300 cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                Web Engineer
              </span>

              <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 bg-white/10 backdrop-blur-2xl text-white/90 text-[10px] sm:text-xs md:text-sm font-medium rounded-full border border-white/20 shadow-lg shadow-black/20 hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300 cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Problem Solver
              </span>

              <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 bg-white/10 backdrop-blur-2xl text-white/90 text-[10px] sm:text-xs md:text-sm font-medium rounded-full border border-white/20 shadow-lg shadow-black/20 hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300 cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                AI Enthusiast
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="md:w-2/3">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            Moshiur Rahman Deap
          </h1>
          <br />
          <h1 className="text-orange-400 text-3xl md:text-4xl font-bold">
            Code Freak, <br /> Problem Solver!
          </h1>
          <br />
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            I am a dedicated Software Engineer specializing in full-stack
            application development. I enjoy crafting responsive web solutions
            using modern technologies like Next.js, React, Tailwind CSS,
            Node.js, Express, and MongoDB, while also applying DevOps practices,
            continuously aiming to deliver high-quality, comprehensive,
            user-centric software solutions.
          </p>
          <br />
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-5 py-2.5 rounded-md font-semibold transition-all duration-300 cursor-pointer group">
              <a
                href={resumeUrl}
                className="text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Resume
              </a>
              <CiShare1 className="text-white group-hover:translate-y-0.5 transition-transform" />
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold transition-all duration-300 cursor-pointer hover:bg-gray-800/50 group">
              <MdOutlineMailOutline className="text-orange-400 text-xl group-hover:scale-110 transition-transform" />
              <a
                href="mailto:moshiurrahmandeap@gmail.com"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Send Mail
              </a>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/about"
        className="mt-12 flex items-center justify-end gap-3 px-6 py-3 rounded-md hover:bg-gray-800/50 transition-all duration-300 w-fit ml-auto group"
      >
        <span className="text-lg font-semibold text-gray-300 group-hover:text-white">
          About Me
        </span>
        <IoIosArrowForward className="text-xl text-orange-400 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default HomePage;
