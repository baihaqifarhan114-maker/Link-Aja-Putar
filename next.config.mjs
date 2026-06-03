/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Prototipe demo — lint tidak memblok build di Vercel.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
