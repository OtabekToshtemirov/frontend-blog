/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backend-blog-x4fs.onrender.com',
        pathname: '/images/*',
      },
      {
        protocol: 'https',
        hostname: 'backend-blog-ota-094ae99fb942.herokuapp.com',
        pathname: '/images/*',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5555',
        pathname: '/images/*',
      }
    ],
    unoptimized: true,
    domains: [
      'backend-blog-x4fs.onrender.com',
      'backend-blog-ota-094ae99fb942.herokuapp.com',
      'localhost'
    ]
  }
}

export default nextConfig
