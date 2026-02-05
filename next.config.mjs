/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.APP_ENV === 'electron' ? 'export' : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
