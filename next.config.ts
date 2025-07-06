import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude CODE_FILES from build
  experimental: {
    typedRoutes: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src'], // Only lint src directory, excluding CODE_FILES
  },
  // Exclude CODE_FILES from webpack compilation
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // Exclude CODE_FILES directory
    config.module.rules.push({
      test: /CODE_FILES\//,
      use: 'ignore-loader',
    });
    
    return config;
  },
};

export default nextConfig;
