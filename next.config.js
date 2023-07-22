/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  future: {
    webpack5: true,
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: [
      "i.pravatar.cc",
      "ipfs.io",
      "arweave.net",
      "lh3.googleusercontent.com",
	  "cdn.discordapp.com"
    ],
  },
};

module.exports = nextConfig;
