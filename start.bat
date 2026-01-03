@echo off
REM SQL Assistant 启动脚本 (Windows)

echo 🚀 SQL Assistant 启动中...
echo.

REM 检查Node.js是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未检测到Node.js，请先安装Node.js ^=^>= 18.0^)
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 进入前端目录
cd /d "%~dp0frontend"

REM 检查node_modules是否存在
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
    echo.
)

REM 启动开发服务器
echo 🎯 启动开发服务器...
echo 📝 访问地址: http://localhost:3000
echo ⏹️  按 Ctrl+C 停止服务
echo.

call npm run dev

pause
