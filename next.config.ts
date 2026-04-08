import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ["i.postimg.cc"],
  },
};

export default nextConfig;
