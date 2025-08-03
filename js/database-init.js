// 数据库初始化脚本
// 注意：由于当前Supabase连接为只读模式，此脚本仅作为参考
// 实际部署时需要在Supabase控制台中手动创建这些表

const DATABASE_SCHEMA = {
    // 用户表
    users: `
        CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            company_name VARCHAR(100) NOT NULL,
            contact_name VARCHAR(50) NOT NULL,
            contact_email VARCHAR(100) NOT NULL,
            contact_phone VARCHAR(20) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `,
    
    // 招聘记录表
    hire_records: `
        CREATE TABLE IF NOT EXISTS hire_records (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            ai_employee_id INTEGER NOT NULL,
            ai_employee_name VARCHAR(100) NOT NULL,
            company_name VARCHAR(100) NOT NULL,
            contact_name VARCHAR(50) NOT NULL,
            contact_email VARCHAR(100) NOT NULL,
            contact_phone VARCHAR(20) NOT NULL,
            hire_duration INTEGER NOT NULL,
            requirements TEXT,
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `,
    
    // AI员工信息表（可选，用于存储AI员工的详细信息）
    ai_employees: `
        CREATE TABLE IF NOT EXISTS ai_employees (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            avatar_url TEXT,
            skills TEXT[],
            short_desc TEXT,
            long_desc TEXT,
            cases TEXT,
            industry VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    `
};

// 插入AI员工数据的SQL
const AI_EMPLOYEES_DATA = `
    INSERT INTO ai_employees (id, name, avatar_url, skills, short_desc, long_desc, cases, industry) VALUES
    (1, '数据分析师 Alex', 'https://api.dicebear.com/6.x/bottts/svg?seed=Alex', 
     ARRAY['数据分析', '数据库优化', '机器学习'], 
     '专业数据分析AI，擅长从海量数据中提取有价值的业务洞察',
     '作为一名专业的数据分析AI员工，我擅长处理和分析各种数据，包括销售数据、用户行为数据、市场趋势等。我可以进行深入的分析研究，生成直观的数据可视化图表，并提供基于数据的业务决策建议。',
     '曾帮助某电商平台分析用户购买行为，优化商品推荐算法，提升转化率15%。为某金融机构建立风险评估模型，准确率达到92%。',
     'tech'),
    (2, '内容创作者 Bella', 'https://api.dicebear.com/6.x/bottts/svg?seed=Bella',
     ARRAY['文案撰写', '内容策划', '社媒运营'],
     '创意内容创作专家，为各种平台创造引人入胜的内容',
     '我是一位专业的内容创作AI，擅长撰写各种文案、新闻文章、社交媒体内容和营销材料。我能根据不同平台和目标受众的特点，创作符合调性的内容，并确保内容既有创意又符合品牌调性。',
     '为某奢侈品品牌策划执行为期3个月的社交媒体营销活动，粉丝增长率达40%。为科技公司撰写技术博客，平均阅读时长提升25%。',
     'retail'),
    (3, '客服专员 Charlie', 'https://api.dicebear.com/6.x/bottts/svg?seed=Charlie',
     ARRAY['客户沟通', '问题解决', '服务优化'],
     '24/7在线客服，能高效处理客户问题并提供优质服务体验',
     '作为客服AI，我可以24/7不间断地通过电话、邮件、在线聊天等方式与客户进行沟通。我能处理常见问题，解决投诉，收集客户反馈，并识别客户需求。我具备良好的沟通技巧，确保每位客户都能获得满意的服务体验。',
     '为某电商公司客服网站处理500+客户咨询，满意度评分4.8/5。帮助提升产品销售转化率30%，降低人工客服成本的同时维持了高水平的客户满意度。',
     'retail'),
    (4, '程序员 David', 'https://api.dicebear.com/6.x/bottts/svg?seed=David',
     ARRAY['代码编写', '系统设计', '代码调试'],
     '程序开发AI专家，熟悉多种编程语言和框架',
     '我是一位编程AI专家，精通多种编程语言（如Python、JavaScript、Java等），具备全栈能力。我可以协助编写代码、设计系统架构、调试问题，并提供高效的解决方案。我还能编写文档、设计API接口。',
     '协助某创业公司开发了电商网站和系统，比预期时间提前20%完成。为某金融科技公司优化数据处理算法，提升了处理速度40%。',
     'tech'),
    (5, '财务顾问 Emma', 'https://api.dicebear.com/6.x/bottts/svg?seed=Emma',
     ARRAY['财务分析', '预算规划', '投资建议'],
     'AI财务顾问，提供专业的财务分析和规划服务',
     '作为AI财务顾问，我擅长进行财务数据分析、预算规划、成本控制和投资决策指导。我可以生成财务报表、识别成本节约机会，并提供基于数据的投资建议。',
     '帮助多家小企业优化财务流程，平均15%营运成本。为个人投资者提供投资组合优化建议，年化收益率提升8%。',
     'finance'),
    (6, '医疗助手 Frank', 'https://api.dicebear.com/6.x/bottts/svg?seed=Frank',
     ARRAY['医学知识', '健康咨询', '医疗数据分析'],
     '医疗AI专家，提供健康信息和初步咨询服务',
     '我是一位医疗AI专家，拥有广泛的医学知识库。我可以提供健康信息、分析症状、提供初步建议。我还能协助医疗机构进行数据分析，优化医疗资源配置。',
     '为医院开发了患者服务系统，减少了患者就诊等待时间25%。为健康管理平台的用户提供个性化健康指导，用户满意度提升18%。',
     'healthcare')
    ON CONFLICT (id) DO NOTHING;
`;

// 导出数据库架构
window.DATABASE_SCHEMA = DATABASE_SCHEMA;
window.AI_EMPLOYEES_DATA = AI_EMPLOYEES_DATA;

console.log('数据库初始化脚本已加载');
console.log('请在Supabase控制台中手动执行以下SQL语句来创建表结构：');
console.log('1. 用户表:', DATABASE_SCHEMA.users);
console.log('2. 招聘记录表:', DATABASE_SCHEMA.hire_records);
console.log('3. AI员工表:', DATABASE_SCHEMA.ai_employees);
console.log('4. 插入AI员工数据:', AI_EMPLOYEES_DATA);