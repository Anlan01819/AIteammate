import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Tag, Button, Select, DatePicker, Input, 
  Row, Col, Statistic, Progress, Rate, Modal, Form, 
  TextArea, message, Tabs, Badge, Avatar, Tooltip,
  Space, Divider, Empty, Result
} from 'antd';
import { 
  SearchOutlined, FilterOutlined, EyeOutlined, 
  MessageOutlined, StarOutlined, DownloadOutlined,
  CalendarOutlined, DollarOutlined, UserOutlined,
  TrophyOutlined, ClockCircleOutlined, CheckCircleOutlined,
  ExclamationCircleOutlined, CloseCircleOutlined, PlusOutlined
} from '@ant-design/icons';
import './RecordsPage.css';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TextArea: AntTextArea } = Input;

const RecordsPage = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: null,
    category: 'all',
    searchText: ''
  });
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reviewForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  // 模拟聘用记录数据
  const mockRecords = [
    {
      id: 1,
      employeeId: 1,
      employeeName: 'AI设计师小美',
      employeeAvatar: '/avatars/designer1.jpg',
      category: 'UI设计师',
      projectTitle: '电商APP界面设计',
      projectDescription: '为新电商平台设计完整的移动端界面，包括首页、商品详情、购物车、个人中心等核心页面',
      status: 'completed',
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      budget: 2999,
      actualCost: 2999,
      workMode: '按项目',
      rating: 5,
      review: '设计水平很高，沟通顺畅，按时交付。非常满意！',
      deliverables: ['设计稿文件', 'UI组件库', '设计规范文档'],
      progress: 100
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'AI数据分析师小智',
      employeeAvatar: '/avatars/analyst1.jpg',
      category: '数据分析师',
      projectTitle: '用户行为数据分析',
      projectDescription: '分析用户在平台上的行为数据，提供用户画像和优化建议',
      status: 'in_progress',
      startDate: '2024-01-20',
      endDate: '2024-02-05',
      budget: 1999,
      actualCost: 0,
      workMode: '按项目',
      rating: null,
      review: null,
      deliverables: ['数据分析报告', '用户画像', '优化建议'],
      progress: 65
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: 'AI内容营销专家小文',
      employeeAvatar: '/avatars/marketer1.jpg',
      category: '内容营销专家',
      projectTitle: '品牌内容策划',
      projectDescription: '为品牌制定内容营销策略，包括文案创作、社媒运营方案等',
      status: 'cancelled',
      startDate: '2024-01-15',
      endDate: '2024-01-30',
      budget: 1599,
      actualCost: 0,
      workMode: '按项目',
      rating: null,
      review: null,
      deliverables: ['内容策略方案', '文案素材', '运营计划'],
      progress: 20
    },
    {
      id: 4,
      employeeId: 4,
      employeeName: 'AI前端开发者小码',
      employeeAvatar: '/avatars/developer1.jpg',
      category: '前端开发者',
      projectTitle: '响应式网站开发',
      projectDescription: '开发企业官网，要求响应式设计，兼容各种设备',
      status: 'in_progress',
      startDate: '2024-01-25',
      endDate: '2024-02-15',
      budget: 4999,
      actualCost: 0,
      workMode: '按项目',
      rating: null,
      review: null,
      deliverables: ['网站源码', '部署文档', '使用说明'],
      progress: 30
    }
  ];

  // 统计数据
  const stats = {
    totalHires: mockRecords.length,
    totalSpent: mockRecords.reduce((sum, record) => sum + record.actualCost, 0),
    activeProjects: mockRecords.filter(r => r.status === 'in_progress').length,
    averageRating: mockRecords.filter(r => r.rating).reduce((sum, r) => sum + r.rating, 0) / mockRecords.filter(r => r.rating).length || 0
  };

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [records, filters, activeTab]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        setRecords(mockRecords);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('加载记录失败:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...records];

    // 按标签页筛选
    if (activeTab !== 'all') {
      filtered = filtered.filter(record => record.status === activeTab);
    }

    // 按状态筛选
    if (filters.status !== 'all') {
      filtered = filtered.filter(record => record.status === filters.status);
    }

    // 按类别筛选
    if (filters.category !== 'all') {
      filtered = filtered.filter(record => record.category === filters.category);
    }

    // 按搜索文本筛选
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(record => 
        record.employeeName.toLowerCase().includes(searchLower) ||
        record.projectTitle.toLowerCase().includes(searchLower) ||
        record.category.toLowerCase().includes(searchLower)
      );
    }

    // 按日期范围筛选
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.startDate);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    setFilteredRecords(filtered);
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: { color: 'success', text: '已完成', icon: <CheckCircleOutlined /> },
      in_progress: { color: 'processing', text: '进行中', icon: <ClockCircleOutlined /> },
      cancelled: { color: 'error', text: '已取消', icon: <CloseCircleOutlined /> },
      pending: { color: 'warning', text: '待开始', icon: <ExclamationCircleOutlined /> }
    };
    return configs[status] || configs.pending;
  };

  const handleReview = (record) => {
    setSelectedRecord(record);
    setReviewModalVisible(true);
  };

  const submitReview = async (values) => {
    try {
      console.log('提交评价:', values);
      message.success('评价提交成功！');
      setReviewModalVisible(false);
      reviewForm.resetFields();
      // 更新记录状态
      const updatedRecords = records.map(record => 
        record.id === selectedRecord.id 
          ? { ...record, rating: values.rating, review: values.review }
          : record
      );
      setRecords(updatedRecords);
    } catch (error) {
      message.error('提交失败，请重试');
    }
  };

  const columns = [
    {
      title: 'AI员工',
      dataIndex: 'employeeName',
      key: 'employee',
      width: 200,
      render: (text, record) => (
        <div className="employee-cell">
          <Avatar src={record.employeeAvatar} size={40}>
            {text.charAt(0)}
          </Avatar>
          <div className="employee-info">
            <div className="employee-name">{text}</div>
            <div className="employee-category">{record.category}</div>
          </div>
        </div>
      ),
    },
    {
      title: '项目信息',
      dataIndex: 'projectTitle',
      key: 'project',
      render: (text, record) => (
        <div className="project-cell">
          <div className="project-title">{text}</div>
          <div className="project-desc">{record.projectDescription}</div>
          <div className="project-meta">
            <Tag>{record.workMode}</Tag>
            <span className="project-budget">预算: ¥{record.budget}</span>
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => {
        const config = getStatusConfig(status);
        return (
          <div className="status-cell">
            <Tag color={config.color} icon={config.icon}>
              {config.text}
            </Tag>
            {status === 'in_progress' && (
              <Progress 
                percent={record.progress} 
                size="small" 
                showInfo={false}
                className="progress-bar"
              />
            )}
          </div>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'startDate',
      key: 'date',
      width: 150,
      render: (startDate, record) => (
        <div className="date-cell">
          <div className="date-item">
            <CalendarOutlined className="date-icon" />
            <span>开始: {startDate}</span>
          </div>
          <div className="date-item">
            <CalendarOutlined className="date-icon" />
            <span>结束: {record.endDate}</span>
          </div>
        </div>
      ),
    },
    {
      title: '评价',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating, record) => (
        <div className="rating-cell">
          {rating ? (
            <div>
              <Rate disabled defaultValue={rating} size="small" />
              <div className="rating-text">{rating}.0</div>
            </div>
          ) : (
            record.status === 'completed' ? (
              <Button 
                type="link" 
                size="small"
                onClick={() => handleReview(record)}
              >
                去评价
              </Button>
            ) : (
              <span className="no-rating">-</span>
            )
          )}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => window.open(`/employee/${record.employeeId}`, '_blank')}
            />
          </Tooltip>
          <Tooltip title="联系沟通">
            <Button 
              type="text" 
              icon={<MessageOutlined />} 
              size="small"
            />
          </Tooltip>
          {record.status === 'completed' && (
            <Tooltip title="下载交付物">
              <Button 
                type="text" 
                icon={<DownloadOutlined />} 
                size="small"
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const tabCounts = {
    all: records.length,
    in_progress: records.filter(r => r.status === 'in_progress').length,
    completed: records.filter(r => r.status === 'completed').length,
    cancelled: records.filter(r => r.status === 'cancelled').length
  };

  return (
    <div className="records-page">
      <div className="records-container">
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">聘用记录</h1>
            <p className="page-description">查看和管理您的AI员工聘用历史</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => window.open('/browse', '_blank')}
          >
            添加聘用
          </Button>
        </div>

        {/* 统计卡片 */}
        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="累计聘用次数"
                value={stats.totalHires}
                suffix="次"
                prefix={<TrophyOutlined className="stat-icon" />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="总支出"
                value={stats.totalSpent}
                precision={0}
                prefix={<DollarOutlined className="stat-icon" />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="当前在岗数量"
                value={stats.activeProjects}
                suffix="个"
                prefix={<UserOutlined className="stat-icon" />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="平均评分值"
                value={stats.averageRating}
                precision={1}
                suffix="分"
                prefix={<StarOutlined className="stat-icon" />}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 筛选器 */}
        <Card className="filter-card">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="搜索员工或项目"
                prefix={<SearchOutlined />}
                value={filters.searchText}
                onChange={(e) => setFilters({...filters, searchText: e.target.value})}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="选择状态"
                value={filters.status}
                onChange={(value) => setFilters({...filters, status: value})}
                style={{ width: '100%' }}
              >
                <Option value="all">全部状态</Option>
                <Option value="in_progress">进行中</Option>
                <Option value="completed">已完成</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="选择类别"
                value={filters.category}
                onChange={(value) => setFilters({...filters, category: value})}
                style={{ width: '100%' }}
              >
                <Option value="all">全部类别</Option>
                <Option value="UI设计师">UI设计师</Option>
                <Option value="数据分析师">数据分析师</Option>
                <Option value="内容营销专家">内容营销专家</Option>
                <Option value="前端开发者">前端开发者</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                placeholder={['开始日期', '结束日期']}
                value={filters.dateRange}
                onChange={(dates) => setFilters({...filters, dateRange: dates})}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setFilters({
                  status: 'all',
                  dateRange: null,
                  category: 'all',
                  searchText: ''
                })}
                style={{ width: '100%' }}
              >
                重置筛选
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 记录列表 */}
        <Card className="records-card">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="records-tabs"
          >
            <TabPane 
              tab={<Badge count={tabCounts.all} showZero><span>全部记录</span></Badge>} 
              key="all" 
            />
            <TabPane 
              tab={<Badge count={tabCounts.in_progress} showZero><span>进行中</span></Badge>} 
              key="in_progress" 
            />
            <TabPane 
              tab={<Badge count={tabCounts.completed} showZero><span>已完成</span></Badge>} 
              key="completed" 
            />
            <TabPane 
              tab={<Badge count={tabCounts.cancelled} showZero><span>已取消</span></Badge>} 
              key="cancelled" 
            />
          </Tabs>

          <Table
            columns={columns}
            dataSource={filteredRecords}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredRecords.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无聘用记录"
                />
              )
            }}
            className="records-table"
          />
        </Card>
      </div>

      {/* 评价模态框 */}
      <Modal
        title="评价 AI员工"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
        width={600}
        className="review-modal"
      >
        {selectedRecord && (
          <div>
            <div className="review-employee-info">
              <Avatar src={selectedRecord.employeeAvatar} size={60}>
                {selectedRecord.employeeName.charAt(0)}
              </Avatar>
              <div className="review-employee-details">
                <h3>{selectedRecord.employeeName}</h3>
                <p>{selectedRecord.category}</p>
                <p className="project-title">{selectedRecord.projectTitle}</p>
              </div>
            </div>

            <Divider />

            <Form
              form={reviewForm}
              layout="vertical"
              onFinish={submitReview}
              className="review-form"
            >
              <Form.Item
                name="rating"
                label="整体评分"
                rules={[{ required: true, message: '请给出评分' }]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item
                name="review"
                label="评价内容"
                rules={[{ required: true, message: '请输入评价内容' }]}
              >
                <AntTextArea
                  rows={4}
                  placeholder="请分享您对这次合作的感受和建议..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Form.Item className="form-actions">
                <Button type="default" onClick={() => setReviewModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" className="submit-btn">
                  提交评价
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RecordsPage;