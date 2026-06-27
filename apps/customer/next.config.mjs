import NextConfig from "next";

const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.module.css": {
          as: "css",
          loaders: ["css-loader"]
        }
      }
    }
  }
};

export default nextConfig;