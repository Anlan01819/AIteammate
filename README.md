# AI职场精灵 - 智能招聘平台

一个现代化的AI驱动职场招聘平台，提供智能匹配、自动化面试安排和高效的人才管理解决方案。

## 🚀 项目特性

### 核心功能
- **智能AI员工推荐** - 基于机器学习算法的精准匹配
- **实时聊天系统** - 支持用户与AI员工实时沟通
- **多维度筛选** - 技能、价格、评分等多重筛选条件
- **用户评价系统** - 完整的评价和反馈机制
- **聘用记录管理** - 详细的聘用历史和状态跟踪
- **响应式设计** - 完美适配桌面端和移动端

### 技术亮点
- **前端**: React 18 + React Router + Axios
- **后端**: Node.js + Express + JWT认证
- **数据库**: Supabase (PostgreSQL)
- **部署**: Netlify + Heroku
- **CI/CD**: GitHub Actions自动化部署
- **安全**: HTTPS、数据加密、XSS防护

## 📁 项目结构

```
ai-workplace-genie/
├── client/                 # React前端应用
│   ├── public/             # 静态资源
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   ├── pages/          # 页面组件
│   │   ├── contexts/       # React Context
│   │   ├── services/       # API服务
│   │   └── styles/         # 样式文件
│   └── package.json
├── server/                 # Node.js后端API
│   ├── config/             # 配置文件
│   ├── middleware/         # 中间件
│   ├── routes/             # API路由
│   ├── models/             # 数据模型
│   └── package.json
├── database/               # 数据库相关
│   └── schema.sql          # 数据库结构
├── .github/workflows/      # GitHub Actions
├── netlify.toml           # Netlify配置
└── README.md
```

## 🛠️ 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- PostgreSQL 数据库

### 1. 克隆项目
```bash
git clone https://github.com/your-username/ai-workplace-genie.git
cd ai-workplace-genie
```

### 2. 安装依赖

**前端依赖**
```bash
cd client
npm install
```

**后端依赖**
```bash
cd server
npm install
```

### 3. 环境配置

**后端环境变量** (server/.env)
```env
# 数据库配置
DATABASE_URL=your_postgresql_connection_string
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 服务器配置
PORT=5000
NODE_ENV=development

# 第三方服务
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

**前端环境变量** (client/.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 数据库初始化
```bash
# 在PostgreSQL中执行数据库结构文件
psql -d your_database -f database/schema.sql
```

### 5. 启动开发服务器

**启动后端服务**
```bash
cd server
npm run dev
```

**启动前端服务**
```bash
cd client
npm start
```

访问 http://localhost:3000 查看应用

## 📊 数据库设计

### 核心数据表

#### users (用户表)
- `id` - 用户唯一标识
- `email` - 邮箱地址
- `username` - 用户名
- `avatar_url` - 头像链接
- `created_at` - 创建时间

#### ai_employees (AI员工表)
- `id` - 员工唯一标识
- `name` - 员工姓名
- `category` - 职业类别
- `skills` - 技能标签
- `hourly_rate` - 时薪
- `rating` - 平均评分

#### hiring_records (聘用记录表)
- `id` - 记录唯一标识
- `user_id` - 用户ID
- `employee_id` - 员工ID
- `status` - 聘用状态
- `start_date` - 开始日期
- `end_date` - 结束日期

#### reviews (评价表)
- `id` - 评价唯一标识
- `user_id` - 评价用户ID
- `employee_id` - 被评价员工ID
- `rating` - 评分
- `comment` - 评价内容

## 🚀 部署指南

### Netlify部署 (前端)

1. **连接GitHub仓库**
   - 登录Netlify控制台
   - 选择"New site from Git"
   - 连接GitHub仓库

2. **配置构建设置**
   ```
   Build command: npm run build
   Publish directory: client/build
   Base directory: client
   ```

3. **设置环境变量**
   ```
   REACT_APP_API_URL=https://your-api-domain.herokuapp.com/api
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Heroku部署 (后端)

1. **创建Heroku应用**
   ```bash
   heroku create ai-workplace-api
   ```

2. **配置环境变量**
   ```bash
   heroku config:set DATABASE_URL=your_postgresql_url
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```

3. **部署应用**
   ```bash
   git subtree push --prefix server heroku main
   ```

### 自动化部署

项目已配置GitHub Actions自动化部署流程：
- **代码推送到main分支** → 自动部署到生产环境
- **代码推送到develop分支** → 自动部署到测试环境
- **创建Pull Request** → 自动运行测试和代码检查

## 🧪 测试

### 运行测试
```bash
# 前端测试
cd client
npm test

# 后端测试
cd server
npm test

# 测试覆盖率
npm run test:coverage
```

### 端到端测试
```bash
# 使用Cypress进行E2E测试
npm run test:e2e
```

## 📈 性能优化

### 前端优化
- **代码分割** - React.lazy()动态导入
- **图片优化** - WebP格式，懒加载
- **缓存策略** - Service Worker缓存
- **Bundle分析** - webpack-bundle-analyzer

### 后端优化
- **数据库索引** - 关键字段建立索引
- **API缓存** - Redis缓存热点数据
- **压缩响应** - Gzip压缩
- **连接池** - 数据库连接池管理

## 🔒 安全措施

### 前端安全
- **XSS防护** - 输入验证和输出编码
- **CSRF防护** - CSRF Token验证
- **内容安全策略** - CSP头部设置

### 后端安全
- **身份认证** - JWT Token认证
- **权限控制** - 基于角色的访问控制
- **数据加密** - 敏感数据加密存储
- **API限流** - 防止API滥用

## 🤝 贡献指南

### 开发流程
1. Fork项目仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

### 代码规范
- **ESLint** - JavaScript代码检查
- **Prettier** - 代码格式化
- **Husky** - Git hooks
- **Conventional Commits** - 提交信息规范

## 📝 API文档

### 认证接口
```
POST /api/auth/login      # 用户登录
POST /api/auth/register   # 用户注册
GET  /api/auth/me         # 获取当前用户
POST /api/auth/logout     # 用户登出
```

### AI员工接口
```
GET    /api/ai-employees           # 获取员工列表
GET    /api/ai-employees/:id       # 获取员工详情
POST   /api/ai-employees/search    # 搜索员工
GET    /api/ai-employees/popular   # 热门员工
```

### 聘用接口
```
POST   /api/hiring                 # 创建聘用
GET    /api/hiring/user/:userId    # 用户聘用记录
PUT    /api/hiring/:id/status      # 更新聘用状态
DELETE /api/hiring/:id             # 取消聘用
```

## 📊 监控和分析

### 性能监控
- **Lighthouse** - 性能评分
- **Web Vitals** - 核心性能指标
- **Error Tracking** - 错误监控

### 用户分析
- **Google Analytics** - 用户行为分析
- **Hotjar** - 用户体验分析
- **A/B Testing** - 功能测试

## 🆘 故障排除

### 常见问题

**Q: 前端无法连接后端API**
A: 检查环境变量REACT_APP_API_URL是否正确设置

**Q: 数据库连接失败**
A: 确认DATABASE_URL格式正确，数据库服务正常运行

**Q: JWT Token过期**
A: 检查JWT_EXPIRES_IN配置，实现Token自动刷新机制

**Q: 部署后样式丢失**
A: 检查静态资源路径，确认build产物正确生成

## 📞 联系我们

- **项目维护者**: [Your Name](mailto:your.email@example.com)
- **问题反馈**: [GitHub Issues](https://github.com/your-username/ai-workplace-genie/issues)
- **功能建议**: [GitHub Discussions](https://github.com/your-username/ai-workplace-genie/discussions)

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

感谢以下开源项目和服务：
- [React](https://reactjs.org/) - 前端框架
- [Node.js](https://nodejs.org/) - 后端运行时
- [Supabase](https://supabase.com/) - 数据库服务
- [Netlify](https://netlify.com/) - 前端部署
- [Heroku](https://heroku.com/) - 后端部署

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！

🚀 **AI职场精灵 - 让招聘更智能，让工作更高效！**