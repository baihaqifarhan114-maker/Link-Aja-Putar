/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Lint tidak memblok build di Vercel.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
