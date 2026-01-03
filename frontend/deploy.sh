#!/bin/bash

# SQL Assistant - 一键部署到 Vercel
# 使用方法: bash deploy.sh

set -e

echo "🚀 SQL Assistant - Vercel 一键部署脚本"
echo "======================================"
echo ""

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
echo "🔐 请登录 Vercel..."
vercel login

# 构建项目
echo "🔨 正在构建项目..."
npm run build

# 部署到 Vercel
echo "🚀 正在部署到 Vercel..."
vercel --prod

echo ""
echo "✅ 部署完成！"
echo ""
echo "📝 下一步："
echo "1. 访问 Vercel 控制台查看部署状态"
echo "2. 在项目设置中配置自定义域名（可选）"
echo "3. 更新 app/about/page.tsx 中的 GitHub 链接"
echo ""
echo "🎉 恭喜！你的 SQL Assistant 已上线！"
