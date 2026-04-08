"use client";

import { navItems } from "@/app/utils/NavItems";
import Link from "next/link";
import { FaArrowUp } from "react-icons/fa";

const NavList = ({ onItemClick }: { onItemClick?: () => void }) => {
  return (
    <div className="space-y-3">
      {navItems.map((item, index) => (
        <div
          key={item.name}
          className="group"
          style={{
            animation: `slideUpFade 0.4s ease ${index * 0.05}s backwards`,
          }}
        >
          <Link
            href={`/${item.href}`}
            onClick={onItemClick}
            className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-white/5 transition-all duration-200"
          >
            <span className="text-base font-medium text-gray-200 group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
              {item.name}
            </span>

            <FaArrowUp className="rotate-90 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 text-sm" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NavList;
