#!/bin/bash

# SQL Assistant 启动脚本

echo "🚀 SQL Assistant 启动中..."
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到Node.js，请先安装Node.js (>= 18.0)"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未检测到npm"
    exit 1
fi

# 进入前端目录
cd "$(dirname "$0")/frontend"

# 检查node_modules是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
    echo ""
fi

# 启动开发服务器
echo "🎯 启动开发服务器..."
echo "📝 访问地址: http://localhost:3000"
echo "⏹️  按 Ctrl+C 停止服务"
echo ""

npm run dev
