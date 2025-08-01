const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const aiEmployeeRoutes = require('./routes/aiEmployees');
const hiringRoutes = require('./routes/hiring');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: '请求过于频繁，请稍后再试'
});
app.use(limiter);

// 解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/ai-employees', aiEmployeeRoutes);
app.use('/api/hiring', hiringRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI职场精灵服务运行正常' });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AI职场精灵服务器运行在端口 ${PORT}`);
});

module.exports = app;