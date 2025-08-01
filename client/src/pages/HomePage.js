import React from 'react';
import { Card, Button, Row, Col, Typography, Avatar, Rate, Tag, Carousel } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  RightOutlined,
  StarFilled,
  TeamOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import './HomePage.css';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  // 精选AI员工数据
  const featuredEmployees = [
    {
      id: 1,
      name: 'AI设计师小美',
      category: 'UI设计师',
      avatar: '/images/avatar1.jpg',
      rating: 4.9,
      price: 299,
      skills: ['UI设计', 'UX设计', '原型设计'],
      description: '专业UI/UX设计师，擅长现代化界面设计',
      isNew: true
    },
    {
      id: 2,
      name: 'AI数据分析师',
      category: '数据分析师',
      avatar: '/images/avatar2.jpg',
      rating: 4.8,
      price: 399,
      skills: ['数据分析', 'Python', 'SQL'],
      description: '资深数据分析专家，精通各种分析工具',
      isHot: true
    },
    {
      id: 3,
      name: 'AI营销专家',
      category: '内容营销专家',
      avatar: '/images/avatar3.jpg',
      rating: 4.7,
      price: 199,
      skills: ['内容营销', '社媒运营', 'SEO'],
      description: '创意营销策划，助力品牌增长',
      isNew: false
    },
    {
      id: 4,
      name: 'AI前端工程师',
      category: '前端开发者',
      avatar: '/images/avatar4.jpg',
      rating: 4.9,
      price: 499,
      skills: ['React', 'Vue', 'JavaScript'],
      description: '全栈开发专家，技术实力强劲',
      isHot: true
    }
  ];

  // 平台特色数据
  const features = [
    {
      icon: <TeamOutlined style={{ fontSize: 32, color: '#6366f1' }} />,
      title: '专业AI团队',
      description: '汇聚各行业顶尖AI专家，为您提供专业服务'
    },
    {
      icon: <TrophyOutlined style={{ fontSize: 32, color: '#10b981' }} />,
      title: '品质保证',
      description: '严格筛选，确保每位AI员工都具备专业能力'
    },
    {
      icon: <ClockCircleOutlined style={{ fontSize: 32, color: '#f59e0b' }} />,
      title: '24小时服务',
      description: 'AI员工全天候在线，随时响应您的需求'
    }
  ];

  // 用户评价数据
  const testimonials = [
    {
      name: '张总',
      company: '科技公司CEO',
      avatar: '/images/user1.jpg',
      rating: 5,
      comment: 'AI设计师的工作效率和质量都超出了我的预期，强烈推荐！'
    },
    {
      name: '李经理',
      company: '电商运营',
      avatar: '/images/user2.jpg',
      rating: 5,
      comment: 'AI营销专家帮我们制定的策略效果显著，ROI提升了300%。'
    },
    {
      name: '王主管',
      company: '数据部门',
      avatar: '/images/user3.jpg',
      rating: 5,
      comment: 'AI数据分析师的专业能力让我们的决策更加精准。'
    }
  ];

  const handleEmployeeClick = (id) => {
    navigate(`/employee/${id}`);
  };

  const handleBrowseAll = () => {
    navigate('/browse');
  };

  return (
    <div className="home-page">
      {/* 英雄区域 */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <Title level={1} className="hero-title">
              找到完美的
              <span className="gradient-text">AI员工</span>
            </Title>
            <Paragraph className="hero-description">
              汇聚全球顶尖AI专家，为您的企业提供专业、高效的智能服务解决方案
            </Paragraph>
            <div className="hero-actions">
              <Button 
                type="primary" 
                size="large" 
                onClick={handleBrowseAll}
                className="cta-button"
              >
                开始寻找
                <RightOutlined />
              </Button>
              <Button size="large" className="secondary-button">
                了解更多
              </Button>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-cards">
              <Card className="floating-card card-1">
                <Avatar icon={<UserOutlined />} />
                <Text>AI设计师</Text>
              </Card>
              <Card className="floating-card card-2">
                <Avatar icon={<UserOutlined />} />
                <Text>AI开发者</Text>
              </Card>
              <Card className="floating-card card-3">
                <Avatar icon={<UserOutlined />} />
                <Text>AI分析师</Text>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 平台特色 */}
      <section className="features-section">
        <div className="section-header">
          <Title level={2}>为什么选择我们</Title>
          <Paragraph>专业的AI员工平台，为您提供最优质的服务体验</Paragraph>
        </div>
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card className="feature-card" hoverable>
                <div className="feature-icon">{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 精选推荐 */}
      <section className="featured-section">
        <div className="section-header">
          <Title level={2}>精选推荐</Title>
          <Paragraph>为您精心挑选的优质AI员工</Paragraph>
          <Button type="link" onClick={handleBrowseAll}>
            查看全部 <RightOutlined />
          </Button>
        </div>
        
        <Row gutter={[24, 24]}>
          {featuredEmployees.map((employee) => (
            <Col xs={24} sm={12} lg={6} key={employee.id}>
              <Card 
                className="employee-card"
                hoverable
                onClick={() => handleEmployeeClick(employee.id)}
                cover={
                  <div className="employee-avatar-container">
                    <Avatar 
                      size={80} 
                      src={employee.avatar}
                      icon={<UserOutlined />}
                    />
                    {employee.isNew && <Tag color="green" className="status-tag">新人</Tag>}
                    {employee.isHot && <Tag color="red" className="status-tag">热门</Tag>}
                  </div>
                }
              >
                <div className="employee-info">
                  <Title level={5}>{employee.name}</Title>
                  <Text type="secondary">{employee.category}</Text>
                  <div className="employee-rating">
                    <Rate disabled defaultValue={employee.rating} size="small" />
                    <Text className="rating-text">{employee.rating}</Text>
                  </div>
                  <div className="employee-skills">
                    {employee.skills.slice(0, 2).map((skill, index) => (
                      <Tag key={index} className="skill-tag">{skill}</Tag>
                    ))}
                  </div>
                  <div className="employee-price">
                    <Text strong>¥{employee.price}</Text>
                    <Text type="secondary">/天</Text>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 用户评价 */}
      <section className="testimonials-section">
        <div className="section-header">
          <Title level={2}>用户评价</Title>
          <Paragraph>听听我们用户的真实反馈</Paragraph>
        </div>
        
        <Carousel autoplay dots={{ className: 'testimonial-dots' }}>
          {testimonials.map((testimonial, index) => (
            <div key={index}>
              <Card className="testimonial-card">
                <div className="testimonial-content">
                  <Rate disabled defaultValue={testimonial.rating} />
                  <Paragraph className="testimonial-comment">
                    "{testimonial.comment}"
                  </Paragraph>
                  <div className="testimonial-author">
                    <Avatar src={testimonial.avatar} icon={<UserOutlined />} />
                    <div className="author-info">
                      <Text strong>{testimonial.name}</Text>
                      <Text type="secondary">{testimonial.company}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </Carousel>
      </section>

      {/* 行动召唤 */}
      <section className="cta-section">
        <Card className="cta-card">
          <div className="cta-content">
            <Title level={2}>准备开始了吗？</Title>
            <Paragraph>
              立即加入我们，体验AI员工带来的高效工作方式
            </Paragraph>
            <Button 
              type="primary" 
              size="large" 
              onClick={handleBrowseAll}
              className="cta-button"
            >
              立即开始
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;