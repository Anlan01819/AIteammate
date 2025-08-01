const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase客户端配置
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('缺少Supabase配置信息');
}

// 创建Supabase客户端（服务端使用service role key）
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 创建公共客户端（前端使用anon key）
const supabasePublic = createClient(
  supabaseUrl, 
  process.env.SUPABASE_ANON_KEY || supabaseServiceKey
);

module.exports = {
  supabase,
  supabasePublic
};