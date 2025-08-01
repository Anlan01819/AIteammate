import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Avatar, Button, Form, Input, Select, 
  DatePicker, Upload, message, Tabs, List, Tag, Rate,
  Statistic, Progress, Divider, Modal, Switch, Space,
  Tooltip, Badge, Empty
} from 'antd';
import { 
  UserOutlined, EditOutlined, CameraOutlined, SaveOutlined,
  MailOutlined, PhoneOutlined, EnvironmentOutlined, CalendarOutlined,
  TrophyOutlined, StarOutlined, HeartOutlined, EyeOutlined,
  SettingOutlined, BellOutlined, SecurityScanOutlined, LogoutOutlined,
  UploadOutlined, DeleteOutlined, LockOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './ProfilePage.css';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [form] = Form.useForm();
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordForm] = Form.useForm();

  // 模拟用户数据
  const mockUserInfo = {
    id: 1,
    username: 'user123',
    email: 'user@example.com',
    phone: '138****8888',
    avatar: '/avatars/user-avatar.jpg',
    realName: '张三',
    gender: 'male',
    birthday: '1990-05-15',
    location: '北京市朝阳区',
    company: '某科技公司',
    position: '产品经理',
    bio: '热爱科技，专注产品设计与用户体验。希望通过AI技术提升工作效率，创造更好的产品。',
    joinDate: '2023-06-15',
    lastLogin: '2024-01-28 14:30',
    verified: true,
    vipLevel: 'premium',
    stats: {
      totalHires: 15,
      totalSpent: 25680,
      favoriteCount: 8,
      reviewCount: 12,
      averageRating: 4.8
    },
    recentHires: [
      {
        id: 1,
        employeeName: 'AI设计师小美',
        category: 'UI设计师',
        projectTitle: '电商APP界面设计',
        status: 'completed',
        rating: 5,
        date: '2024-01-25'
      },
      {
        id: 2,
        employeeName: 'AI数据分析师小智',
        category: '数据分析师',
        projectTitle: '用户行为数据分析',
        status: 'in_progress',
        rating: null,
        date: '2024-01-20'
      }
    ],
    favorites: [
      {
        id: 1,
        employeeName: 'AI设计师小美',
        category: 'UI设计师',
        avatar: '/avatars/designer1.jpg',
        rating: 4.9,
        price: 299
      },
      {
        id: 2,
        employeeName: 'AI前端开发者小码',
        category: '前端开发者',
        avatar: '/avatars/developer1.jpg',
        rating: 4.8,
        price: 399
      }
    ],
    settings: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      projectUpdates: true,
      weeklyReport: true,
      privacy: {
        showProfile: true,
        showHireHistory: false,
        showReviews: true
      }
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        setUserInfo(mockUserInfo);
        form.setFieldsValue({
          realName: mockUserInfo.realName,
          email: mockUserInfo.email,
          phone: mockUserInfo.phone,
          gender: mockUserInfo.gender,
          birthday: moment(mockUserInfo.birthday),
          location: mockUserInfo.location,
          company: mockUserInfo.company,
          position: mockUserInfo.position,
          bio: mockUserInfo.bio
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('加载用户信息失败:', error);
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    try {
      console.log('保存用户信息:', values);
      message.success('个人信息更新成功！');
      setEditing(false);
      // 更新用户信息
      setUserInfo({
        ...userInfo,
        ...values,
        birthday: values.birthday.format('YYYY-MM-DD')
      });
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功！');
      // 更新头像
      setUserInfo({
        ...userInfo,
        avatar: info.file.response.url
      });
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      console.log('修改密码:', values);
      message.success('密码修改成功！');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error('密码修改失败，请重试');
    }
  };

  const getVipBadge = (level) => {
    const badges = {
      basic: { text: '基础会员', color: '#d9d9d9' },
      premium: { text: '高级会员', color: '#1890ff' },
      vip: { text: 'VIP会员', color: '#f5222d' }
    };
    return badges[level] || badges.basic;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'success',
      in_progress: 'processing',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      completed: '已完成',
      in_progress: '进行中',
      cancelled: '已取消'
    };
    return texts[status] || '未知';
  };

  if (loading || !userInfo) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  const vipBadge = getVipBadge(userInfo.vipLevel);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Row gutter={[32, 32]}>
          {/* 左侧个人信息 */}
          <Col xs={24} lg={8}>
            <Card className="profile-card">
              <div className="profile-header">
                <div className="avatar-section">
                  <Badge 
                    count={userInfo.verified ? '✓' : 0} 
                    className="verified-badge"
                  >
                    <Avatar 
                      size={120} 
                      src={userInfo.avatar} 
                      className="profile-avatar"
                    >
                      {userInfo.realName?.charAt(0)}
                    </Avatar>
                  </Badge>
                  
                  <Upload
                    name="avatar"
                    showUploadList={false}
                    action="/api/upload/avatar"
                    onChange={handleAvatarUpload}
                    className="avatar-upload"
                  >
                    <Button 
                      type="text" 
                      icon={<CameraOutlined />} 
                      className="upload-btn"
                    >
                      更换头像
                    </Button>
                  </Upload>
                </div>

                <div className="profile-info">
                  <h2 className="profile-name">{userInfo.realName}</h2>
                  <div className="profile-badges">
                    <Tag color={vipBadge.color} className="vip-badge">
                      {vipBadge.text}
                    </Tag>
                    {userInfo.verified && (
                      <Tag color="green" className="verified-tag">
                        已认证
                      </Tag>
                    )}
                  </div>
                  <p className="profile-bio">{userInfo.bio}</p>
                </div>
              </div>

              <Divider />

              <div className="profile-stats">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="累计聘用"
                      value={userInfo.stats.totalHires}
                      suffix="次"
                      valueStyle={{ fontSize: '20px', color: '#1890ff' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="总支出"
                      value={userInfo.stats.totalSpent}
                      prefix="¥"
                      valueStyle={{ fontSize: '20px', color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="收藏数"
                      value={userInfo.stats.favoriteCount}
                      suffix="个"
                      valueStyle={{ fontSize: '20px', color: '#fa8c16' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="平均评分"
                      value={userInfo.stats.averageRating}
                      suffix="分"
                      precision={1}
                      valueStyle={{ fontSize: '20px', color: '#eb2f96' }}
                    />
                  </Col>
                </Row>
              </div>

              <Divider />

              <div className="profile-actions">
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => setEditing(true)}
                  block
                  size="large"
                  className="edit-btn"
                >
                  编辑资料
                </Button>
                <Button 
                  icon={<LockOutlined />}
                  onClick={() => setPasswordModalVisible(true)}
                  block
                  size="large"
                  className="password-btn"
                >
                  修改密码
                </Button>
              </div>
            </Card>
          </Col>

          {/* 右侧详细信息 */}
          <Col xs={24} lg={16}>
            <Card className="detail-card">
              <Tabs defaultActiveKey="info" className="profile-tabs">
                <TabPane tab="基本信息" key="info">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                    className="profile-form"
                  >
                    <Row gutter={[24, 0]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="realName"
                          label="真实姓名"
                          rules={[{ required: true, message: '请输入真实姓名' }]}
                        >
                          <Input 
                            placeholder="请输入真实姓名" 
                            disabled={!editing}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="email"
                          label="邮箱地址"
                          rules={[
                            { required: true, message: '请输入邮箱地址' },
                            { type: 'email', message: '请输入有效的邮箱地址' }
                          ]}
                        >
                          <Input 
                            placeholder="请输入邮箱地址" 
                            disabled={!editing}
                            size="large"
                            prefix={<MailOutlined />}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="phone"
                          label="手机号码"
                          rules={[{ required: true, message: '请输入手机号码' }]}
                        >
                          <Input 
                            placeholder="请输入手机号码" 
                            disabled={!editing}
                            size="large"
                            prefix={<PhoneOutlined />}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="gender"
                          label="性别"
                        >
                          <Select 
                            placeholder="请选择性别" 
                            disabled={!editing}
                            size="large"
                          >
                            <Option value="male">男</Option>
                            <Option value="female">女</Option>
                            <Option value="other">其他</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="birthday"
                          label="出生日期"
                        >
                          <DatePicker 
                            placeholder="请选择出生日期" 
                            disabled={!editing}
                            size="large"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="location"
                          label="所在地区"
                        >
                          <Input 
                            placeholder="请输入所在地区" 
                            disabled={!editing}
                            size="large"
                            prefix={<EnvironmentOutlined />}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="company"
                          label="公司名称"
                        >
                          <Input 
                            placeholder="请输入公司名称" 
                            disabled={!editing}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="position"
                          label="职位"
                        >
                          <Input 
                            placeholder="请输入职位" 
                            disabled={!editing}
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name="bio"
                          label="个人简介"
                        >
                          <TextArea 
                            rows={4}
                            placeholder="请输入个人简介" 
                            disabled={!editing}
                            maxLength={200}
                            showCount
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {editing && (
                      <div className="form-actions">
                        <Button 
                          type="default" 
                          onClick={() => setEditing(false)}
                          size="large"
                        >
                          取消
                        </Button>
                        <Button 
                          type="primary" 
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          size="large"
                          className="save-btn"
                        >
                          保存
                        </Button>
                      </div>
                    )}
                  </Form>
                </TabPane>

                <TabPane tab="聘用记录" key="records">
                  <div className="records-section">
                    <div className="section-header">
                      <h3>最近聘用</h3>
                      <Button type="link" onClick={() => window.location.href = '/records'}>
                        查看全部
                      </Button>
                    </div>
                    
                    <List
                      dataSource={userInfo.recentHires}
                      renderItem={item => (
                        <List.Item
                          actions={[
                            <Button type="link" icon={<EyeOutlined />}>查看</Button>
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <div className="hire-title">
                                <span>{item.projectTitle}</span>
                                <Tag color={getStatusColor(item.status)}>
                                  {getStatusText(item.status)}
                                </Tag>
                              </div>
                            }
                            description={
                              <div className="hire-desc">
                                <div>员工: {item.employeeName} ({item.category})</div>
                                <div>日期: {item.date}</div>
                                {item.rating && (
                                  <div className="hire-rating">
                                    <Rate disabled defaultValue={item.rating} size="small" />
                                    <span>{item.rating}.0</span>
                                  </div>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </TabPane>

                <TabPane tab="我的收藏" key="favorites">
                  <div className="favorites-section">
                    <div className="section-header">
                      <h3>收藏的AI员工</h3>
                      <span className="count-badge">{userInfo.favorites.length} 个</span>
                    </div>
                    
                    <Row gutter={[16, 16]}>
                      {userInfo.favorites.map(employee => (
                        <Col xs={24} sm={12} key={employee.id}>
                          <Card 
                            className="favorite-card"
                            actions={[
                              <Button type="link" icon={<EyeOutlined />}>查看</Button>,
                              <Button type="link" icon={<HeartOutlined />} danger>取消收藏</Button>
                            ]}
                          >
                            <Card.Meta
                              avatar={<Avatar src={employee.avatar} size={48} />}
                              title={employee.employeeName}
                              description={
                                <div>
                                  <div>{employee.category}</div>
                                  <div className="favorite-meta">
                                    <Rate disabled defaultValue={employee.rating} size="small" />
                                    <span className="price">¥{employee.price}</span>
                                  </div>
                                </div>
                              }
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </TabPane>

                <TabPane tab="账户设置" key="settings">
                  <div className="settings-section">
                    <div className="setting-group">
                      <h3>通知设置</h3>
                      <div className="setting-item">
                        <div className="setting-info">
                          <div className="setting-title">邮件通知</div>
                          <div className="setting-desc">接收重要的邮件通知</div>
                        </div>
                        <Switch defaultChecked={userInfo.settings.emailNotifications} />
                      </div>
                      <div className="setting-item">
                        <div className="setting-info">
                          <div className="setting-title">短信通知</div>
                          <div className="setting-desc">接收短信提醒</div>
                        </div>
                        <Switch defaultChecked={userInfo.settings.smsNotifications} />
                      </div>
                      <div className="setting-item">
                        <div className="setting-info">
                          <div className="setting-title">营销邮件</div>
                          <div className="setting-desc">接收产品更新和优惠信息</div>
                        </div>
                        <Switch defaultChecked={userInfo.settings.marketingEmails} />
                      </div>
                    </div>

                    <Divider />

                    <div className="setting-group">
                      <h3>隐私设置</h3>
                      <div className="setting-item">
                        <div className="setting-info">
                          <div className="setting-title">公开个人资料</div>
                          <div className="setting-desc">允许其他用户查看您的基本信息</div>
                        </div>
                        <Switch defaultChecked={userInfo.settings.privacy.showProfile} />
                      </div>
                      <div className="setting-item">
                        <div className="setting-info">
                          <div className="setting-title">显示聘用历史</div>
                          <div className="setting-desc">在个人资料中显示聘用记录</div>
                        </div>
                        <Switch defaultChecked={userInfo.settings.privacy.showHireHistory} />
                      </div>
                      <div className="setting-item">
                        <div className="setting-info">
                          <div className="setting-title">显示评价</div>
                          <div className="setting-desc">允许显示您给出的评价</div>
                        </div>
                        <Switch defaultChecked={userInfo.settings.privacy.showReviews} />
                      </div>
                    </div>

                    <Divider />

                    <div className="danger-zone">
                      <h3>危险操作</h3>
                      <div className="danger-actions">
                        <Button danger icon={<LogoutOutlined />}>
                          退出登录
                        </Button>
                        <Button danger type="primary" icon={<DeleteOutlined />}>
                          删除账户
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
        width={500}
        className="password-modal"
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
          className="password-form"
        >
          <Form.Item
            name="currentPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password 
              placeholder="请输入当前密码" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少6位' }
            ]}
          >
            <Input.Password 
              placeholder="请输入新密码" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="请再次输入新密码" 
              size="large"
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button type="default" onClick={() => setPasswordModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" className="submit-btn">
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;