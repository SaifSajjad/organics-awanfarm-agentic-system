import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/brand/**"
      }
    ]
  }
};

export default nextConfig;
