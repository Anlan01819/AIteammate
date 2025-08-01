const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取用户收藏列表
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        *,
        ai_employees(
          id,
          name,
          category,
          avatar_url,
          hourly_rate,
          monthly_rate,
          rating,
          total_reviews
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取收藏列表失败:', error);
      return res.status(500).json({ error: '获取收藏列表失败' });
    }

    res.json({ favorites: favorites || [] });
  } catch (error) {
    console.error('获取收藏列表错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 添加收藏
router.post('/favorites', authenticateToken, [
  body('ai_employee_id').isInt({ min: 1 }).withMessage('AI员工ID必须是正整数')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ai_employee_id } = req.body;

    // 检查是否已经收藏
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('ai_employee_id', ai_employee_id)
      .single();

    if (existingFavorite) {
      return res.status(400).json({ error: '已经收藏过该AI员工' });
    }

    // 验证AI员工是否存在
    const { data: aiEmployee, error: employeeError } = await supabase
      .from('ai_employees')
      .select('id')
      .eq('id', ai_employee_id)
      .single();

    if (employeeError || !aiEmployee) {
      return res.status(404).json({ error: 'AI员工不存在' });
    }

    // 添加收藏
    const { data: newFavorite, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: req.user.id,
        ai_employee_id
      }])
      .select(`
        *,
        ai_employees(
          id,
          name,
          category,
          avatar_url,
          hourly_rate,
          monthly_rate,
          rating,
          total_reviews
        )
      `)
      .single();

    if (error) {
      console.error('添加收藏失败:', error);
      return res.status(500).json({ error: '添加收藏失败' });
    }

    res.status(201).json({
      message: '收藏成功',
      favorite: newFavorite
    });
  } catch (error) {
    console.error('添加收藏错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 取消收藏
router.delete('/favorites/:aiEmployeeId', authenticateToken, async (req, res) => {
  try {
    const { aiEmployeeId } = req.params;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', req.user.id)
      .eq('ai_employee_id', aiEmployeeId);

    if (error) {
      console.error('取消收藏失败:', error);
      return res.status(500).json({ error: '取消收藏失败' });
    }

    res.json({ message: '取消收藏成功' });
  } catch (error) {
    console.error('取消收藏错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 更新用户资料
router.put('/profile', authenticateToken, [
  body('username').optional().isLength({ min: 2 }).withMessage('用户名至少需要2位字符'),
  body('phone').optional().isMobilePhone('zh-CN').withMessage('请输入有效的手机号码'),
  body('avatar_url').optional().isURL().withMessage('头像URL格式不正确')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, phone, avatar_url } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (phone) updateData.phone = phone;
    if (avatar_url) updateData.avatar_url = avatar_url;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: '没有提供要更新的数据' });
    }

    updateData.updated_at = new Date().toISOString();

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.user.id)
      .select('id, email, username, phone, avatar_url, role, created_at, updated_at')
      .single();

    if (error) {
      console.error('更新用户资料失败:', error);
      return res.status(500).json({ error: '更新用户资料失败' });
    }

    res.json({
      message: '用户资料更新成功',
      user: updatedUser
    });
  } catch (error) {
    console.error('更新用户资料错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 修改密码
router.put('/password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('当前密码不能为空'),
  body('newPassword').isLength({ min: 6 }).withMessage('新密码至少需要6位字符')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    // 验证当前密码
    const isValidPassword = await bcrypt.compare(currentPassword, req.user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ error: '当前密码不正确' });
    }

    // 加密新密码
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // 更新密码
    const { error } = await supabase
      .from('users')
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.id);

    if (error) {
      console.error('修改密码失败:', error);
      return res.status(500).json({ error: '修改密码失败' });
    }

    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取用户仪表板数据
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // 获取最近的聘用记录
    const { data: recentHires } = await supabase
      .from('hiring_records')
      .select(`
        *,
        ai_employees(name, category, avatar_url)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // 获取收藏的AI员工
    const { data: favoriteEmployees } = await supabase
      .from('favorites')
      .select(`
        ai_employees(
          id,
          name,
          category,
          avatar_url,
          rating
        )
      `)
      .eq('user_id', req.user.id)
      .limit(6);

    // 获取待评价的聘用记录
    const { data: pendingReviews } = await supabase
      .from('hiring_records')
      .select(`
        id,
        ai_employees(name, category, avatar_url)
      `)
      .eq('user_id', req.user.id)
      .eq('status', 'completed')
      .not('id', 'in', `(${
        (await supabase
          .from('reviews')
          .select('hiring_record_id')
          .eq('user_id', req.user.id)
        ).data?.map(r => r.hiring_record_id).join(',') || '0'
      })`)
      .limit(3);

    res.json({
      dashboard: {
        recentHires: recentHires || [],
        favoriteEmployees: favoriteEmployees?.map(f => f.ai_employees) || [],
        pendingReviews: pendingReviews || []
      }
    });
  } catch (error) {
    console.error('获取仪表板数据错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;