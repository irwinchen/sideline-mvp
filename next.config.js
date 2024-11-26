/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",

  // Optimize image handling
  images: {
    unoptimized: true,
  },
  // Remove experimental section entirely as server actions are now default
};

module.exports = nextConfig;
