import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    default: sanity,
  },
  images: {
    remotePatterns: [new URL("https://cdn.sanity.io/**")],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
