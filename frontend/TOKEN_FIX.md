# 🔑 Token权限问题解决

## ❌ 错误原因

推送失败（403 Permission denied），说明Token没有正确的权限。

---

## ✅ 解决方法：重新生成Token

### 步骤1：删除旧Token（可选）
访问：https://github.com/settings/tokens
找到 `sql-assistant` token，点击删除

### 步骤2：重新生成Token（正确配置）

1. **访问**：https://github.com/settings/tokens/new

2. **配置Token**：
   - **Note**: `sql-assistant-deploy`
   - **Expiration**: `90 days` 或 `No expiration`（选择无过期时间）

3. **⚠️ 重要：勾选以下权限**：
   - ☑️ **repo** - 完整的仓库访问权限
     - repo:status
     - repo_deployment
     - public_repo
     - repo:invite
     - security_events

   或者简单点：只勾选最上面的 `repo`（会自动勾选所有子项）

4. **点击底部的 "Generate token"**

5. **复制Token**（格式：`ghp_xxxxxxxxxxxx`）
   - ⚠️ 只显示一次，立即复制！

---

### 步骤3：重新推送

**获得新Token后，告诉我**，格式如：
```
ghp_新的token字符串
```

或者，你可以自己执行：

```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"

# 使用新Token推送（替换 NEW_TOKEN）
git push https://NEW_TOKEN@github.com/Githuiyang/sql-assistan.git main
```

---

## 📝 Token权限检查清单

生成Token时，确保至少勾选了：
- [x] repo（完整仓库控制）

如果不勾选repo，就无法推送代码。

---

## 💡 提示

**最简单的方式**：
1. 访问 https://github.com/settings/tokens/new
2. Note: `sql-assistant-full`
3. Expiration: `No expiration`
4. ☑️ 只勾选最上面的 `repo`
5. Generate token
6. 复制并告诉我

---

**重新生成Token后告诉我，我会立即推送代码！** 🚀
