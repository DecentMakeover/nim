/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname;
    return config;
  },
  images: {
    domains: [],
  },
  experimental: {
    // serverActions: true, // Removed to avoid warning
  },
}

module.exports = nextConfig
