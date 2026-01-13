/** @type {import("next").NextConfig} */
const config = {
  images: {
    // Allow all external image URLs
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow any hostname
      },
      {
        protocol: "http",
        hostname: "**", // Allow any hostname
      },
    ],
    dangerouslyAllowSVG: true, // optional if you upload SVGs
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // optional
  },
};

export default config;
