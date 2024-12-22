import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
    NEXT_PUBLIC_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    NEXT_PUBLIC_X_API_KEY: process.env.NEXT_PUBLIC_X_API_KEY,
  },
  webpack: (config) => {
    config.resolve.alias["@"] = join(__dirname, "src");
    return config;
  },
  rewrites: () => {
    console.log("current redirect:" + process.env.NEXT_PUBLIC_BACKEND_REDIRECT);
    console.log("current backend" + process.env.NEXT_PUBLIC_BACKEND_BASE_URL);

    return [
      {
        source: "/api/:slug*",
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_REDIRECT
            ? process.env.NEXT_PUBLIC_BACKEND_REDIRECT
            : "/api"
        }/:slug*`,
      },
    ];
  },
};

export default nextConfig;
