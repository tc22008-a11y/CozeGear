import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
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
module.exports = nextConfig;
