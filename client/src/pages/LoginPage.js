import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="brand-section">
            <div className="brand-logo">
              <div className="logo-icon">AI</div>
              <div className="logo-text">职场精灵</div>
            </div>
            <Title level={2} className="brand-title">
              欢迎回来
            </Title>
            <Text className="brand-subtitle">
              登录您的账户，继续使用AI职场精灵的专业服务
            </Text>
          </div>
          
          <div className="features-preview">
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <div className="feature-text">
                <div className="feature-title">智能匹配</div>
                <div className="feature-desc">AI算法精准匹配最适合的员工</div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">
                <div className="feature-title">高效协作</div>
                <div className="feature-desc">24小时在线，随时响应您的需求</div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <div className="feature-text">
                <div className="feature-title">专业服务</div>
                <div className="feature-desc">各行业顶尖专家，品质有保障</div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <Card className="login-card">
            <div className="login-header">
              <Title level={3}>登录账户</Title>
              <Text type="secondary">
                还没有账户？
                <Link to="/register" className="register-link">
                  立即注册
                </Link>
              </Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              className="login-form"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="邮箱地址"
                  className="login-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6位字符' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  className="login-input"
                />
              </Form.Item>

              <div className="login-options">
                <Link to="/forgot-password" className="forgot-link">
                  忘记密码？
                </Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="login-button"
                  block
                >
                  {loading ? '登录中...' : '登录'}
                </Button>
              </Form.Item>
            </Form>

            <Divider className="divider">或</Divider>

            <div className="social-login">
              <Button className="social-button wechat-button" block>
                <span className="social-icon">💬</span>
                微信登录
              </Button>
              <Button className="social-button qq-button" block>
                <span className="social-icon">🐧</span>
                QQ登录
              </Button>
            </div>

            <div className="login-footer">
              <Text type="secondary" className="terms-text">
                登录即表示您同意我们的
                <Link to="/terms" className="terms-link">服务条款</Link>
                和
                <Link to="/privacy" className="terms-link">隐私政策</Link>
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;