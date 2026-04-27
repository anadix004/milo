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
};

export default nextConfig;
