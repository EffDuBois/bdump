import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AINotes",
    short_name: "AINotes",
    description: "Your voice notes companion",
    start_url: "/",
    display: "standalone",
    background_color: "#0F0E0E",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
