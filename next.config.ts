import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next-dev",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jianx144.sg-host.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: "jianx144.sg-host.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
