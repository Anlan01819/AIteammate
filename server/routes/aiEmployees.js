const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { supabase } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 获取AI员工列表（支持筛选和分页）
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('页码必须是正整数'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('每页数量必须在1-50之间'),
  query('category').optional().isString().withMessage('分类必须是字符串'),
  query('minRate').optional().isFloat({ min: 0 }).withMessage('最低价格必须是非负数'),
  query('maxRate').optional().isFloat({ min: 0 }).withMessage('最高价格必须是非负数'),
  query('skills').optional().isString().withMessage('技能筛选必须是字符串'),
  query('search').optional().isString().withMessage('搜索关键词必须是字符串')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 12,
      category,
      minRate,
      maxRate,
      skills,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;

    // 构建查询
    let query = supabase
      .from('ai_employees')
      .select(`
        *,
        ai_employee_skills!inner(
          skills(name, category)
        ),
        work_samples(id, title, image_url),
        specialties(task_name)
      `);

    // 应用筛选条件
    if (category) {
      query = query.eq('category', category);
    }

    if (minRate) {
      query = query.gte('hourly_rate', minRate);
    }

    if (maxRate) {
      query = query.lte('hourly_rate', maxRate);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // 排序和分页
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    const { data: employees, error, count } = await query;

    if (error) {
      console.error('获取AI员工列表失败:', error);
      return res.status(500).json({ error: '获取员工列表失败' });
    }

    // 获取总数
    const { count: totalCount } = await supabase
      .from('ai_employees')
      .select('*', { count: 'exact', head: true });

    res.json({
      employees: employees || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }
    });
  } catch (error) {
    console.error('获取AI员工列表错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取单个AI员工详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: employee, error } = await supabase
      .from('ai_employees')
      .select(`
        *,
        ai_employee_skills(
          skills(name, category)
        ),
        work_samples(*),
        specialties(*),
        reviews(
          id,
          rating,
          comment,
          created_at,
          users(username, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !employee) {
      return res.status(404).json({ error: 'AI员工不存在' });
    }

    res.json({ employee });
  } catch (error) {
    console.error('获取AI员工详情错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 创建AI员工（管理员权限）
router.post('/', authenticateToken, requireAdmin, [
  body('name').notEmpty().withMessage('员工姓名不能为空'),
  body('category').notEmpty().withMessage('员工分类不能为空'),
  body('employee_id').notEmpty().withMessage('员工编号不能为空'),
  body('hourly_rate').isFloat({ min: 0 }).withMessage('时薪必须是非负数'),
  body('monthly_rate').isFloat({ min: 0 }).withMessage('月薪必须是非负数'),
  body('description').optional().isString().withMessage('描述必须是字符串')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      category,
      employee_id,
      avatar_url,
      description,
      hourly_rate,
      monthly_rate,
      voice_intro_url,
      skills = [],
      specialties = [],
      work_samples = []
    } = req.body;

    // 检查员工编号是否已存在
    const { data: existingEmployee } = await supabase
      .from('ai_employees')
      .select('id')
      .eq('employee_id', employee_id)
      .single();

    if (existingEmployee) {
      return res.status(400).json({ error: '员工编号已存在' });
    }

    // 创建AI员工
    const { data: newEmployee, error } = await supabase
      .from('ai_employees')
      .insert([{
        name,
        category,
        employee_id,
        avatar_url,
        description,
        hourly_rate,
        monthly_rate,
        voice_intro_url
      }])
      .select()
      .single();

    if (error) {
      console.error('创建AI员工失败:', error);
      return res.status(500).json({ error: '创建员工失败' });
    }

    // 添加技能关联
    if (skills.length > 0) {
      const skillRelations = skills.map(skillId => ({
        ai_employee_id: newEmployee.id,
        skill_id: skillId
      }));

      await supabase
        .from('ai_employee_skills')
        .insert(skillRelations);
    }

    // 添加擅长任务
    if (specialties.length > 0) {
      const specialtyData = specialties.map(specialty => ({
        ai_employee_id: newEmployee.id,
        task_name: specialty.task_name,
        description: specialty.description
      }));

      await supabase
        .from('specialties')
        .insert(specialtyData);
    }

    // 添加作品示例
    if (work_samples.length > 0) {
      const sampleData = work_samples.map(sample => ({
        ai_employee_id: newEmployee.id,
        title: sample.title,
        description: sample.description,
        image_url: sample.image_url,
        project_url: sample.project_url
      }));

      await supabase
        .from('work_samples')
        .insert(sampleData);
    }

    res.status(201).json({
      message: 'AI员工创建成功',
      employee: newEmployee
    });
  } catch (error) {
    console.error('创建AI员工错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取推荐AI员工
router.get('/featured/recommendations', async (req, res) => {
  try {
    const { data: employees, error } = await supabase
      .from('ai_employees')
      .select(`
        *,
        ai_employee_skills(
          skills(name)
        )
      `)
      .eq('status', 'available')
      .gte('rating', 4.0)
      .order('rating', { ascending: false })
      .limit(8);

    if (error) {
      console.error('获取推荐员工失败:', error);
      return res.status(500).json({ error: '获取推荐员工失败' });
    }

    res.json({ employees: employees || [] });
  } catch (error) {
    console.error('获取推荐员工错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;