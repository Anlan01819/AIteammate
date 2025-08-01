const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { supabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 创建评价
router.post('/', authenticateToken, [
  body('ai_employee_id').isInt({ min: 1 }).withMessage('AI员工ID必须是正整数'),
  body('hiring_record_id').isInt({ min: 1 }).withMessage('聘用记录ID必须是正整数'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('评分必须是1-5之间的整数'),
  body('comment').optional().isString().withMessage('评价内容必须是字符串')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ai_employee_id, hiring_record_id, rating, comment } = req.body;

    // 验证聘用记录是否属于当前用户且已完成
    const { data: hiringRecord, error: recordError } = await supabase
      .from('hiring_records')
      .select('*')
      .eq('id', hiring_record_id)
      .eq('user_id', req.user.id)
      .eq('ai_employee_id', ai_employee_id)
      .eq('status', 'completed')
      .single();

    if (recordError || !hiringRecord) {
      return res.status(400).json({ error: '无效的聘用记录或记录未完成' });
    }

    // 检查是否已经评价过
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('hiring_record_id', hiring_record_id)
      .single();

    if (existingReview) {
      return res.status(400).json({ error: '该聘用记录已经评价过了' });
    }

    // 创建评价
    const { data: newReview, error } = await supabase
      .from('reviews')
      .insert([{
        user_id: req.user.id,
        ai_employee_id,
        hiring_record_id,
        rating,
        comment
      }])
      .select(`
        *,
        users(username, avatar_url),
        ai_employees(name, category)
      `)
      .single();

    if (error) {
      console.error('创建评价失败:', error);
      return res.status(500).json({ error: '创建评价失败' });
    }

    // 更新AI员工的平均评分和评价总数
    await updateEmployeeRating(ai_employee_id);

    res.status(201).json({
      message: '评价创建成功',
      review: newReview
    });
  } catch (error) {
    console.error('创建评价错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取AI员工的评价列表
router.get('/employee/:employeeId', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { employeeId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users(username, avatar_url)
      `)
      .eq('ai_employee_id', employeeId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('获取评价列表失败:', error);
      return res.status(500).json({ error: '获取评价列表失败' });
    }

    // 获取总数
    const { count: totalCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('ai_employee_id', employeeId);

    // 获取评分统计
    const { data: ratingStats } = await supabase
      .from('reviews')
      .select('rating')
      .eq('ai_employee_id', employeeId);

    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    ratingStats?.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    const averageRating = ratingStats?.length > 0 
      ? ratingStats.reduce((sum, review) => sum + review.rating, 0) / ratingStats.length 
      : 0;

    res.json({
      reviews: reviews || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      },
      statistics: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: totalCount || 0,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('获取评价列表错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取用户的评价记录
router.get('/my-reviews', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        ai_employees(name, category, avatar_url),
        hiring_records(hire_type, rate)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('获取用户评价记录失败:', error);
      return res.status(500).json({ error: '获取评价记录失败' });
    }

    // 获取总数
    const { count: totalCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    res.json({
      reviews: reviews || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }
    });
  } catch (error) {
    console.error('获取用户评价记录错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 更新评价
router.put('/:id', authenticateToken, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('评分必须是1-5之间的整数'),
  body('comment').optional().isString().withMessage('评价内容必须是字符串')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    // 验证评价是否属于当前用户
    const { data: existingReview, error: reviewError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (reviewError || !existingReview) {
      return res.status(404).json({ error: '评价不存在' });
    }

    // 更新评价
    const { data: updatedReview, error } = await supabase
      .from('reviews')
      .update({
        rating,
        comment,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        users(username, avatar_url),
        ai_employees(name, category)
      `)
      .single();

    if (error) {
      console.error('更新评价失败:', error);
      return res.status(500).json({ error: '更新评价失败' });
    }

    // 重新计算AI员工的平均评分
    await updateEmployeeRating(existingReview.ai_employee_id);

    res.json({
      message: '评价更新成功',
      review: updatedReview
    });
  } catch (error) {
    console.error('更新评价错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 删除评价
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 验证评价是否属于当前用户
    const { data: existingReview, error: reviewError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (reviewError || !existingReview) {
      return res.status(404).json({ error: '评价不存在' });
    }

    // 删除评价
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除评价失败:', error);
      return res.status(500).json({ error: '删除评价失败' });
    }

    // 重新计算AI员工的平均评分
    await updateEmployeeRating(existingReview.ai_employee_id);

    res.json({ message: '评价删除成功' });
  } catch (error) {
    console.error('删除评价错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 辅助函数：更新AI员工的评分统计
async function updateEmployeeRating(aiEmployeeId) {
  try {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('ai_employee_id', aiEmployeeId);

    if (reviews && reviews.length > 0) {
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      
      await supabase
        .from('ai_employees')
        .update({
          rating: Math.round(averageRating * 100) / 100,
          total_reviews: reviews.length
        })
        .eq('id', aiEmployeeId);
    } else {
      await supabase
        .from('ai_employees')
        .update({
          rating: 0,
          total_reviews: 0
        })
        .eq('id', aiEmployeeId);
    }
  } catch (error) {
    console.error('更新员工评分失败:', error);
  }
}

module.exports = router;