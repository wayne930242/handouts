const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  useFileSystemPublicRoutes: true,
  reactStrictMode: false,
};

module.exports = withNextIntl(nextConfig);
