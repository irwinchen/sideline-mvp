/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  images: {
    unoptimized: true,
    domains: [
      // Add your image domains here
    ],
  },
  experimental: {
    // Enable if you're using app directory
    appDir: true,
  },
  // Add any environment variables you need to expose to the browser
  env: {
    // Your env vars here
  },
};

module.exports = nextConfig;
