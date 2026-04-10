# GitHub 仓库设置指南

## 仓库名称

已选择：**psd-to-code**

## 设置步骤

### 1. 在 GitHub 上创建仓库

1. 登录 GitHub 账号
2. 点击右上角的 "+", 选择 "New repository"
3. 在 "Repository name" 字段中输入：`psd-to-code`
4. 选择仓库可见性（Public 或 Private）
5. 不要勾选 "Initialize this repository with a README"
6. 点击 "Create repository"

### 2. 复制仓库 URL

创建仓库后，复制仓库的 SSH 或 HTTPS URL：

- **SSH URL** 示例：`git@github.com:yourusername/psd-to-code.git`
- **HTTPS URL** 示例：`https://github.com/yourusername/psd-to-code.git`

### 3. 关联本地仓库

在项目目录中运行以下命令：

```bash
# 添加远程仓库
git remote add origin <GitHub仓库URL>

# 推送代码到远程仓库
git push -u origin master
```

### 4. 验证设置

推送完成后，在 GitHub 上查看仓库，确认代码已成功上传。

## 后续步骤

1. **设置 GitHub Actions**（可选）：为项目添加 CI/CD 流程
2. **添加分支保护**（建议）：保护 main 分支
3. **设置 issue 模板**（可选）：规范 bug 报告和功能请求
4. **创建项目看板**（可选）：管理开发任务

## 注意事项

- 确保本地 Git 配置正确（user.name 和 user.email）
- 如果遇到权限问题，检查 SSH 密钥设置
- 首次推送可能需要输入 GitHub 凭证

## 联系方式

如果在设置过程中遇到问题，请随时咨询。

---

**设置状态**：待执行
**最后更新**：2026-04-09