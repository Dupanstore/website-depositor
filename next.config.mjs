/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { allowedOrigins: ["hegame.click"] } },
};

export default nextConfig;
