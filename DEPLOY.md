# Netlify部署指南

## 自动部署

本项目已配置为可以直接部署到Netlify。按照以下步骤操作：

1. 在Netlify上创建账户并登录
2. 点击"New site from Git"
3. 选择您的Git提供商（GitHub、GitLab或Bitbucket）
4. 授权Netlify访问您的仓库
5. 选择包含此项目的仓库
6. 配置构建选项：
   - 构建命令将自动使用 `npm run build`
   - 发布目录将自动使用 `dist`
7. 点击"Deploy site"

## 手动部署

如果您想手动部署，请按照以下步骤操作：

1. 在本地构建项目
   ```
   npm run build
   ```

2. 将`dist`目录上传到Netlify
   - 登录Netlify
   - 转到"Sites"页面
   - 将`dist`文件夹拖放到指定区域

## 常见问题解决

### 构建失败

如果您看到类似以下错误：
```
错误消息
命令失败，退出代码1：cd client & npm install & npm run build
```

这可能是因为Netlify的构建设置不正确。请确保：

1. 在Netlify的站点设置中，转到"Build & deploy" > "Build settings"
2. 确认构建命令为 `npm run build`
3. 确认发布目录为 `dist`
4. 如果您之前设置了自定义构建命令如 `cd client & npm install & npm run build`，请将其更改为 `npm run build`

### 路由问题

如果部署后发现刷新页面或直接访问URL路径返回404，请确保：

1. `public/_redirects` 文件存在且包含 `/* /index.html 200`
2. 或者确保 `netlify.toml` 文件中包含正确的重定向规则

## 环境变量

如果您的项目需要环境变量，请在Netlify的站点设置中的"Build & deploy" > "Environment"部分添加它们。