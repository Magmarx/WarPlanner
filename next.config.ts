import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        port: '',
        pathname: '/marvel-contestofchampions/**',
      },
      {
        protocol: 'https',
        hostname: 'marvel-contestofchampions.fandom.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
