"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CiShare1 } from "react-icons/ci";
import { FaArrowUp, FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import MusicBox from "../sharedComponents/MusicBox/MusicBox";
import NavList from "../sharedComponents/NavList/NavList";
import SearchBox from "../sharedComponents/SearchBox/SearchBox";

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Menu open with scroll up effect
  const openMenu = () => {
    setIsMenuOpen(true);
    // Start from bottom (fully hidden)
    setTranslateY(500);
    // Force reflow
    setTimeout(() => {
      setTranslateY(0);
    }, 10);
  };

  // Menu close with scroll down effect
  const closeMenu = () => {
    setTranslateY(500);
    setTimeout(() => {
      setIsMenuOpen(false);
      setTranslateY(0);
    }, 400);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setStartY(e.clientY);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;

    // Allow dragging only downward for closing
    if (deltaY > 0 && deltaY <= 500) {
      setTranslateY(deltaY);
      setCurrentY(e.clientY);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    const distance = currentY - startY;

    // If dragged down more than 100px, close the menu
    if (distance > 100) {
      closeMenu();
    } else {
      // Snap back to fully open position
      setTranslateY(0);
    }

    setStartY(0);
    setCurrentY(0);
  };

  return (
    <div className="py-4 bg-transparent backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <GiHamburgerMenu
          className="text-xl cursor-pointer md:hidden"
          onClick={openMenu}
        />
        <div className="hidden md:block">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <FaArrowUp className="rotate-45 text-3xl" />
              <Link href="/" className="text-lg font-bold ">
                moshiur.dev
              </Link>
            </div>
            <div>
              <ul className="flex items-center gap-6">
                <li>
                  <Link
                    href="/"
                    className={`transition-colors ${pathname === "/" ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}
                  >
                    Home
                  </Link>
                </li>
                <li className="group flex items-center gap-2 font-semibold text-gray-400 hover:text-white transition-all duration-200 ">
                  <a
                    href="https://www.linkedin.com/in/moshiurrahmandeap"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  <CiShare1 className="transition-transform duration-200 group-hover:font-semibold group-hover:rotate-90" />
                </li>
                <li className="group flex items-center gap-2 font-semibold text-gray-400 hover:text-white transition-all duration-200">
                  <a
                    href="https://drive.google.com/file/d/1SLw6YHzNh0fdagBRbOMO77cVzqQSWW6t/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resume
                  </a>
                  <CiShare1 className="transition-transform duration-200 group-hover:font-semibold group-hover:rotate-90" />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <div className="mt-2 flex items-center gap-2 bg-gray-900 px-4 py-1 rounded-full border-2 border-gray-700">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-white font-semibold">{time}</p>
          </div>
          <MusicBox />
          <a
            href="https://github.com/moshiurrahmandeap11"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-2xl cursor-pointer" />
          </a>
        </div>
      </div>

      {/* Mobile Menu with Scroll Effect */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50"
          onClick={closeMenu}
          style={{
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div
            ref={menuRef}
            className="fixed bottom-0 left-0 w-full bg-linear-to-t from-black/95 to-black/90 backdrop-blur-md border-t-2 border-gray-700 text-white rounded-t-2xl"
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
            {/* Drag Handle */}
            <div
              className="sticky top-0 w-full flex justify-center cursor-grab active:cursor-grabbing bg-inherit pt-2 pb-1 z-10"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <div className="w-12 h-1 bg-gray-500 rounded-full hover:bg-gray-400 transition-colors duration-200" />
            </div>

            <div className="px-6 pb-8 mt-4">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FaArrowUp className="rotate-45 text-2xl" />
                  <Link href="/" className="text-base font-bold">
                    moshiur.dev
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <MusicBox />
                  <a
                    href="https://github.com/moshiurrahmandeap11"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="text-xl cursor-pointer" />
                  </a>
                </div>
              </div>

              <div
                className="w-full flex items-center justify-between bg-black/70 border-2 border-gray-600 px-1 py-2 rounded-md "
                onClick={closeMenu}
              >
                <Link
                  href="/"
                  className={`transition-colors pl-4 cursor-pointer ${pathname === "/" ? "text-white font-semibold" : "text-gray-400 hover:text-white"}`}
                >
                  Home
                </Link>
                <FaArrowUp className="rotate-90 " />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-linear-to-r from-transparent to-gray-500"></div>
                <h1 className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  Sections
                </h1>
                <div className="flex-1 h-px bg-linear-to-l from-transparent to-gray-500"></div>
              </div>

              {/* Navigation Items with Stagger Animation */}
              <NavList onItemClick={closeMenu} />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(4px);
          }
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Header;
