const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  useFileSystemPublicRoutes: true,
};

module.exports = withNextIntl(nextConfig);
