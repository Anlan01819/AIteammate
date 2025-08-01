import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import supabase from '../services/supabase';

const AuthContext = createContext();

// 配置axios默认设置
const apiUrl = process.env.REACT_APP_API_URL || 
               (window.location.hostname === 'localhost' ? 
                'http://localhost:5000/api' : 
                'https://ai-workplace-api.herokuapp.com/api');
axios.defaults.baseURL = apiUrl;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 设置axios拦截器
  useEffect(() => {
    // 请求拦截器
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          message.error('登录已过期，请重新登录');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // 初始化时检查用户登录状态
  useEffect(() => {
    const initAuth = async () => {
      // 获取当前会话
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setToken(session.access_token);
        
        // 获取用户信息
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (userData) {
          setUser(userData);
        } else {
          // 如果用户在auth中存在但在users表中不存在，创建用户记录
          const { error } = await supabase.from('users').insert({
            id: session.user.id,
            email: session.user.email,
            username: session.user.email.split('@')[0],
            password_hash: '已通过Supabase Auth验证'
          });
          
          if (!error) {
            const { data: newUser } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            setUser(newUser);
          }
        }
      }
      
      setLoading(false);
    };

    initAuth();
    
    // 设置Supabase认证状态变化监听器
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setToken(session.access_token);
          
          // 获取用户信息
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser(userData || { id: session.user.id, email: session.user.email });
        } else if (event === 'SIGNED_OUT') {
          setToken(null);
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // 登录
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.session) {
        setToken(data.session.access_token);
        
        // 获取用户信息
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        setUser(userData);
      }
      
      message.success('登录成功');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || '登录失败';
      message.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // 注册
  const register = async (userData) => {
    try {
      // 使用Supabase Auth注册
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // 创建用户记录
        const { error: userError } = await supabase.from('users').insert({
          id: authData.user.id,
          email: userData.email,
          username: userData.username,
          password_hash: '已通过Supabase Auth验证',
          phone: userData.phone || null,
          avatar_url: userData.avatar_url || null
        });
        
        if (userError) throw userError;
        
        // 获取用户信息
        const { data: newUserData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        setUser(newUserData);
        
        if (authData.session) {
          setToken(authData.session.access_token);
        }
      }
      
      message.success('注册成功');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || '注册失败';
      message.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // 登出
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setToken(null);
      setUser(null);
      message.success('已退出登录');
    } catch (error) {
      console.error('登出失败:', error);
      message.error('登出失败');
    }
  };

  // 更新用户信息
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  // 刷新令牌
  const refreshToken = async () => {
    try {
      const response = await axios.post('/auth/refresh');
      const { token: newToken } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      return { success: true };
    } catch (error) {
      console.error('刷新令牌失败:', error);
      logout();
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;