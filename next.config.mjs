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
        protocol: 'http',
        hostname: 'localhost',
        port: '5555',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4444',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-blog-x4fs.onrender.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-blog-ota-094ae99fb942.herokuapp.com',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  }
}

export default nextConfig
