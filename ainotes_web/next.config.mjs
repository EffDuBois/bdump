import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
    NEXT_PUBLIC_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  },
  webpack: (config) => {
    config.resolve.alias["@"] = join(__dirname, "src");
    return config;
  },
  rewrites: () => {
    return [
      {
        source: "/api/:slug*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/:slug*`,
      },
    ];
  },
};

export default nextConfig;
