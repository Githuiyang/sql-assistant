/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 启用 standalone 输出，用于 Docker 部署
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-syntax-highlighter'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'sql.js': 'sql.js/dist/sql-wasm.js',
    };
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });
    return config;
  },
}

module.exports = nextConfig
