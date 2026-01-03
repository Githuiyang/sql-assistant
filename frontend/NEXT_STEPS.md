# 🚀 推送到 GitHub 并部署到 Vercel

## 📝 快速开始（2种方式任选）

### 方式一：使用自动脚本 ⭐ 推荐

```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"

# 替换 YOUR_USERNAME 为你的GitHub用户名
bash push-and-deploy.sh YOUR_USERNAME
```

**示例**:
```bash
bash push-and-deploy.sh johndoe
```

脚本会自动：
- ✅ 添加GitHub远程仓库
- ✅ 推送所有代码
- ✅ 显示Vercel部署步骤

---

### 方式二：手动命令

**第1步：在 GitHub 创建仓库**
1. 访问 https://github.com/new
2. 仓库名：`sql-assistant`
3. 选择 Public
4. ⚠️ 不要勾选 "Add README"
5. 点击 "Create repository"

**第2步：推送代码**
```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"

# 替换 YOUR_USERNAME
git remote add origin https://github.com/YOUR_USERNAME/sql-assistant.git
git branch -M main
git push -u origin main
```

**示例**:
```bash
git remote add origin https://github.com/johndoe/sql-assistant.git
git push -u origin main
```

---

## 🌐 部署到 Vercel（3分钟）

### 1. 登录 Vercel
访问：https://vercel.com
点击：**"Sign Up"** 或 **"Login"**
选择：**"Continue with GitHub"**

### 2. 导入项目
- 点击 **"Add New Project"**
- 找到 `sql-assistant` 仓库
- 点击 **"Import"**

### 3. 配置项目
```
Project Name: sql-assistant

Framework Preset: Next.js (自动检测)

Root Directory: ./frontend  ← 重要！

Build Command: npm run build

Output Directory: .next

Install Command: npm install
```

### 4. 部署
- 点击 **"Deploy"** 按钮
- 等待 2-3 分钟...
- ✅ 部署完成！

### 5. 访问网站
Vercel 会提供一个域名，例如：
```
https://sql-assistant.vercel.app
```

点击访问即可！

---

## 🌍 配置自定义域名（可选）

### 添加域名

1. 进入 Vercel 项目 → **Settings** → **Domains**
2. 点击 **"Add Domain"**
3. 输入域名，例如：
   ```
   sql-assistant.yourdomain.com
   ```

### 配置 DNS

在你的域名提供商添加：

```
类型: CNAME
主机记录: sql-assistant
记录值: cname.vercel-dns.com
```

### 等待生效
- 通常 10 分钟 - 24 小时
- Vercel 自动配置 SSL

---

## ✅ 部署后检查清单

- [ ] 网站可以访问
- [ ] 测试"使用示例数据"功能
- [ ] 测试智谱AI推荐链接
- [ ] 测试所有页面

---

## 🆘 常见问题

### Q: 推送失败？
A: 确认GitHub仓库已创建，用户名正确

### Q: Vercel 构建失败？
A: 检查 Root Directory 是否设为 `./frontend`

### Q: 域名不生效？
A: DNS生效需要时间，最多24小时

---

## 📞 需要帮助？

查看详细指南：
- `DEPLOY_TO_VERCEL.md` - 完整部署文档
- `README.md` - 项目说明

---

**🎊 开始部署吧！**
