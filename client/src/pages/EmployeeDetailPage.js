import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Row, Col, Avatar, Tag, Rate, Button, Tabs, Carousel, 
  List, Comment, Progress, Statistic, Modal, Form, Input, 
  InputNumber, Select, DatePicker, message, Spin, Divider 
} from 'antd';
import { 
  HeartOutlined, HeartFilled, ShareAltOutlined, MessageOutlined,
  StarOutlined, TrophyOutlined, ClockCircleOutlined, UserOutlined,
  PhoneOutlined, MailOutlined, CalendarOutlined, DollarOutlined,
  CheckOutlined
} from '@ant-design/icons';
import './EmployeeDetailPage.css';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hireModalVisible, setHireModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [confirmHireVisible, setConfirmHireVisible] = useState(false);
  const [hireForm] = Form.useForm();
  const [contactForm] = Form.useForm();
  const [hiringData, setHiringData] = useState(null);

  // 模拟员工详细数据
  const mockEmployee = {
    id: 1,
    name: 'AI设计师小美',
    avatar: '/avatars/designer1.jpg',
    category: 'UI设计师',
    categoryEn: 'ui-designer',
    price: 299,
    rating: 4.9,
    reviewCount: 128,
    completedProjects: 156,
    responseTime: '1小时内',
    isOnline: true,
    badge: '新人',
    experience: '3年+',
    joinDate: '2023-06-15',
    location: '北京',
    languages: ['中文', '英文'],
    skills: ['UI设计', 'UX设计', 'Figma', 'Sketch', 'Adobe XD', 'Photoshop', '原型设计', '用户研究'],
    description: '我是一名专业的UI/UX设计师，拥有3年以上的设计经验。擅长现代化界面设计和用户体验优化，熟练使用各种设计工具。我注重细节，追求完美，能够为您的产品提供专业、美观、易用的设计方案。',
    specialties: [
      '移动端APP设计',
      '网页界面设计', 
      '用户体验优化',
      '品牌视觉设计',
      '交互原型制作',
      '设计系统构建'
    ],
    workModes: [
      { mode: '按项目', price: 299, description: '适合单个项目或短期合作' },
      { mode: '按小时', price: 89, description: '灵活计费，适合小任务' },
      { mode: '按月', price: 8999, description: '长期合作，享受优惠价格' }
    ],
    portfolio: [
      {
        id: 1,
        title: '电商APP界面设计',
        image: '/portfolio/project1.jpg',
        description: '为某知名电商平台设计的移动端界面，提升了用户购买转化率30%',
        tags: ['移动端', 'UI设计', '电商']
      },
      {
        id: 2,
        title: '企业官网重设计',
        image: '/portfolio/project2.jpg',
        description: '为科技公司重新设计官网，现代简洁的设计风格获得客户高度认可',
        tags: ['网页设计', 'UX设计', '企业官网']
      },
      {
        id: 3,
        title: '金融APP用户体验优化',
        image: '/portfolio/project3.jpg',
        description: '优化金融APP的用户流程，将用户完成率提升了45%',
        tags: ['UX优化', '金融', '用户研究']
      }
    ],
    reviews: [
      {
        id: 1,
        user: '张总',
        avatar: '/avatars/user1.jpg',
        rating: 5,
        date: '2024-01-15',
        content: '小美的设计水平非常高，沟通顺畅，交付及时。我们的APP界面经过她的设计后，用户反馈非常好，下载量也有明显提升。强烈推荐！',
        project: '电商APP界面设计'
      },
      {
        id: 2,
        user: '李经理',
        avatar: '/avatars/user2.jpg',
        rating: 5,
        date: '2024-01-10',
        content: '专业度很高，能够准确理解我们的需求，设计出来的方案超出预期。工作态度认真负责，值得长期合作。',
        project: '企业官网重设计'
      },
      {
        id: 3,
        user: '王总监',
        avatar: '/avatars/user3.jpg',
        rating: 4,
        date: '2024-01-05',
        content: '设计能力强，创意丰富。唯一的小建议是希望能在项目初期多一些沟通，确保设计方向完全符合预期。',
        project: '品牌视觉设计'
      }
    ],
    stats: {
      totalProjects: 156,
      repeatClients: 89,
      onTimeDelivery: 98,
      clientSatisfaction: 96
    }
  };

  useEffect(() => {
    loadEmployeeDetail();
  }, [id]);

  const loadEmployeeDetail = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        setEmployee(mockEmployee);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('加载员工详情失败:', error);
      setLoading(false);
    }
  };

  const handleHire = async (values) => {
    try {
      // 保存聘用数据，用于确认弹窗显示
      const hireInfo = {
        ...values,
        employeeId: employee.id,
        employeeName: employee.name,
        employeeAvatar: employee.avatar,
        employeeCategory: employee.category,
        price: employee.workModes.find(mode => mode.mode === values.workMode)?.price || 0,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : '',
      };
      
      setHiringData(hireInfo);
      setHireModalVisible(false);
      setConfirmHireVisible(true);
    } catch (error) {
      message.error('提交失败，请重试');
    }
  };
  
  const confirmHire = async () => {
    try {
      // 这里可以调用API保存聘用记录
      console.log('确认聘用信息:', hiringData);
      
      // 模拟API调用
      setTimeout(() => {
        setConfirmHireVisible(false);
        message.success({
          content: '聘用成功！您可以在"我的聘用记录"中查看详情',
          duration: 5,
          icon: <div className="custom-success-icon"><CheckOutlined /></div>,
          className: 'custom-success-message'
        });
        
        // 重置表单
        hireForm.resetFields();
        
        // 可以选择跳转到聘用记录页面
        // navigate('/records');
      }, 1000);
    } catch (error) {
      message.error('聘用失败，请重试');
    }
  };

  const handleContact = async (values) => {
    try {
      console.log('联系信息:', values);
      message.success('消息已发送，员工会尽快回复您！');
      setContactModalVisible(false);
      contactForm.resetFields();
    } catch (error) {
      message.error('发送失败，请重试');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? '已取消收藏' : '已添加到收藏');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${employee.name} - AI职场精灵`,
        text: employee.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success('链接已复制到剪贴板');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>正在加载员工详情...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="error-container">
        <h2>员工不存在</h2>
        <Button type="primary" onClick={() => navigate('/browse')}>
          返回浏览页面
        </Button>
      </div>
    );
  }

  return (
    <div className="employee-detail-page">
      <div className="detail-container">
        <Row gutter={[32, 32]}>
          {/* 左侧主要内容 */}
          <Col xs={24} lg={16}>
            {/* 员工基本信息 */}
            <Card className="employee-info-card">
              <div className="employee-header">
                <div className="employee-basic">
                  <Avatar size={120} src={employee.avatar} className="employee-avatar">
                    {employee.name.charAt(0)}
                  </Avatar>
                  <div className="employee-details">
                    <div className="name-section">
                      <h1 className="employee-name">{employee.name}</h1>
                      <div className="employee-badges">
                        <Tag color="blue" className="category-tag">{employee.category}</Tag>
                        {employee.badge && (
                          <Tag className={`employee-badge ${employee.badge}`}>
                            {employee.badge}
                          </Tag>
                        )}
                        <div className="online-status">
                          <div className={`status-dot ${employee.isOnline ? 'online' : 'offline'}`} />
                          <span>{employee.isOnline ? '在线' : '离线'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rating-section">
                      <Rate disabled defaultValue={employee.rating} allowHalf />
                      <span className="rating-text">
                        {employee.rating} ({employee.reviewCount} 条评价)
                      </span>
                    </div>

                    <div className="quick-stats">
                      <div className="stat-item">
                        <TrophyOutlined className="stat-icon" />
                        <span>{employee.completedProjects} 个项目</span>
                      </div>
                      <div className="stat-item">
                        <ClockCircleOutlined className="stat-icon" />
                        <span>响应时间 {employee.responseTime}</span>
                      </div>
                      <div className="stat-item">
                        <UserOutlined className="stat-icon" />
                        <span>经验 {employee.experience}</span>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => setHireModalVisible(true)}
                        className="hire-btn"
                      >
                        立即聘用
                      </Button>
                      <Button
                        size="large"
                        icon={<MessageOutlined />}
                        onClick={() => setContactModalVisible(true)}
                        className="contact-btn"
                      >
                        联系沟通
                      </Button>
                      <Button
                        size="large"
                        icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                        onClick={toggleFavorite}
                        className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                      >
                        {isFavorite ? '已收藏' : '收藏'}
                      </Button>
                      <Button
                        size="large"
                        icon={<ShareAltOutlined />}
                        onClick={handleShare}
                        className="share-btn"
                      >
                        分享
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 详细信息标签页 */}
            <Card className="detail-tabs-card">
              <Tabs defaultActiveKey="overview" className="detail-tabs">
                <TabPane tab="概览" key="overview">
                  <div className="overview-content">
                    <div className="description-section">
                      <h3>个人简介</h3>
                      <p className="description-text">{employee.description}</p>
                    </div>

                    <div className="skills-section">
                      <h3>专业技能</h3>
                      <div className="skills-list">
                        {employee.skills.map(skill => (
                          <Tag key={skill} className="skill-tag">{skill}</Tag>
                        ))}
                      </div>
                    </div>

                    <div className="specialties-section">
                      <h3>服务专长</h3>
                      <Row gutter={[16, 16]}>
                        {employee.specialties.map((specialty, index) => (
                          <Col xs={24} sm={12} key={index}>
                            <div className="specialty-item">
                              <StarOutlined className="specialty-icon" />
                              <span>{specialty}</span>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>

                    <div className="stats-section">
                      <h3>工作统计</h3>
                      <Row gutter={[24, 24]}>
                        <Col xs={12} sm={6}>
                          <Statistic
                            title="完成项目"
                            value={employee.stats.totalProjects}
                            suffix="个"
                            valueStyle={{ color: '#1890ff' }}
                          />
                        </Col>
                        <Col xs={12} sm={6}>
                          <Statistic
                            title="回头客户"
                            value={employee.stats.repeatClients}
                            suffix="位"
                            valueStyle={{ color: '#52c41a' }}
                          />
                        </Col>
                        <Col xs={12} sm={6}>
                          <div className="progress-stat">
                            <div className="stat-title">按时交付</div>
                            <Progress
                              percent={employee.stats.onTimeDelivery}
                              size="small"
                              strokeColor="#52c41a"
                            />
                          </div>
                        </Col>
                        <Col xs={12} sm={6}>
                          <div className="progress-stat">
                            <div className="stat-title">客户满意度</div>
                            <Progress
                              percent={employee.stats.clientSatisfaction}
                              size="small"
                              strokeColor="#1890ff"
                            />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </TabPane>

                <TabPane tab="作品展示" key="portfolio">
                  <div className="portfolio-content">
                    <Row gutter={[24, 24]}>
                      {employee.portfolio.map(project => (
                        <Col xs={24} sm={12} lg={8} key={project.id}>
                          <Card
                            hoverable
                            cover={
                              <div className="portfolio-cover">
                                <img src={project.image} alt={project.title} />
                              </div>
                            }
                            className="portfolio-card"
                          >
                            <Card.Meta
                              title={project.title}
                              description={project.description}
                            />
                            <div className="portfolio-tags">
                              {project.tags.map(tag => (
                                <Tag key={tag} size="small">{tag}</Tag>
                              ))}
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </TabPane>

                <TabPane tab={`评价 (${employee.reviewCount})`} key="reviews">
                  <div className="reviews-content">
                    <div className="reviews-summary">
                      <div className="rating-overview">
                        <div className="overall-rating">
                          <span className="rating-number">{employee.rating}</span>
                          <div className="rating-stars">
                            <Rate disabled defaultValue={employee.rating} allowHalf />
                            <span className="rating-count">基于 {employee.reviewCount} 条评价</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Divider />

                    <List
                      className="reviews-list"
                      itemLayout="vertical"
                      dataSource={employee.reviews}
                      renderItem={review => (
                        <List.Item key={review.id}>
                          <Comment
                            author={review.user}
                            avatar={<Avatar src={review.avatar}>{review.user.charAt(0)}</Avatar>}
                            content={review.content}
                            datetime={
                              <div className="review-meta">
                                <Rate disabled defaultValue={review.rating} size="small" />
                                <span className="review-date">{review.date}</span>
                                <span className="review-project">项目: {review.project}</span>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          {/* 右侧聘用信息 */}
          <Col xs={24} lg={8}>
            <div className="sidebar-sticky">
              {/* 价格信息卡片 */}
              <Card className="pricing-card">
                <h3 className="pricing-title">聘用方式</h3>
                <div className="pricing-options">
                  {employee.workModes.map((mode, index) => (
                    <div key={index} className="pricing-option">
                      <div className="pricing-header">
                        <span className="pricing-mode">{mode.mode}</span>
                        <span className="pricing-price">¥{mode.price}</span>
                      </div>
                      <p className="pricing-desc">{mode.description}</p>
                    </div>
                  ))}
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => setHireModalVisible(true)}
                  className="hire-now-btn"
                >
                  立即聘用
                </Button>
              </Card>

              {/* 员工信息卡片 */}
              <Card className="employee-info-sidebar">
                <h3>员工信息</h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">所在地:</span>
                    <span className="info-value">{employee.location}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">加入时间:</span>
                    <span className="info-value">{employee.joinDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">语言能力:</span>
                    <span className="info-value">{employee.languages.join(', ')}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">响应时间:</span>
                    <span className="info-value">{employee.responseTime}</span>
                  </div>
                </div>
              </Card>

              {/* 联系方式卡片 */}
              <Card className="contact-card">
                <h3>联系沟通</h3>
                <p className="contact-desc">
                  有任何问题或需求，欢迎随时与我沟通交流
                </p>
                <Button
                  type="default"
                  size="large"
                  block
                  icon={<MessageOutlined />}
                  onClick={() => setContactModalVisible(true)}
                  className="contact-now-btn"
                >
                  发送消息
                </Button>
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      {/* 聘用模态框 */}
      <Modal
        title="聘用 AI员工"
        open={hireModalVisible}
        onCancel={() => setHireModalVisible(false)}
        footer={null}
        width={600}
        className="hire-modal"
      >
        <Form
          form={hireForm}
          layout="vertical"
          onFinish={handleHire}
          className="hire-form"
        >
          <Form.Item
            name="workMode"
            label="聘用方式"
            rules={[{ required: true, message: '请选择聘用方式' }]}
          >
            <Select placeholder="选择聘用方式" size="large">
              {employee.workModes.map((mode, index) => (
                <Option key={index} value={mode.mode}>
                  {mode.mode} - ¥{mode.price}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="projectTitle"
            label="项目标题"
            rules={[{ required: true, message: '请输入项目标题' }]}
          >
            <Input placeholder="请输入项目标题" size="large" />
          </Form.Item>

          <Form.Item
            name="projectDescription"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述您的项目需求、目标和期望..."
              size="large"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="预算范围"
                rules={[{ required: true, message: '请输入预算' }]}
              >
                <InputNumber
                  placeholder="预算金额"
                  size="large"
                  style={{ width: '100%' }}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deadline"
                label="期望完成时间"
                rules={[{ required: true, message: '请选择完成时间' }]}
              >
                <DatePicker
                  placeholder="选择日期"
                  size="large"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="contactInfo"
            label="联系方式"
            rules={[{ required: true, message: '请输入联系方式' }]}
          >
            <Input placeholder="请输入您的手机号或邮箱" size="large" />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button type="default" onClick={() => setHireModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" className="submit-btn">
              提交聘用申请
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 联系模态框 */}
      <Modal
        title="联系 AI员工"
        open={contactModalVisible}
        onCancel={() => setContactModalVisible(false)}
        footer={null}
        width={500}
        className="contact-modal"
      >
        <Form
          form={contactForm}
          layout="vertical"
          onFinish={handleContact}
          className="contact-form"
        >
          <Form.Item
            name="subject"
            label="主题"
            rules={[{ required: true, message: '请输入消息主题' }]}
          >
            <Input placeholder="请输入消息主题" size="large" />
          </Form.Item>

          <Form.Item
            name="message"
            label="消息内容"
            rules={[{ required: true, message: '请输入消息内容' }]}
          >
            <TextArea
              rows={6}
              placeholder="请输入您想要咨询或沟通的内容..."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="contactMethod"
            label="联系方式"
            rules={[{ required: true, message: '请输入联系方式' }]}
          >
            <Input placeholder="请输入您的手机号或邮箱，以便员工回复" size="large" />
          </Form.Item>

          <Form.Item className="form-actions">
            <Button type="default" onClick={() => setContactModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" className="submit-btn">
              发送消息
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 确认聘用弹窗 */}
      <Modal
        title="确认聘用"
        open={confirmHireVisible}
        onCancel={() => setConfirmHireVisible(false)}
        footer={null}
        width={500}
        className="confirm-hire-modal"
      >
        {hiringData && (
          <div className="confirm-hire-content">
            <div className="confirm-hire-header">
              <Avatar size={64} src={hiringData.employeeAvatar}>
                {hiringData.employeeName.charAt(0)}
              </Avatar>
              <div className="confirm-hire-employee">
                <h3>{hiringData.employeeName}</h3>
                <Tag color="blue">{hiringData.employeeCategory}</Tag>
              </div>
            </div>
            
            <Divider />
            
            <div className="confirm-hire-details">
              <div className="confirm-detail-item">
                <span className="detail-label">聘用方式:</span>
                <span className="detail-value">{hiringData.workMode}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">项目标题:</span>
                <span className="detail-value">{hiringData.projectTitle}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">价格:</span>
                <span className="detail-value price">¥{hiringData.price}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">预算:</span>
                <span className="detail-value">¥{hiringData.budget}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">期望完成时间:</span>
                <span className="detail-value">{hiringData.deadline}</span>
              </div>
            </div>
            
            <div className="confirm-hire-description">
              <h4>项目描述:</h4>
              <p>{hiringData.projectDescription}</p>
            </div>
            
            <Divider />
            
            <div className="confirm-hire-actions">
              <Button type="default" onClick={() => setConfirmHireVisible(false)}>
                取消
              </Button>
              <Button type="primary" onClick={confirmHire} className="confirm-btn">
                确认聘用
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeDetailPage;