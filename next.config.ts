import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'vttllhuzmttqpxsrdvnt.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow any other external sources for now since it's a social app
      }
    ],
  },
  compiler: {
    // TEMP: disabled for debugging — re-enable after skeleton loop is fixed
    // removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
};

export default nextConfig;
