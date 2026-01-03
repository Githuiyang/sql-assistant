#!/bin/bash

# SQL Assistant - 自动化部署脚本
# 使用方法: bash push-and-deploy.sh YOUR_GITHUB_USERNAME

set -e

echo "🚀 SQL Assistant - 自动部署脚本"
echo "=================================="
echo ""

# 检查参数
if [ -z "$1" ]; then
    echo "❌ 错误: 请提供你的GitHub用户名"
    echo ""
    echo "使用方法:"
    echo "  bash push-and-deploy.sh YOUR_GITHUB_USERNAME"
    echo ""
    echo "示例:"
    echo "  bash push-and-deploy.sh johndoe"
    echo ""
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="sql-assistant"
GITHUB_REPO="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"

echo "📋 配置信息:"
echo "  GitHub用户名: ${GITHUB_USERNAME}"
echo "  仓库名称: ${REPO_NAME}"
echo "  仓库地址: ${GITHUB_REPO}"
echo ""

# 检查是否已经有远程仓库
if git remote | grep -q "origin"; then
    echo "⚠️  检测到已有远程仓库"
    read -p "是否要更新远程仓库地址? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote set-url origin "${GITHUB_REPO}.git"
        echo "✅ 远程仓库地址已更新"
    else
        echo "ℹ️  使用现有远程仓库地址"
    fi
else
    echo "🔗 添加远程仓库..."
    git remote add origin "${GITHUB_REPO}.git"
    echo "✅ 远程仓库已添加"
fi

echo ""
echo "📤 推送代码到 GitHub..."
echo ""

# 推送代码
if git push -u origin main; then
    echo ""
    echo "✅ 代码推送成功！"
    echo ""
    echo "📦 下一步:"
    echo ""
    echo "1️⃣  访问你的GitHub仓库:"
    echo "   ${GITHUB_REPO}"
    echo ""
    echo "2️⃣  在浏览器中打开该链接，确认仓库已创建"
    echo ""
    echo "3️⃣  现在可以部署到Vercel了:"
    echo "   • 访问: https://vercel.com"
    echo "   • 用GitHub登录"
    echo "   • 点击 'Add New Project'"
    echo "   • 选择 '${REPO_NAME}' 仓库"
    echo "   • Root Directory 设为: ./frontend"
    echo "   • 点击 'Deploy'"
    echo ""
    echo "🎉 预计3分钟后你的网站将上线！"
    echo ""
else
    echo ""
    echo "❌ 推送失败！"
    echo ""
    echo "可能的原因:"
    echo "  1. GitHub仓库尚未创建"
    echo "  2. 用户名或仓库名称错误"
    echo "  3. GitHub认证失败"
    echo ""
    echo "请先在GitHub上创建仓库，然后重新运行此脚本"
    echo "仓库地址: ${GITHUB_REPO}"
    echo ""
    exit 1
fi
