"use client";

import { navItems } from "@/app/utils/NavItems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowUp } from "react-icons/fa";

const NavList = ({ onItemClick }: { onItemClick?: () => void }) => {
  const pathname = usePathname();

  // Check if current path matches the nav item
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="space-y-3">
      {navItems.map((item, index) => {
        const active = isActive(item.path);

        return (
          <div
            key={item.name}
            className="group"
            style={{
              animation: `slideUpFade 0.4s ease ${index * 0.05}s backwards`,
            }}
          >
            <Link
              href={item.path}
              onClick={onItemClick}
              className={`flex items-center justify-between py-3 px-2 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5 text-gray-200"
              }`}
            >
              <span
                className={`text-base font-medium transition-all duration-200 ${
                  active
                    ? "text-white font-semibold"
                    : "text-gray-200 group-hover:text-white group-hover:translate-x-1"
                }`}
              >
                {item.name}
              </span>

              <FaArrowUp
                className={`transition-all duration-200 text-sm ${
                  active
                    ? "rotate-90 text-white"
                    : "rotate-90 text-gray-500 group-hover:text-white group-hover:translate-x-1"
                }`}
              />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default NavList;
