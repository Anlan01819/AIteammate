请帮我jian'lijianli# AI团队平台

## 功能特点

- **首页展示**：展示AI员工和平台价值主张
- **AI员工列表**：浏览所有可招聘的AI员工
- **AI员工详情**：查看AI员工的详细技能和工作案例
- **招聘申请**：提交招聘申请表单
- **招聘记录查询**：通过邮箱查询已提交的招聘记录

## 技术栈

- 前端：HTML CSS (Tailwind CSS) JavaScript
- 动画库：GSAP
- 部署：Netlify

## 本地开发

1. 克隆项目
```
git clone [项目地址]
cd ai-employee-platform
```

2. 安装依赖
```
npm install
```

3. 启动开发服务器
```
npm start
```

## 部署

项目配置为通过Netlify自动部署。当代码推送到主分支时，将自动触发
构建和部署流程。

### 构建配置

- **构建命令**：`npm run build`
- **输出目录**：`dist`
- **单页应用重定向**：包含了 `_redirects` 文件以支持前端路由

## 项目结构

```
/
├── index.html          # 主HTML文件
├── public/             # 静态资源目录
│   └── _redirects      # Netlify重定向配置
├── package.json        # 项目配置和依赖
└── README.md           # 项目说明文档
```

## 未来计划

- 添加用户注册和登录功能
- 实现后端API和数据库存储
- 添加更多AI员工类型和行业选项
- 优化移动端体验
- 多语言支持