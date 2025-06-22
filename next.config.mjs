/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/tickets/:path*',
        destination: 'https://psa-backend-gerb.onrender.com/api/tickets/:path*'
      }
    ];
  }
};

export default nextConfig;
