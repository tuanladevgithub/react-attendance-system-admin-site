/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "soict.hust.edu.vn",
        port: "",
        // pathname: "/my-bucket/**",
      },
    ],
  },
};

module.exports = nextConfig;
