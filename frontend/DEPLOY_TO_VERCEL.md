# 🚀 SQL Assistant - 完整部署指南

恭喜！代码已准备就绪。现在需要推送到GitHub并部署到Vercel。

---

## 📋 步骤一：推送到 GitHub

### 1. 创建 GitHub 仓库

1. **登录 GitHub**
   - 访问 https://github.com
   - 登录你的账号

2. **创建新仓库**
   - 点击右上角 "+" → "New repository"
   - 仓库名称：`sql-assistant`
   - 设置为 Public（公开）
   - ⚠️ **不要**勾选 "Add a README file"
   - 点击 "Create repository"

### 2. 推送代码到 GitHub

**重要**: 将下面的命令中的 `YOUR_USERNAME` 替换为你的GitHub用户名

```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/sql-assistant.git

# 推送代码
git branch -M main
git push -u origin main
```

**如果遇到错误**，先删除已有的远程仓库：
```bash
git remote remove origin
# 然后重新添加
git remote add origin https://github.com/YOUR_USERNAME/sql-assistant.git
git push -u origin main
```

---

## 🌐 步骤二：部署到 Vercel

### 方式 A：使用 Vercel 网站（推荐，5分钟）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 点击 "Sign Up" 或 "Login"
   - 选择 "Continue with GitHub" 授权登录

2. **导入项目**
   - 登录后点击 "Add New Project"
   - 在 "Import Git Repository" 中找到 `sql-assistant`
   - 点击 "Import"

3. **配置项目**
   ```
   Project Name: sql-assistant

   Framework Preset: Next.js (自动检测)

   Root Directory: ./frontend

   Build Command: npm run build (默认)

   Output Directory: .next (默认)

   Install Command: npm install (默认)
   ```

4. **环境变量**（可选）
   - 点击 "Environment Variables"
   - 添加以下变量（可选）：
     ```
     NEXT_PUBLIC_APP_NAME: SQL Assistant
     NEXT_PUBLIC_APP_URL: https://sql-assistant.vercel.app
     ```

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待 2-3 分钟...
   - 部署成功！✅

6. **访问你的网站**
   - Vercel 会提供一个域名，例如：`https://sql-assistant.vercel.app`
   - 点击访问即可！

### 方式 B：使用 Vercel CLI（适合开发者）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"
vercel

# 生产环境部署
vercel --prod
```

---

## 🌍 步骤三：配置自定义域名（可选）

### 1. 在 Vercel 添加域名

1. 进入你的 Vercel 项目
2. 点击 "Settings" → "Domains"
3. 点击 "Add Domain"
4. 输入你的域名，例如：
   - `sql-assistant.yourdomain.com`
   - 或包含 "sql-assistant" 的子域名

### 2. 配置 DNS

在你的域名提供商（阿里云/腾讯云/Cloudflare等）添加 DNS 记录：

**如果使用根域名**（如 `sql-assistant.com`）：
```
Type: A
Name: @
Value: 76.76.21.21
```

**如果使用子域名**（如 `sql-assistant.yourdomain.com`）：
```
Type: CNAME
Name: sql-assistant
Value: cname.vercel-dns.com
```

### 3. 等待 DNS 生效

- 通常需要 10 分钟 - 24 小时
- Vercel 会自动配置 SSL 证书

---

## ✅ 步骤四：部署后必做事项

### 1. 更新 GitHub 链接

编辑以下文件，将所有 `your-username` 替换为你的GitHub用户名：

**app/about/page.tsx**
```typescript
// 搜索并替换这些链接
https://github.com/your-username/sql-assistant
// 改为
https://github.com/YOUR_USERNAME/sql-assistant
```

**README.md**
```markdown
# 更新这些链接
[在线演示](https://your-domain.vercel.app)
[GitHub](https://github.com/YOUR_USERNAME/sql-assistant)
```

### 2. 重新部署

更新文件后：
```bash
git add .
git commit -m "docs: update GitHub links"
git push
```

Vercel 会自动检测到更新并重新部署！

### 3. 测试网站功能

访问你的网站，测试：
- ✅ 首页加载
- ✅ 使用示例数据
- ✅ 生成字段字典
- ✅ SQL生成功能
- ✅ 关于页面 ⭐

---

## 🎯 快速命令参考

### 本地开发
```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"
npm install
npm run dev
# 访问 http://localhost:3000
```

### 构建和部署
```bash
# 本地构建测试
npm run build

# 推送到 GitHub
git add .
git commit -m "your message"
git push

# Vercel 会自动部署
```

---

## 📊 部署成功检查清单

- [ ] GitHub 仓库已创建并推送代码
- [ ] Vercel 项目已导入并部署成功
- [ ] 网站可以正常访问
- [ ] GitHub 链接已更新
- [ ] 自定义域名已配置（如需要）
- [ ] 所有功能测试通过

---

## 🔗 常用链接

- **Vercel 控制台**: https://vercel.com/dashboard
- **Vercel 部署文档**: https://vercel.com/docs/deployments/overview
- **Next.js 部署文档**: https://nextjs.org/docs/deployment

---

## 🆘 遇到问题？

### Vercel 部署失败

1. 检查 `package.json` 中的脚本是否正确
2. 确认 Root Directory 设置为 `./frontend`
3. 查看 Vercel 的部署日志

### GitHub 推送失败

1. 确认 SSH 密钥已配置
2. 尝试使用 HTTPS 而不是 SSH
3. 检查仓库权限

### DNS 不生效

1. 使用 `nslookup` 检查 DNS
2. 清除浏览器缓存
3. 等待更长时间（最长24小时）

---

## 🎉 完成！

你的 SQL Assistant 已成功部署！

**访问地址**:
- Vercel 域名: `https://sql-assistant.vercel.app`
- 自定义域名: `https://sql-assistant.yourdomain.com`

**项目地址**:
- GitHub: `https://github.com/YOUR_USERNAME/sql-assistant`

**下一步**:
1. 分享到社交媒体
2. 提交到 Product Hunt
3. 收集用户反馈
4. 持续优化迭代

---

**🎊 恭喜！你的 SQL Assistant 现在可以被全世界访问了！**
