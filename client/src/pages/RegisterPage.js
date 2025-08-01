import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Checkbox, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import './RegisterPage.css';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await register({
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone
      });
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <div className="brand-section">
            <div className="brand-logo">
              <div className="logo-icon">AI</div>
              <div className="logo-text">职场精灵</div>
            </div>
            <Title level={2} className="brand-title">
              加入我们
            </Title>
            <Text className="brand-subtitle">
              创建您的账户，开启AI职场精灵的专业服务之旅
            </Text>
          </div>
          
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">✨</div>
              <div className="benefit-text">
                <div className="benefit-title">免费试用</div>
                <div className="benefit-desc">注册即可获得7天免费试用</div>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🎯</div>
              <div className="benefit-text">
                <div className="benefit-title">精准匹配</div>
                <div className="benefit-desc">AI算法为您匹配最合适的员工</div>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔒</div>
              <div className="benefit-text">
                <div className="benefit-title">安全保障</div>
                <div className="benefit-desc">企业级安全保护您的数据</div>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">📈</div>
              <div className="benefit-text">
                <div className="benefit-title">效率提升</div>
                <div className="benefit-desc">平均提升工作效率300%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="register-right">
          <Card className="register-card">
            <div className="register-header">
              <Title level={3}>创建账户</Title>
              <Text type="secondary">
                已有账户？
                <Link to="/login" className="login-link">
                  立即登录
                </Link>
              </Text>
            </div>

            <Form
              name="register"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
              className="register-form"
              layout="vertical"
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 2, message: '用户名至少2个字符' },
                  { max: 20, message: '用户名最多20个字符' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="邮箱地址"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱地址"
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="手机号码"
                rules={[
                  { required: true, message: '请输入手机号码' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="请输入手机号码"
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6位字符' },
                  { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请再次输入密码"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  className="register-input"
                />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('请同意服务条款')) }
                ]}
              >
                <Checkbox className="agreement-checkbox">
                  我已阅读并同意
                  <Link to="/terms" className="terms-link">《服务条款》</Link>
                  和
                  <Link to="/privacy" className="terms-link">《隐私政策》</Link>
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="register-button"
                  block
                >
                  {loading ? '注册中...' : '创建账户'}
                </Button>
              </Form.Item>
            </Form>

            <Divider className="divider">或</Divider>

            <div className="social-register">
              <Button className="social-button wechat-button" block>
                <span className="social-icon">💬</span>
                微信注册
              </Button>
              <Button className="social-button qq-button" block>
                <span className="social-icon">🐧</span>
                QQ注册
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;