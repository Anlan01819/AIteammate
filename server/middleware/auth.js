const jwt = require('jsonwebtoken');
const { supabase } = require('../config/database');

// JWT认证中间件
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 验证用户是否存在
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: '无效的访问令牌' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token验证失败:', error);
    return res.status(403).json({ error: '令牌验证失败' });
  }
};

// 管理员权限中间件
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
};

// HR权限中间件
const requireHR = (req, res, next) => {
  if (req.user.role !== 'hr' && req.user.role !== 'admin') {
    return res.status(403).json({ error: '需要HR或管理员权限' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireHR
};