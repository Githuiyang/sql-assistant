# 🚀 为 githuiyang 准备的部署步骤

## 第1步：在 GitHub 创建仓库（30秒）

1. **点击这个链接直接创建**：
   https://github.com/new

2. **填写信息**：
   - Repository name: `sql-assistant`
   - 选择 Public ☑️
   - ⚠️ **不要**勾选 "Add a README file"
   - ⚠️ **不要**勾选 "Add .gitignore"

3. **点击 "Create repository"**

---

## 第2步：推送代码（1分钟）

**复制粘贴以下命令**：

```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant"

git push -u origin main
```

**如果要求输入用户名和密码**：
- Username: `githuiyang`
- Password: 输入你的 **Personal Access Token**（不是GitHub密码）

### 如何获取 Personal Access Token？

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. Note: 输入 `sql-assistant-deploy`
4. Expiration: 选择 90 days
5. 勾选 `repo` (全部勾选)
6. 点击 "Generate token"
7. **复制token**（只显示一次！）
8. 粘贴到密码输入框

---

## 第3步：部署到 Vercel（3分钟）

1. **访问 Vercel**：
   https://vercel.com

2. **登录**：
   - 点击 "Sign Up" 或 "Login"
   - 选择 "Continue with GitHub"

3. **导入项目**：
   - 点击 "Add New Project"
   - 找到 `sql-assistant` 仓库
   - 点击 "Import"

4. **配置项目**：
   ```
   Project Name: sql-assistant
   Framework Preset: Next.js
   Root Directory: ./frontend  ← 重要！
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

5. **点击 "Deploy"**

6. **等待2-3分钟...**

7. **完成！** ✅
   - 访问你的网站：`https://sql-assistant.vercel.app`

---

## 🎉 完成后

你的网站地址将是：
- **Vercel域名**: `https://sql-assistant.vercel.app`
- **GitHub仓库**: `https://github.com/githuiyang/sql-assistant`

### 可选：配置自定义域名

1. 在 Vercel 项目 → Settings → Domains
2. 添加域名，例如：
   - `sql-assistant.githuiyang.com`
   - 或其他包含 "sql-assistant" 的域名

3. 在域名提供商添加 DNS：
   ```
   类型: CNAME
   主机记录: sql-assistant
   记录值: cname.vercel-dns.com
   ```

---

## 📞 需要帮助？

- 生成Token问题：https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- Vercel部署问题：https://vercel.com/docs/deployments/overview

---

**🚀 开始第一步：创建GitHub仓库！**
