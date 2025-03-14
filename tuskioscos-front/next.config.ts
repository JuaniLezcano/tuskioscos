import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Esto permite que el build se complete incluso con errores de ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
