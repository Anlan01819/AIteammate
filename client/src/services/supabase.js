import { createClient } from '@supabase/supabase-js';

// Supabase配置
const supabaseUrl = 'https://amlvbkpahfjqymmhrpxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbHZia3BhaGZqcXltbWhycHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDA1MTUsImV4cCI6MjA2OTQxNjUxNX0.hgV1oMUYaSYs_LOOmckVkF16iEqrlbs4Csk_cgUX8yg';

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;