import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/custom/sign-in",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;