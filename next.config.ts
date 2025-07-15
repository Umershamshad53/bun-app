
import type { NextConfig } from "next";





const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    // Ignore the specific Sequelize warning
    config.ignoreWarnings = [{ module: /node_modules\/sequelize\/lib\/dialects\/abstract\/connection-manager\.js/ }];
    return config;
  },
} as NextConfig;

export default nextConfig;