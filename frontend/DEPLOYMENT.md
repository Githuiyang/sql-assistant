# 🚀 SQL Assistant 部署指南

## 方案一：Vercel 部署（推荐，免费且简单）

### 步骤 1: 准备 GitHub 仓库

```bash
# 初始化 Git 仓库
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"
git init
git add .
git commit -m "feat: initial release v0.1.0"

# 创建 GitHub 仓库后，添加远程地址
git remote add origin https://github.com/your-username/sql-assistant.git
git branch -M main
git push -u origin main
```

### 步骤 2: 部署到 Vercel

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 `sql-assistant` 仓库
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Next.js (自动检测)
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)
   - **Install Command**: `npm install` (默认)

4. **环境变量**（可选）
   ```
   NEXT_PUBLIC_APP_NAME=SQL Assistant
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

5. **部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟，部署完成！

### 步骤 3: 配置自定义域名（可选）

1. **在 Vercel 项目设置中**
   - 进入项目 → Settings → Domains
   - 添加你的域名（例如：`sql-assistant.yourdomain.com`）

2. **配置 DNS**
   - 在你的域名提供商（阿里云、腾讯云等）添加 CNAME 记录
   - 主机记录：`sql-assistant`
   - 记录类型：`CNAME`
   - 记录值：`cname.vercel-dns.com`

3. **等待 DNS 生效**
   - 通常需要 10 分钟 - 24 小时

### 步骤 4: 更新 GitHub Release 链接

更新 `app/about/page.tsx` 中的 GitHub 链接：

```typescript
// 将所有这些链接替换为你的实际 GitHub 仓库地址
href="https://github.com/your-username/sql-assistant"
```

---

## 方案二：Netlify 部署（备选）

### 步骤 1: 准备构建配置

创建 `netlify.toml` 文件：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 步骤 2: 部署到 Netlify

1. **访问 Netlify**
   - 打开 https://netlify.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New site from Git"
   - 选择你的 `sql-assistant` 仓库
   - 配置构建设置（与 Vercel 类似）
   - 点击 "Deploy site"

---

## 方案三：Docker 部署（自托管）

### 步骤 1: 构建镜像

```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"
docker build -t sql-assistant:latest .
```

### 步骤 2: 运行容器

```bash
docker run -d \
  --name sql-assistant \
  -p 3000:3000 \
  --restart unless-stopped \
  sql-assistant:latest
```

### 步骤 3: 使用 Nginx 反向代理（可选）

创建 Nginx 配置：

```nginx
server {
    listen 80;
    server_name sql-assistant.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🎯 推荐部署方案对比

| 方案 | 优点 | 缺点 | 费用 |
|------|------|------|------|
| **Vercel** | 最简单、CDN 全球加速、自动 HTTPS | 免费版有带宽限制 | 免费（100GB/月） |
| **Netlify** | 功能丰富、表单处理 | 部署速度略慢 | 免费（100GB/月） |
| **Docker 自托管** | 完全控制、无限制 | 需要服务器、运维成本 | 服务器费用 |

**推荐使用 Vercel**，配置最简单，性能最好，完全免费！

---

## 📊 Vercel 免费套餐限制

- ✅ **带宽**: 100GB/月
- ✅ **构建时间**: 6000分钟/月
- ✅ **部署次数**: 无限
- ✅ **CDN**: 全球加速
- ✅ **HTTPS**: 自动配置
- ✅ **自定义域名**: 支持

对于个人项目和小型应用，完全够用！

---

## 🔗 常用链接

- **Vercel 控制台**: https://vercel.com/dashboard
- **Vercel 文档**: https://vercel.com/docs
- **Next.js 部署文档**: https://nextjs.org/docs/deployment

---

## ✅ 部署检查清单

部署前请确认：

- [ ] GitHub 仓库已创建并推送代码
- [ ] `package.json` 中的脚本正确
- [ ] `next.config.js` 已配置 `output: 'standalone'`
- [ ] `vercel.json` 配置文件存在
- [ ] 所有环境变量已配置（如需要）
- [ ] GitHub 链接已更新为实际地址
- [ ] README.md 中的链接正确

---

## 🎉 部署成功后

1. **测试网站**
   - 访问你的 Vercel 域名
   - 测试所有功能是否正常

2. **更新 README**
   - 添加在线演示链接
   - 添加部署徽章

3. **分享给世界**
   - 发布到 Product Hunt
   - 分享到社交媒体
   - 提交到各大目录网站

---

需要帮助？查看 [Vercel 部署文档](https://vercel.com/docs/deployments/overview)
