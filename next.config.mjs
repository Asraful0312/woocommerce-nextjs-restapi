/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_DOMAIN_NAME],
  },
};

export default nextConfig;
