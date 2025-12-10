import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Run on port 3001 to avoid conflict with backend on 3000
  // Set via package.json scripts instead for flexibility

  // Enable standalone output for production deployment
  output: 'standalone',

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'medfms.cognitcube.com',
        pathname: '/uploads/**',
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Redirect root to dashboard
  async redirects() {
    return [];
  },

  // Rewrite API calls to backend (alternative to CORS)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
