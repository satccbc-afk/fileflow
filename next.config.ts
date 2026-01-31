import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Profile Images
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com', // Drive Previews
      },
      {
        protocol: 'https',
        hostname: 'grainy-gradients.vercel.app', // Noise textures
      }
    ],
  },
};

export default nextConfig;
