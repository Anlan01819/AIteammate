// Supabase配置和数据库管理器
let supabaseClient = null;

// 初始化Supabase客户端
function initSupabase() {
    try {
        const SUPABASE_URL = 'https://tttnldosypbmnntldygl.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0dG5sZG9zeXBibW5udGxkeWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NTU4NzQsImV4cCI6MjA1MDUzMTg3NH0.example_key';
        
        if (typeof supabase !== 'undefined') {
            supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase客户端初始化成功');
            return true;
        } else {
            console.warn('Supabase库未加载，使用本地存储');
            return false;
        }
    } catch (error) {
        console.error('Supabase初始化失败:', error);
        return false;
    }
}

// 数据库管理器类
class DatabaseManager {
    constructor() {
        this.useSupabase = initSupabase();
    }

    // 创建用户
    async createUser(userData) {
        if (this.useSupabase && supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('users')
                    .insert([userData])
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Supabase创建用户失败:', error);
                return this.createUserLocal(userData);
            }
        } else {
            return this.createUserLocal(userData);
        }
    }

    // 本地存储创建用户
    createUserLocal(userData) {
        const users = JSON.parse(localStorage.getItem('ai_platform_users') || '[]');
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('ai_platform_users', JSON.stringify(users));
        return newUser;
    }

    // 创建招聘记录
    async createHireRecord(hireData) {
        if (this.useSupabase && supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('hire_records')
                    .insert([hireData])
                    .select()
                    .single();
                
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Supabase创建招聘记录失败:', error);
                return this.createHireRecordLocal(hireData);
            }
        } else {
            return this.createHireRecordLocal(hireData);
        }
    }

    // 本地存储创建招聘记录
    createHireRecordLocal(hireData) {
        const records = JSON.parse(localStorage.getItem('ai_platform_hire_records') || '[]');
        const newRecord = {
            id: Date.now().toString(),
            ...hireData,
            created_at: new Date().toISOString()
        };
        records.push(newRecord);
        localStorage.setItem('ai_platform_hire_records', JSON.stringify(records));
        return newRecord;
    }

    // 根据邮箱获取招聘记录
    async getHireRecordsByEmail(email) {
        if (this.useSupabase && supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('hire_records')
                    .select(`
                        *,
                        users!inner(contact_email, username, company_name, contact_phone)
                    `)
                    .eq('users.contact_email', email);
                
                if (error) throw error;
                return data.map(record => ({
                    ...record,
                    username: record.users.username,
                    company_name: record.users.company_name,
                    contact_email: record.users.contact_email,
                    contact_phone: record.users.contact_phone
                }));
            } catch (error) {
                console.error('Supabase查询失败:', error);
                return this.getHireRecordsByEmailLocal(email);
            }
        } else {
            return this.getHireRecordsByEmailLocal(email);
        }
    }

    // 本地存储根据邮箱获取招聘记录
    getHireRecordsByEmailLocal(email) {
        const users = JSON.parse(localStorage.getItem('ai_platform_users') || '[]');
        const records = JSON.parse(localStorage.getItem('ai_platform_hire_records') || '[]');
        
        const user = users.find(u => u.contact_email === email);
        if (!user) return [];
        
        return records
            .filter(record => record.user_id === user.id)
            .map(record => ({
                ...record,
                username: user.username,
                company_name: user.company_name,
                contact_email: user.contact_email,
                contact_phone: user.contact_phone
            }));
    }

    // 用户认证
    async authenticateUser(username, password) {
        if (this.useSupabase && supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('users')
                    .select('*')
                    .eq('username', username)
                    .eq('password', password)
                    .single();
                
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Supabase认证失败:', error);
                return this.authenticateUserLocal(username, password);
            }
        } else {
            return this.authenticateUserLocal(username, password);
        }
    }

    // 本地存储用户认证
    authenticateUserLocal(username, password) {
        const users = JSON.parse(localStorage.getItem('ai_platform_users') || '[]');
        return users.find(user => user.username === username && user.password === password) || null;
    }

    // 根据用户ID获取招聘记录
    async getHireRecordsByUserId(userId) {
        if (this.useSupabase && supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('hire_records')
                    .select(`
                        *,
                        users(username, company_name, contact_email, contact_phone)
                    `)
                    .eq('user_id', userId);
                
                if (error) throw error;
                return data.map(record => ({
                    ...record,
                    username: record.users.username,
                    company_name: record.users.company_name,
                    contact_email: record.users.contact_email,
                    contact_phone: record.users.contact_phone
                }));
            } catch (error) {
                console.error('Supabase查询失败:', error);
                return this.getHireRecordsByUserIdLocal(userId);
            }
        } else {
            return this.getHireRecordsByUserIdLocal(userId);
        }
    }

    // 本地存储根据用户ID获取招聘记录
    getHireRecordsByUserIdLocal(userId) {
        const users = JSON.parse(localStorage.getItem('ai_platform_users') || '[]');
        const records = JSON.parse(localStorage.getItem('ai_platform_hire_records') || '[]');
        
        const user = users.find(u => u.id === userId);
        if (!user) return [];
        
        return records
            .filter(record => record.user_id === userId)
            .map(record => ({
                ...record,
                username: user.username,
                company_name: user.company_name,
                contact_email: user.contact_email,
                contact_phone: user.contact_phone
            }));
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initSupabase();
});