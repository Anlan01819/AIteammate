-- AI职场精灵数据库结构设计
-- 使用PostgreSQL

-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user', -- user, admin, hr
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI员工表
CREATE TABLE ai_employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- UI设计师, 数据分析师, 内容营销专家等
    employee_id VARCHAR(20) UNIQUE NOT NULL, -- 员工编号
    avatar_url VARCHAR(500),
    description TEXT,
    hourly_rate DECIMAL(10,2) NOT NULL,
    monthly_rate DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available', -- available, busy, offline
    voice_intro_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 技能表
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI员工技能关联表
CREATE TABLE ai_employee_skills (
    id SERIAL PRIMARY KEY,
    ai_employee_id INTEGER REFERENCES ai_employees(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER DEFAULT 5, -- 1-5级熟练度
    UNIQUE(ai_employee_id, skill_id)
);

-- 聘用记录表
CREATE TABLE hiring_records (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ai_employee_id INTEGER REFERENCES ai_employees(id) ON DELETE CASCADE,
    hire_type VARCHAR(20) NOT NULL, -- hourly, monthly
    rate DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    total_cost DECIMAL(10,2) DEFAULT 0.00,
    task_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户评价表
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ai_employee_id INTEGER REFERENCES ai_employees(id) ON DELETE CASCADE,
    hiring_record_id INTEGER REFERENCES hiring_records(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户收藏表
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ai_employee_id INTEGER REFERENCES ai_employees(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, ai_employee_id)
);

-- 作品示例表
CREATE TABLE work_samples (
    id SERIAL PRIMARY KEY,
    ai_employee_id INTEGER REFERENCES ai_employees(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    project_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 擅长任务表
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    ai_employee_id INTEGER REFERENCES ai_employees(id) ON DELETE CASCADE,
    task_name VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_ai_employees_category ON ai_employees(category);
CREATE INDEX idx_ai_employees_status ON ai_employees(status);
CREATE INDEX idx_hiring_records_user_id ON hiring_records(user_id);
CREATE INDEX idx_hiring_records_status ON hiring_records(status);
CREATE INDEX idx_reviews_ai_employee_id ON reviews(ai_employee_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- 添加行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;

-- 创建用户安全策略
CREATE POLICY "用户可以查看所有AI员工" ON ai_employees FOR SELECT USING (true);
CREATE POLICY "用户可以查看所有技能" ON skills FOR SELECT USING (true);
CREATE POLICY "用户可以查看所有AI员工技能" ON ai_employee_skills FOR SELECT USING (true);
CREATE POLICY "用户可以查看所有评价" ON reviews FOR SELECT USING (true);
CREATE POLICY "用户可以查看所有作品示例" ON work_samples FOR SELECT USING (true);
CREATE POLICY "用户可以查看所有擅长任务" ON specialties FOR SELECT USING (true);

-- 用户只能查看和修改自己的数据
CREATE POLICY "用户只能查看自己的数据" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "用户只能更新自己的数据" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "用户只能查看自己的聘用记录" ON hiring_records FOR SELECT USING (auth.uid()::uuid = user_id);
CREATE POLICY "用户只能创建自己的聘用记录" ON hiring_records FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "用户只能更新自己的聘用记录" ON hiring_records FOR UPDATE USING (auth.uid()::uuid = user_id);
CREATE POLICY "用户只能查看自己的收藏" ON favorites FOR SELECT USING (auth.uid()::uuid = user_id);
CREATE POLICY "用户只能创建自己的收藏" ON favorites FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "用户只能删除自己的收藏" ON favorites FOR DELETE USING (auth.uid()::uuid = user_id);
CREATE POLICY "用户只能创建自己的评价" ON reviews FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "用户只能更新自己的评价" ON reviews FOR UPDATE USING (auth.uid()::uuid = user_id);

-- 创建示例数据
INSERT INTO ai_employees (name, category, employee_id, avatar_url, description, hourly_rate, monthly_rate, status)
VALUES 
('AI设计师小美', 'UI设计师', 'UI001', '/avatars/designer1.jpg', '专业UI设计师，擅长移动应用界面设计，有5年经验', 99.00, 9999.00, 'available'),
('AI数据分析师小智', '数据分析师', 'DA001', '/avatars/analyst1.jpg', '资深数据分析师，擅长用户行为分析和商业智能', 129.00, 12999.00, 'available'),
('AI内容营销专家小文', '内容营销专家', 'CM001', '/avatars/marketer1.jpg', '内容创作和营销策略专家，擅长品牌故事和社媒运营', 89.00, 8999.00, 'available'),
('AI前端开发者小码', '前端开发者', 'FE001', '/avatars/developer1.jpg', '全栈开发工程师，精通React、Vue等前端框架', 149.00, 14999.00, 'available');

-- 插入技能数据
INSERT INTO skills (name, category)
VALUES 
('Figma', '设计工具'),
('用户界面设计', '设计技能'),
('用户体验设计', '设计技能'),
('移动应用设计', '设计技能'),
('Python', '编程语言'),
('数据可视化', '数据分析'),
('机器学习', '数据分析'),
('内容策划', '营销'),
('社交媒体运营', '营销'),
('品牌故事', '营销'),
('React', '前端开发'),
('Vue', '前端开发'),
('响应式设计', '前端开发');

-- 关联AI员工和技能
INSERT INTO ai_employee_skills (ai_employee_id, skill_id, proficiency_level)
VALUES 
(1, 1, 5), -- 小美-Figma
(1, 2, 5), -- 小美-用户界面设计
(1, 3, 4), -- 小美-用户体验设计
(1, 4, 5), -- 小美-移动应用设计
(2, 5, 5), -- 小智-Python
(2, 6, 5), -- 小智-数据可视化
(2, 7, 4), -- 小智-机器学习
(3, 8, 5), -- 小文-内容策划
(3, 9, 5), -- 小文-社交媒体运营
(3, 10, 4), -- 小文-品牌故事
(4, 11, 5), -- 小码-React
(4, 12, 4), -- 小码-Vue
(4, 13, 5); -- 小码-响应式设计

-- 插入作品示例
INSERT INTO work_samples (ai_employee_id, title, description, image_url)
VALUES 
(1, '电商APP界面设计', '为新电商平台设计的移动端界面，包括首页、商品详情等核心页面', '/samples/ui_sample1.jpg'),
(1, '金融管理系统界面', '为企业级金融管理系统设计的后台界面，注重数据展示和操作效率', '/samples/ui_sample2.jpg'),
(2, '用户行为分析报告', '电商平台用户行为分析，包括购买路径、转化率等关键指标分析', '/samples/data_sample1.jpg'),
(2, '销售预测模型', '基于历史数据构建的销售预测模型，准确率达85%以上', '/samples/data_sample2.jpg'),
(3, '品牌内容策略方案', '为科技初创公司设计的内容营销策略，包括内容框架和传播渠道', '/samples/content_sample1.jpg'),
(3, '社交媒体运营案例', '某食品品牌社交媒体运营案例，粉丝增长300%', '/samples/content_sample2.jpg'),
(4, '响应式企业官网', '为咨询公司开发的响应式官网，兼容各种设备', '/samples/dev_sample1.jpg'),
(4, 'SaaS产品前端界面', '为SaaS产品开发的管理后台，使用React构建', '/samples/dev_sample2.jpg');

-- 插入擅长任务
INSERT INTO specialties (ai_employee_id, task_name, description)
VALUES 
(1, '移动应用UI设计', '为iOS和Android应用设计美观易用的界面，包括线框图、视觉设计和交互原型'),
(1, '品牌视觉系统设计', '创建完整的品牌视觉识别系统，包括logo、配色、字体和组件库'),
(2, '用户行为数据分析', '分析用户在产品中的行为数据，提供洞察和优化建议'),
(2, '市场趋势预测', '基于大数据分析市场趋势，为产品决策提供数据支持'),
(3, '内容营销策略', '制定全面的内容营销策略，包括内容日历、渠道规划和KPI设定'),
(3, '品牌故事创作', '创作能引起共鸣的品牌故事，提升品牌认知和情感连接'),
(4, '前端架构设计', '设计可扩展的前端架构，确保代码质量和性能'),
(4, '交互原型开发', '快速开发交互原型，验证产品概念和用户体验');