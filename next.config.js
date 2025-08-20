/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['rickandmortyapi.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rickandmortyapi.com',
        port: '',
        pathname: '/api/character/avatar/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@tanstack/react-query'],
  },
}

module.exports = nextConfig