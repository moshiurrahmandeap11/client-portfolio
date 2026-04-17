"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CiShare1 } from "react-icons/ci";
import { FaArrowUp, FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoStatsChart } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import MusicBox from "../sharedComponents/MusicBox/MusicBox";
import NavList from "../sharedComponents/NavList/NavList";
import SearchBox from "../sharedComponents/SearchBox/SearchBox";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Prevent body scroll when profile modal is open
  useEffect(() => {
    if (isProfileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isProfileModalOpen]);

  const openMenu = () => {
    setIsMenuOpen(true);
    setTranslateY(500);
    setTimeout(() => {
      setTranslateY(0);
    }, 10);
  };

  const closeMenu = () => {
    setTranslateY(500);
    setTimeout(() => {
      setIsMenuOpen(false);
      setTranslateY(0);
    }, 400);
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleStatsNavigation = () => {
    closeProfileModal();
    router.push("/stats");
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    if (deltaY > 0 && deltaY <= 500) {
      setTranslateY(deltaY);
      setCurrentY(e.clientY);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    const distance = currentY - startY;
    if (distance > 100) {
      closeMenu();
    } else {
      setTranslateY(0);
    }
    setStartY(0);
    setCurrentY(0);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-40 py-3 md:py-4 bg-black/80 backdrop-blur-2xl border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <GiHamburgerMenu
              className="text-xl cursor-pointer md:hidden text-white hover:text-orange-400 transition-colors"
              onClick={openMenu}
            />

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <FaArrowUp className="rotate-45 text-2xl text-orange-400 group-hover:rotate-90 transition-transform duration-300" />
                  <Link
                    href="/"
                    className="text-lg font-bold text-white hover:text-orange-400 transition-colors"
                  >
                    moshiur.online
                  </Link>
                </div>
                <div>
                  <ul className="flex items-center gap-6">
                    <li>
                      <Link
                        href="/"
                        className={`transition-all duration-200 ${
                          pathname === "/"
                            ? "text-orange-400 font-semibold"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Home
                      </Link>
                    </li>
                    <li className="group flex items-center gap-2 font-semibold text-gray-400 hover:text-white transition-all duration-200">
                      <a
                        href="https://www.linkedin.com/in/moshiurrahmandeap"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        LinkedIn
                        <CiShare1 className="transition-transform duration-200 group-hover:rotate-90" />
                      </a>
                    </li>
                    <li className="group flex items-center gap-2 font-semibold text-gray-400 hover:text-white transition-all duration-200">
                      <a
                        href="https://drive.google.com/file/d/1SLw6YHzNh0fdagBRbOMO77cVzqQSWW6t/view?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        Resume
                        <CiShare1 className="transition-transform duration-200 group-hover:rotate-90" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Side Items */}
            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden md:block">
                <SearchBox />
              </div>
              <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm px-3 md:px-4 py-1.5 rounded-full border border-gray-700">
                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-white font-semibold text-sm md:text-base">
                  {time}
                </p>
              </div>
              <MusicBox />
              <a
                href="https://github.com/moshiurrahmandeap11"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors"
              >
                <FaGithub className="text-xl md:text-2xl cursor-pointer" />
              </a>

              {/* Profile Image with Click Handler */}
              <button
                onClick={openProfileModal}
                className="focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-full transition-transform hover:scale-105"
              >
                <Image
                  src="/profile.jpg"
                  alt="Moshiur Rahman profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border-2 border-orange-400"
                  priority
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={closeMenu}
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          />

          <div
            ref={menuRef}
            className="absolute bottom-0 left-0 right-0 w-full bg-linear-to-t from-gray-900 to-black border-t-2 border-orange-500/50 text-white rounded-t-2xl shadow-2xl"
            style={{
              transform: `translateY(${translateY}px)`,
              transition: isDragging
                ? "none"
                : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              willChange: "transform",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="sticky top-0 w-full flex justify-center cursor-grab active:cursor-grabbing bg-inherit pt-2 pb-1 z-10"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <div className="w-12 h-1 bg-gray-600 rounded-full hover:bg-orange-400 transition-colors duration-200" />
            </div>

            <div className="px-6 pb-8 mt-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FaArrowUp className="rotate-45 text-2xl text-orange-400" />
                  <Link href="/" className="text-base font-bold text-white">
                    moshiur.online
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <MusicBox />
                  <a
                    href="https://github.com/moshiurrahmandeap11"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 transition-colors"
                  >
                    <FaGithub className="text-xl cursor-pointer" />
                  </a>
                  <button onClick={openProfileModal}>
                    <Image
                      src="/profile.jpg"
                      alt="Moshiur Rahman profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border-2 border-orange-400"
                    />
                  </button>
                </div>
              </div>

              <div
                className="w-full flex items-center justify-between bg-gray-800/50 border border-gray-700 px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer"
                onClick={closeMenu}
              >
                <Link
                  href="/"
                  className={`transition-colors ${
                    pathname === "/"
                      ? "text-orange-400 font-semibold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Home
                </Link>
                <FaArrowUp className="rotate-90 text-gray-400" />
              </div>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-linear-to-r from-transparent to-gray-600"></div>
                <h1 className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  Sections
                </h1>
                <div className="flex-1 h-px bg-linear-to-l from-transparent to-gray-600"></div>
              </div>

              <NavList onItemClick={closeMenu} />
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeProfileModal}
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <div
            className="relative bg-linear-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-gray-700 w-full max-w-sm overflow-hidden"
            style={{ animation: "scaleIn 0.3s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative h-24 bg-linear-to-r from-orange-600 to-orange-500">
              <button
                onClick={closeProfileModal}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors bg-black/20 rounded-full p-1"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            {/* Profile Image */}
            <div className="relative -mt-12 flex justify-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-900 bg-linear-to-br from-gray-800 to-gray-900">
                <Image
                  src="/profile.jpg"
                  alt="Moshiur Rahman"
                  fill
                  sizes="10px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center mt-4 px-6">
              <h2 className="text-xl font-bold text-white">Moshiur Rahman</h2>
              <p className="text-orange-400 text-sm mt-1">Software Engineer</p>
              <p className="text-gray-400 text-xs mt-2">
                Full-stack Developer | Problem Solver
              </p>
            </div>

            <div className="border-t border-gray-800 my-4"></div>

            {/* Modal Options */}
            <div className="px-6 pb-6">
              <button
                onClick={handleStatsNavigation}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <IoStatsChart className="text-xl text-orange-400 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-200 font-medium group-hover:text-white">
                    View Statistics
                  </span>
                </div>
                <FaArrowUp className="rotate-45 text-gray-400 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
