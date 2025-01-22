import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://blogserver.yeabsiraa.com/:path*',
      },
    ];
  },
};

export default nextConfig;
