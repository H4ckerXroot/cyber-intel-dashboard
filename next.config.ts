import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Article images use native <img> tags — no image optimizer config required.
  // Avoid invalid remotePatterns hostnames that can break production builds.
};

export default nextConfig;
