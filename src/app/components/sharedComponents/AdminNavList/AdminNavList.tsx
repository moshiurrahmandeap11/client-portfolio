"use client";

import { useState } from "react";
import { AdminNav } from "@/app/utils/AdminNav";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminNavList = ({ onItemClick }: { onItemClick?: () => void }) => {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isActive = (path: string) => pathname === path;

  const isParentActive = (children?: any[]) => {
    return children?.some((child) => pathname.startsWith(child.path));
  };

  return (
    <div className="space-y-3">
      {AdminNav.map((item, index) => {
        const hasChildren = !!item.children;
        const active =
          isActive(item.path || "") || isParentActive(item.children);

        return (
          <div
            key={item.name}
            className="group"
            style={{
              animation: `slideUpFade 0.4s ease ${index * 0.05}s backwards`,
            }}
          >
            {/* Parent Item */}
            <div
              onClick={() => {
                if (hasChildren) {
                  setOpenIndex(openIndex === index ? null : index);
                }
              }}
              className={`flex items-center justify-between py-3 px-2 rounded-lg cursor-pointer transition-all duration-200 ${
                active
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5 text-gray-200"
              }`}
            >
              {item.path && !hasChildren ? (
                <Link href={item.path} onClick={onItemClick}>
                  {item.name}
                </Link>
              ) : (
                <span className="flex-1">{item.name}</span>
              )}

              {/* Dropdown Icon */}
              {hasChildren && (
                <span
                  className={`transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              )}
            </div>

            {/* Submenu */}
            {hasChildren && openIndex === index && (
              <div className="ml-4 mt-2 space-y-2">
                {item.children.map((sub: any) => {
                  const subActive = isActive(sub.path);

                  return (
                    <Link
                      key={sub.name}
                      href={sub.path}
                      onClick={onItemClick}
                      className={`block py-2 px-2 rounded-md text-sm transition-all ${
                        subActive
                          ? "bg-white/10 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminNavList;