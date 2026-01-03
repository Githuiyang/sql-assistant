# 🔐 需要GitHub认证

推送代码需要先配置GitHub认证。选择以下任一方式：

## 方式一：使用 GitHub CLI（推荐，最简单）

### 1. 安装 GitHub CLI
```bash
# macOS
brew install gh

# Linux
sudo apt install gh
```

### 2. 登录 GitHub
```bash
gh auth login
```

选择：
- GitHub.com
- HTTPS
- Yes (upload SSH key)
- Login with a web browser

### 3. 推送代码
```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"
git push -u origin main
```

---

## 方式二：使用 Personal Access Token

### 1. 生成 Token
访问：https://github.com/settings/tokens/new

设置：
- Note: `sql-assistant-deploy`
- Expiration: 90 days
- 勾选 `repo` (全部勾选)
- 点击 "Generate token"
- **复制token**（只显示一次！）

### 2. 推送代码
```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"
git push -u origin main
```

输入：
- Username: `Githuiyang`
- Password: `粘贴你的token`

---

## 方式三：使用 SSH 密钥

### 1. 生成 SSH 密钥
```bash
ssh-keygen -t ed25519 -C "githuiyang@github.com"
```

### 2. 添加到 GitHub
```bash
cat ~/.ssh/id_ed25519.pub
```

复制输出，访问：
https://github.com/settings/keys

点击 "New SSH key"，粘贴，添加。

### 3. 更新远程仓库为 SSH
```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"
git remote set-url origin git@github.com:Githuiyang/sql-assistan.git
git push -u origin main
```

---

## ⭐ 推荐：使用 GitHub CLI

最简单的方式是安装 `gh` 命令行工具：

```bash
# 安装
brew install gh

# 登录（会打开浏览器）
gh auth login

# 推送
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"
git push -u origin main
```

---

**选择一种方式完成后，运行推送命令即可！**
