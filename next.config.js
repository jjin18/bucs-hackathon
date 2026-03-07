/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use a different build dir to avoid EPERM on locked .next folder
  distDir: ".next-build",
  webpack: (config) => {
    config.watchOptions = config.watchOptions || {};
    config.watchOptions.ignored = ["**/node_modules/**", "**/jia-portfolio/**"];
    return config;
  },
}

module.exports = nextConfig
