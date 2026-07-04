import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HF Nexus Academy",
    short_name: "HF Nexus",
    description:
      "Online Quran, Hadith, Fiqh & Arabic classes for students worldwide, taught by qualified scholars.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F3",
    theme_color: "#0A1628",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
