import { supabase } from './supabase';

// AI员工相关API
export const aiEmployeeAPI = {
  // 获取AI员工列表
  getEmployees: async (params) => {
    let query = supabase.from('ai_employees').select(`
      *,
      skills:ai_employee_skills(
        skill_id,
        proficiency,
        skills(id, name, category)
      )
    `);
    
    // 应用筛选条件
    if (params?.category) {
      query = query.eq('category', params.category);
    }
    
    if (params?.minPrice !== undefined) {
      query = query.gte('hourly_rate', params.minPrice);
    }
    
    if (params?.maxPrice !== undefined) {
      query = query.lte('hourly_rate', params.maxPrice);
    }
    
    if (params?.skills && params.skills.length > 0) {
      // 这里需要使用子查询来筛选具有特定技能的AI员工
      const skillIds = params.skills;
      query = query.filter('skills.skill_id', 'in', skillIds);
    }
    
    // 排序
    if (params?.sortBy) {
      const order = params.sortOrder === 'desc' ? true : false;
      query = query.order(params.sortBy, { ascending: !order });
    } else {
      query = query.order('rating', { ascending: false });
    }
    
    // 分页
    if (params?.page && params?.pageSize) {
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('获取AI员工列表失败:', error);
      throw error;
    }
    
    return { data, count };
  },
  
  // 获取AI员工详情
  getEmployeeById: async (id) => {
    const { data, error } = await supabase
      .from('ai_employees')
      .select(`
        *,
        skills:ai_employee_skills(
          skill_id,
          proficiency,
          skills(id, name, category)
        ),
        portfolio:portfolio_items(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`获取AI员工(ID: ${id})详情失败:`, error);
      throw error;
    }
    
    return data;
  },
  
  // 搜索AI员工
  searchEmployees: async (query, filters) => {
    let dbQuery = supabase
      .from('ai_employees')
      .select(`
        *,
        skills:ai_employee_skills(
          skill_id,
          proficiency,
          skills(id, name, category)
        )
      `);
    
    // 全文搜索
    if (query) {
      dbQuery = dbQuery.textSearch('name', query, {
        type: 'websearch',
        config: 'english'
      });
    }
    
    // 应用筛选条件
    if (filters) {
      if (filters.category) {
        dbQuery = dbQuery.eq('category', filters.category);
      }
      
      if (filters.minPrice !== undefined) {
        dbQuery = dbQuery.gte('hourly_rate', filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        dbQuery = dbQuery.lte('hourly_rate', filters.maxPrice);
      }
      
      if (filters.minRating !== undefined) {
        dbQuery = dbQuery.gte('rating', filters.minRating);
      }
    }
    
    const { data, error } = await dbQuery;
    
    if (error) {
      console.error('搜索AI员工失败:', error);
      throw error;
    }
    
    return data;
  },
  
  // 获取推荐AI员工
  getRecommendedEmployees: async (userId) => {
    // 基于用户历史聘用记录推荐
    const { data: userHirings, error: hiringsError } = await supabase
      .from('hiring_records')
      .select('ai_employee_id')
      .eq('user_id', userId)
      .limit(5);
    
    if (hiringsError) {
      console.error('获取用户聘用记录失败:', hiringsError);
      throw hiringsError;
    }
    
    // 如果用户有聘用记录，推荐类似的AI员工
    if (userHirings && userHirings.length > 0) {
      const hiredEmployeeIds = userHirings.map(h => h.ai_employee_id);
      
      // 获取用户聘用过的AI员工的技能
      const { data: employeeSkills, error: skillsError } = await supabase
        .from('ai_employee_skills')
        .select('skill_id')
        .in('ai_employee_id', hiredEmployeeIds);
      
      if (skillsError) {
        console.error('获取AI员工技能失败:', skillsError);
        throw skillsError;
      }
      
      const skillIds = [...new Set(employeeSkills.map(s => s.skill_id))];
      
      // 查找具有类似技能的其他AI员工
      const { data: recommendedEmployees, error: recError } = await supabase
        .from('ai_employees')
        .select(`
          *,
          skills:ai_employee_skills(
            skill_id,
            proficiency,
            skills(id, name, category)
          )
        `)
        .not('id', 'in', hiredEmployeeIds)
        .order('rating', { ascending: false })
        .limit(10);
      
      if (recError) {
        console.error('获取推荐AI员工失败:', recError);
        throw recError;
      }
      
      return recommendedEmployees;
    } else {
      // 如果用户没有聘用记录，推荐评分高的AI员工
      const { data: popularEmployees, error: popError } = await supabase
        .from('ai_employees')
        .select(`
          *,
          skills:ai_employee_skills(
            skill_id,
            proficiency,
            skills(id, name, category)
          )
        `)
        .order('rating', { ascending: false })
        .limit(10);
      
      if (popError) {
        console.error('获取热门AI员工失败:', popError);
        throw popError;
      }
      
      return popularEmployees;
    }
  },
  
  // 获取热门AI员工
  getPopularEmployees: async () => {
    const { data, error } = await supabase
      .from('ai_employees')
      .select(`
        *,
        skills:ai_employee_skills(
          skill_id,
          proficiency,
          skills(id, name, category)
        )
      `)
      .order('rating', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('获取热门AI员工失败:', error);
      throw error;
    }
    
    return data;
  },
  
  // 获取AI员工技能列表
  getSkills: async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('获取技能列表失败:', error);
      throw error;
    }
    
    return data;
  },
  
  // 获取AI员工分类
  getCategories: async () => {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('获取技能分类失败:', error);
      throw error;
    }
    
    return data;
  },
};

// 聘用相关API
export const hiringAPI = {
  // 创建聘用记录
  createHiring: async (hiringData) => {
    const { data, error } = await supabase
      .from('hiring_records')
      .insert([{
        user_id: hiringData.userId,
        ai_employee_id: hiringData.aiEmployeeId,
        project_title: hiringData.projectTitle,
        project_description: hiringData.projectDescription,
        requirements: hiringData.requirements,
        budget: hiringData.budget,
        start_date: hiringData.startDate,
        end_date: hiringData.endDate,
        status: 'pending'
      }])
      .select();
    
    if (error) {
      console.error('创建聘用记录失败:', error);
      throw error;
    }
    
    return data[0];
  },
  
  // 获取用户聘用记录
  getUserHirings: async (userId, params) => {
    let query = supabase
      .from('hiring_records')
      .select(`
        *,
        ai_employee:ai_employees(id, name, avatar_url, hourly_rate)
      `)
      .eq('user_id', userId);
    
    // 筛选状态
    if (params?.status) {
      query = query.eq('status', params.status);
    }
    
    // 排序
    if (params?.sortBy) {
      const order = params.sortOrder === 'desc' ? true : false;
      query = query.order(params.sortBy, { ascending: !order });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // 分页
    if (params?.page && params?.pageSize) {
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('获取用户聘用记录失败:', error);
      throw error;
    }
    
    return { data, count };
  },
  
  // 获取聘用记录详情
  getHiringById: async (id) => {
    const { data, error } = await supabase
      .from('hiring_records')
      .select(`
        *,
        ai_employee:ai_employees(
          id, 
          name, 
          avatar_url, 
          hourly_rate,
          description,
          skills:ai_employee_skills(
            skill_id,
            proficiency,
            skills(id, name, category)
          )
        ),
        user:users(id, username, avatar_url)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`获取聘用记录(ID: ${id})详情失败:`, error);
      throw error;
    }
    
    return data;
  },
  
  // 更新聘用状态
  updateHiringStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('hiring_records')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`更新聘用记录(ID: ${id})状态失败:`, error);
      throw error;
    }
    
    return data[0];
  },
  
  // 取消聘用
  cancelHiring: async (id, reason) => {
    const { data, error } = await supabase
      .from('hiring_records')
      .update({ 
        status: 'cancelled', 
        cancellation_reason: reason,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`取消聘用记录(ID: ${id})失败:`, error);
      throw error;
    }
    
    return data[0];
  },
  
  // 完成聘用
  completeHiring: async (id, completionData) => {
    const { data, error } = await supabase
      .from('hiring_records')
      .update({ 
        status: 'completed', 
        completion_notes: completionData.notes,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`完成聘用记录(ID: ${id})失败:`, error);
      throw error;
    }
    
    // 如果有评价，创建评价记录
    if (completionData.rating) {
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert([{
          user_id: completionData.userId,
          ai_employee_id: completionData.aiEmployeeId,
          hiring_id: id,
          rating: completionData.rating,
          comment: completionData.review,
          created_at: new Date()
        }]);
      
      if (reviewError) {
        console.error('创建评价失败:', reviewError);
        throw reviewError;
      }
    }
    
    return data[0];
  },
  
  // 获取聘用统计
  getHiringStats: async (userId) => {
    // 获取用户总聘用次数
    const { count: totalCount, error: countError } = await supabase
      .from('hiring_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (countError) {
      console.error('获取聘用总数失败:', countError);
      throw countError;
    }
    
    // 获取各状态聘用数量
    const statuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    const statusCounts = {};
    
    for (const status of statuses) {
      const { count, error } = await supabase
        .from('hiring_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', status);
      
      if (error) {
        console.error(`获取${status}状态聘用数量失败:`, error);
        throw error;
      }
      
      statusCounts[status] = count;
    }
    
    // 获取总支出
    const { data: completedHirings, error: hiringsError } = await supabase
      .from('hiring_records')
      .select('budget')
      .eq('user_id', userId)
      .eq('status', 'completed');
    
    if (hiringsError) {
      console.error('获取已完成聘用记录失败:', hiringsError);
      throw hiringsError;
    }
    
    const totalSpent = completedHirings.reduce((sum, hiring) => sum + hiring.budget, 0);
    
    return {
      totalHirings: totalCount,
      pending: statusCounts.pending,
      inProgress: statusCounts.in_progress,
      completed: statusCounts.completed,
      cancelled: statusCounts.cancelled,
      totalSpent
    };
  },
};

// 评价相关API
export const reviewAPI = {
  // 创建评价
  createReview: async (reviewData) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        user_id: reviewData.userId,
        ai_employee_id: reviewData.aiEmployeeId,
        hiring_id: reviewData.hiringId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        created_at: new Date()
      }])
      .select();
    
    if (error) {
      console.error('创建评价失败:', error);
      throw error;
    }
    
    return data[0];
  },
  
  // 获取AI员工评价
  getEmployeeReviews: async (employeeId, params) => {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:users(id, username, avatar_url)
      `)
      .eq('ai_employee_id', employeeId);
    
    // 排序
    if (params?.sortBy) {
      const order = params.sortOrder === 'desc' ? true : false;
      query = query.order(params.sortBy, { ascending: !order });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // 分页
    if (params?.page && params?.pageSize) {
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error(`获取AI员工(ID: ${employeeId})评价失败:`, error);
      throw error;
    }
    
    return { data, count };
  },
  
  // 获取用户评价
  getUserReviews: async (userId, params) => {
    let query = supabase
      .from('reviews')
      .select(`
        *,
        ai_employee:ai_employees(id, name, avatar_url)
      `)
      .eq('user_id', userId);
    
    // 排序
    if (params?.sortBy) {
      const order = params.sortOrder === 'desc' ? true : false;
      query = query.order(params.sortBy, { ascending: !order });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // 分页
    if (params?.page && params?.pageSize) {
      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;
      query = query.range(from, to);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error(`获取用户(ID: ${userId})评价失败:`, error);
      throw error;
    }
    
    return { data, count };
  },
  
  // 更新评价
  updateReview: async (id, reviewData) => {
    const { data, error } = await supabase
      .from('reviews')
      .update({
        rating: reviewData.rating,
        comment: reviewData.comment,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`更新评价(ID: ${id})失败:`, error);
      throw error;
    }
    
    return data[0];
  },
  
  // 删除评价
  deleteReview: async (id) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`删除评价(ID: ${id})失败:`, error);
      throw error;
    }
    
    return { success: true };
  },
};

// 用户相关API
export const userAPI = {
  // 获取用户信息
  getUserById: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`获取用户(ID: ${id})信息失败:`, error);
      throw error;
    }
    
    return data;
  },
  
  // 更新用户信息
  updateUser: async (id, userData) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        username: userData.username,
        phone: userData.phone,
        updated_at: new Date()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`更新用户(ID: ${id})信息失败:`, error);
      throw error;
    }
    
    return data[0];
  },
  
  // 上传头像
  uploadAvatar: async (file) => {
    const user = supabase.auth.user();
    if (!user) throw new Error('未登录');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('user-avatars')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('上传头像失败:', uploadError);
      throw uploadError;
    }
    
    const { data: urlData } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filePath);
    
    const avatarUrl = urlData.publicUrl;
    
    // 更新用户头像URL
    const { data, error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id)
      .select();
    
    if (updateError) {
      console.error('更新用户头像URL失败:', updateError);
      throw updateError;
    }
    
    return { avatarUrl, user: data[0] };
  },
  
  // 获取用户收藏
  getUserFavorites: async (userId) => {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        ai_employee:ai_employees(
          id, 
          name, 
          avatar_url, 
          hourly_rate,
          description,
          rating,
          skills:ai_employee_skills(
            skill_id,
            proficiency,
            skills(id, name, category)
          )
        )
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error(`获取用户(ID: ${userId})收藏失败:`, error);
      throw error;
    }
    
    return data.map(fav => fav.ai_employee);
  },
  
  // 添加收藏
  addFavorite: async (userId, employeeId) => {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: userId,
        ai_employee_id: employeeId,
        created_at: new Date()
      }])
      .select();
    
    if (error) {
      console.error('添加收藏失败:', error);
      throw error;
    }
    
    return data[0];
  },
  
  // 取消收藏
  removeFavorite: async (userId, employeeId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('ai_employee_id', employeeId);
    
    if (error) {
      console.error('取消收藏失败:', error);
      throw error;
    }
    
    return { success: true };
  },
  
  // 检查是否收藏
  checkFavorite: async (userId, employeeId) => {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('ai_employee_id', employeeId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116是未找到记录的错误
      console.error('检查收藏状态失败:', error);
      throw error;
    }
    
    return { isFavorite: !!data };
  },
};

// 认证相关API
export const authAPI = {
  // 当前用户
  getCurrentUser: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('获取当前用户信息失败:', error);
      throw error;
    }
    
    return data;
  },
  
  // 登录
  login: async (credentials) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    
    if (error) {
      console.error('登录失败:', error);
      throw error;
    }
    
    return data;
  },
  
  // 注册
  register: async (userData) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username
        }
      }
    });
    
    if (error) {
      console.error('注册失败:', error);
      throw error;
    }
    
    // 创建用户记录
    if (data.user) {
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          email: userData.email,
          username: userData.username,
          password_hash: '已通过Supabase Auth验证',
          phone: userData.phone || null,
          avatar_url: userData.avatar_url || null
        }]);
      
      if (userError) {
        console.error('创建用户记录失败:', userError);
        throw userError;
      }
    }
    
    return data;
  },
  
  // 登出
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('登出失败:', error);
      throw error;
    }
    
    return { success: true };
  },
  
  // 修改密码
  changePassword: async (passwordData) => {
    const { data, error } = await supabase.auth.updateUser({
      password: passwordData.newPassword
    });
    
    if (error) {
      console.error('修改密码失败:', error);
      throw error;
    }
    
    return { success: true };
  },
  
  // 忘记密码
  forgotPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) {
      console.error('发送重置密码邮件失败:', error);
      throw error;
    }
    
    return { success: true };
  },
};

// 统计相关API
export const statsAPI = {
  // 获取平台统计
  getPlatformStats: async () => {
    // 获取AI员工总数
    const { count: employeeCount, error: empError } = await supabase
      .from('ai_employees')
      .select('*', { count: 'exact', head: true });
    
    if (empError) {
      console.error('获取AI员工总数失败:', empError);
      throw empError;
    }
    
    // 获取用户总数
    const { count: userCount, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (userError) {
      console.error('获取用户总数失败:', userError);
      throw userError;
    }
    
    // 获取聘用总数
    const { count: hiringCount, error: hiringError } = await supabase
      .from('hiring_records')
      .select('*', { count: 'exact', head: true });
    
    if (hiringError) {
      console.error('获取聘用总数失败:', hiringError);
      throw hiringError;
    }
    
    // 获取已完成聘用总数
    const { count: completedCount, error: compError } = await supabase
      .from('hiring_records')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');
    
    if (compError) {
      console.error('获取已完成聘用总数失败:', compError);
      throw compError;
    }
    
    return {
      totalEmployees: employeeCount,
      totalUsers: userCount,
      totalHirings: hiringCount,
      completedHirings: completedCount
    };
  },
};

// 导出默认API实例
export default {
  aiEmployeeAPI,
  hiringAPI,
  reviewAPI,
  userAPI,
  authAPI,
  statsAPI
};