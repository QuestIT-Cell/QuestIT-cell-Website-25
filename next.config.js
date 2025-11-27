/** @type {import('next').NextConfig} */

const with_PWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const next_config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
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
    ],
  },
};

module.exports = with_PWA(next_config);
