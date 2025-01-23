import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images:{
    domains:["static-assets-crtfy.s3.us-west-2.amazonaws.com", "example.com"]
  },
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://blogserver.yeabsiraa.com/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
