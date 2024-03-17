/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ["riddle.my.id"] } },
};

export default nextConfig;
