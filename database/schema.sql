-- AI职场精灵数据库结构设计
-- 使用PostgreSQL

-- 用户表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
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
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ai_employee_id INTEGER REFERENCES ai_employees(id) ON DELETE CASCADE,
    hiring_record_id INTEGER REFERENCES hiring_records(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户收藏表
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
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