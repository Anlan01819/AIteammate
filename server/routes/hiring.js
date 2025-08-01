const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { supabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 创建聘用记录
router.post('/', authenticateToken, [
  body('ai_employee_id').isInt({ min: 1 }).withMessage('AI员工ID必须是正整数'),
  body('hire_type').isIn(['hourly', 'monthly']).withMessage('聘用类型必须是hourly或monthly'),
  body('rate').isFloat({ min: 0 }).withMessage('费率必须是非负数'),
  body('start_date').isISO8601().withMessage('开始日期格式不正确'),
  body('task_description').optional().isString().withMessage('任务描述必须是字符串')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      ai_employee_id,
      hire_type,
      rate,
      start_date,
      end_date,
      task_description
    } = req.body;

    // 验证AI员工是否存在且可用
    const { data: aiEmployee, error: employeeError } = await supabase
      .from('ai_employees')
      .select('*')
      .eq('id', ai_employee_id)
      .eq('status', 'available')
      .single();

    if (employeeError || !aiEmployee) {
      return res.status(404).json({ error: 'AI员工不存在或不可用' });
    }

    // 创建聘用记录
    const { data: hiringRecord, error } = await supabase
      .from('hiring_records')
      .insert([{
        user_id: req.user.id,
        ai_employee_id,
        hire_type,
        rate,
        start_date,
        end_date: end_date || null,
        task_description,
        status: 'active'
      }])
      .select(`
        *,
        ai_employees(name, category, avatar_url),
        users(username, email)
      `)
      .single();

    if (error) {
      console.error('创建聘用记录失败:', error);
      return res.status(500).json({ error: '创建聘用记录失败' });
    }

    // 更新AI员工状态为忙碌
    await supabase
      .from('ai_employees')
      .update({ status: 'busy' })
      .eq('id', ai_employee_id);

    res.status(201).json({
      message: '聘用成功',
      hiring_record: hiringRecord
    });
  } catch (error) {
    console.error('创建聘用记录错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取用户的聘用记录
router.get('/my-records', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间'),
  query('status').optional().isIn(['active', 'completed', 'cancelled']).withMessage('状态值无效'),
  query('hire_type').optional().isIn(['hourly', 'monthly']).withMessage('聘用类型无效')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 10,
      status,
      hire_type,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;

    // 构建查询
    let query = supabase
      .from('hiring_records')
      .select(`
        *,
        ai_employees(
          id,
          name,
          category,
          avatar_url,
          employee_id
        )
      `)
      .eq('user_id', req.user.id);

    // 应用筛选条件
    if (status) {
      query = query.eq('status', status);
    }

    if (hire_type) {
      query = query.eq('hire_type', hire_type);
    }

    // 排序和分页
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    const { data: records, error } = await query;

    if (error) {
      console.error('获取聘用记录失败:', error);
      return res.status(500).json({ error: '获取聘用记录失败' });
    }

    // 获取总数
    const { count: totalCount } = await supabase
      .from('hiring_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    res.json({
      records: records || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }
    });
  } catch (error) {
    console.error('获取聘用记录错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取聘用统计信息
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    // 获取累计聘用次数
    const { count: totalHires } = await supabase
      .from('hiring_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    // 获取总支出
    const { data: costData } = await supabase
      .from('hiring_records')
      .select('total_cost')
      .eq('user_id', req.user.id);

    const totalCost = costData?.reduce((sum, record) => sum + (record.total_cost || 0), 0) || 0;

    // 获取当前在岗数量
    const { count: activeCount } = await supabase
      .from('hiring_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
      .eq('status', 'active');

    // 获取平均评分
    const { data: reviewData } = await supabase
      .from('reviews')
      .select('rating')
      .eq('user_id', req.user.id);

    const averageRating = reviewData?.length > 0 
      ? reviewData.reduce((sum, review) => sum + review.rating, 0) / reviewData.length 
      : 0;

    res.json({
      statistics: {
        totalHires: totalHires || 0,
        totalCost: totalCost,
        activeCount: activeCount || 0,
        averageRating: Math.round(averageRating * 10) / 10
      }
    });
  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 更新聘用记录状态
router.patch('/:id/status', authenticateToken, [
  body('status').isIn(['active', 'completed', 'cancelled']).withMessage('状态值无效'),
  body('total_cost').optional().isFloat({ min: 0 }).withMessage('总费用必须是非负数')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, total_cost } = req.body;

    // 验证聘用记录是否属于当前用户
    const { data: record, error: recordError } = await supabase
      .from('hiring_records')
      .select('*, ai_employees(id)')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (recordError || !record) {
      return res.status(404).json({ error: '聘用记录不存在' });
    }

    // 更新聘用记录
    const updateData = { status, updated_at: new Date().toISOString() };
    if (total_cost !== undefined) {
      updateData.total_cost = total_cost;
    }
    if (status === 'completed') {
      updateData.end_date = new Date().toISOString();
    }

    const { data: updatedRecord, error } = await supabase
      .from('hiring_records')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('更新聘用记录失败:', error);
      return res.status(500).json({ error: '更新聘用记录失败' });
    }

    // 如果状态变为完成或取消，更新AI员工状态为可用
    if (status === 'completed' || status === 'cancelled') {
      await supabase
        .from('ai_employees')
        .update({ status: 'available' })
        .eq('id', record.ai_employees.id);
    }

    res.json({
      message: '聘用记录状态更新成功',
      record: updatedRecord
    });
  } catch (error) {
    console.error('更新聘用记录状态错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取单个聘用记录详情
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: record, error } = await supabase
      .from('hiring_records')
      .select(`
        *,
        ai_employees(
          id,
          name,
          category,
          avatar_url,
          employee_id
        ),
        reviews(
          id,
          rating,
          comment,
          created_at
        )
      `)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !record) {
      return res.status(404).json({ error: '聘用记录不存在' });
    }

    res.json({ record });
  } catch (error) {
    console.error('获取聘用记录详情错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;