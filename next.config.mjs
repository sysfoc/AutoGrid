// import createNextIntlPlugin from "next-intl/plugin"

// const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts")

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   experimental: {
//     serverComponentsExternalPackages: ["sharp"],
//   },
//   images: {
//     formats: ["image/webp", "image/avif"],
//     domains: [
//       "petbazar.com.pk",
//       "localhost",
//       "43b24cf828f8d050d3e88450e8d58837.r2.cloudflarestorage.com"
//     ],
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "petbazar.com.pk",
//         port: "",
//         pathname: "/**",
//       },
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "43b24cf828f8d050d3e88450e8d58837.r2.cloudflarestorage.com",
//         port: "",
//         pathname: "/**",
//       },
//     ],
//     dangerouslyAllowSVG: true,
//     contentDispositionType: 'attachment',
//     contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
//     unoptimized: true,
//   },
//   async rewrites() {
//     return [
//       {
//         source: "/uploads/:path*",
//         destination: "/uploads/:path*",
//       },
//     ]
//   },
// }

// export default withNextIntl(() => nextConfig)


import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["sharp"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "petbazar.com.pk",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    unoptimized: true,
  },
}

export default withNextIntl(nextConfig)