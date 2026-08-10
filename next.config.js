/** @type {import('next').NextConfig} */

const with_PWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const next_config = {
  // Add empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
      },
      {
        protocol: "https",
        pathname: "/bytewise0405/**",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
  output: "export",
  trailingSlash: true,
  // Updated deprecated option
  skipProxyUrlNormalize: true,
};

module.exports = with_PWA(next_config);
