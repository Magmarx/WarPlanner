/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['static.wikia.nocookie.net', 'marvel-contestofchampions.fandom.com'],
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
