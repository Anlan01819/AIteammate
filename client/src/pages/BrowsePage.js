import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Input, Select, Button, Tag, Pagination, Spin, Rate, Avatar } from 'antd';
import { SearchOutlined, FilterOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './BrowsePage.css';

const { Search } = Input;
const { Option } = Select;

const BrowsePage = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    workMode: 'all',
    skills: [],
    searchTerm: ''
  });
  const [favorites, setFavorites] = useState(new Set());

  // 模拟数据
  const mockEmployees = [
    {
      id: 1,
      name: 'AI设计师小美',
      avatar: '/avatars/designer1.jpg',
      category: 'UI设计师',
      categoryEn: 'ui-designer',
      price: 299,
      rating: 4.9,
      reviewCount: 128,
      skills: ['UI设计', 'UX设计', 'Figma', 'Sketch'],
      description: '专业UI/UX设计师，擅长现代化界面设计和用户体验优化',
      workMode: '按项目',
      experience: '3年+',
      completedProjects: 156,
      responseTime: '1小时内',
      isOnline: true,
      badge: '新人'
    },
    {
      id: 2,
      name: 'AI数据分析师小智',
      avatar: '/avatars/analyst1.jpg',
      category: '数据分析师',
      categoryEn: 'data-analyst',
      price: 399,
      rating: 4.8,
      reviewCount: 89,
      skills: ['Python', 'SQL', '数据可视化', '机器学习'],
      description: '资深数据分析师，精通各种数据分析工具和算法',
      workMode: '按小时',
      experience: '5年+',
      completedProjects: 203,
      responseTime: '30分钟内',
      isOnline: true,
      badge: '热门'
    },
    {
      id: 3,
      name: 'AI营销专家小王',
      avatar: '/avatars/marketer1.jpg',
      category: '内容营销专家',
      categoryEn: 'content-marketer',
      price: 199,
      rating: 4.7,
      reviewCount: 156,
      skills: ['内容策划', '社媒运营', 'SEO', '文案撰写'],
      description: '专业内容营销专家，帮助企业提升品牌影响力',
      workMode: '按月',
      experience: '4年+',
      completedProjects: 89,
      responseTime: '2小时内',
      isOnline: false,
      badge: null
    },
    {
      id: 4,
      name: 'AI前端开发小李',
      avatar: '/avatars/developer1.jpg',
      category: '前端开发者',
      categoryEn: 'frontend-developer',
      price: 499,
      rating: 4.9,
      reviewCount: 234,
      skills: ['React', 'Vue', 'JavaScript', 'TypeScript'],
      description: '全栈前端开发工程师，精通现代前端技术栈',
      workMode: '按项目',
      experience: '6年+',
      completedProjects: 312,
      responseTime: '1小时内',
      isOnline: true,
      badge: '专家'
    },
    // 更多模拟数据...
  ];

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, filters]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        setEmployees(mockEmployees);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('加载员工数据失败:', error);
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    // 按类别筛选
    if (filters.category !== 'all') {
      filtered = filtered.filter(emp => emp.categoryEn === filters.category);
    }

    // 按价格筛选
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(emp => {
        if (max) {
          return emp.price >= min && emp.price <= max;
        } else {
          return emp.price >= min;
        }
      });
    }

    // 按工作模式筛选
    if (filters.workMode !== 'all') {
      filtered = filtered.filter(emp => emp.workMode === filters.workMode);
    }

    // 按搜索词筛选
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(term) ||
        emp.category.toLowerCase().includes(term) ||
        emp.skills.some(skill => skill.toLowerCase().includes(term)) ||
        emp.description.toLowerCase().includes(term)
      );
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (value) => {
    handleFilterChange('searchTerm', value);
  };

  const toggleFavorite = (employeeId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(employeeId)) {
      newFavorites.delete(employeeId);
    } else {
      newFavorites.add(employeeId);
    }
    setFavorites(newFavorites);
  };

  const getPaginatedEmployees = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredEmployees.slice(startIndex, endIndex);
  };

  const renderEmployeeCard = (employee) => (
    <Col xs={24} sm={12} lg={8} xl={6} key={employee.id}>
      <Card
        className="employee-card"
        hoverable
        cover={
          <div className="card-cover">
            <Avatar
              size={80}
              src={employee.avatar}
              className="employee-avatar"
            >
              {employee.name.charAt(0)}
            </Avatar>
            <div className="online-status">
              <div className={`status-dot ${employee.isOnline ? 'online' : 'offline'}`} />
              <span className="status-text">
                {employee.isOnline ? '在线' : '离线'}
              </span>
            </div>
            {employee.badge && (
              <Tag className={`employee-badge ${employee.badge}`}>
                {employee.badge}
              </Tag>
            )}
          </div>
        }
        actions={[
          <Button
            type="text"
            icon={favorites.has(employee.id) ? <HeartFilled /> : <HeartOutlined />}
            onClick={() => toggleFavorite(employee.id)}
            className={`favorite-btn ${favorites.has(employee.id) ? 'favorited' : ''}`}
          >
            收藏
          </Button>,
          <Link to={`/employee/${employee.id}`}>
            <Button type="primary" size="small">
              查看详情
            </Button>
          </Link>
        ]}
      >
        <div className="card-content">
          <div className="employee-header">
            <h3 className="employee-name">{employee.name}</h3>
            <div className="employee-rating">
              <Rate disabled defaultValue={employee.rating} allowHalf />
              <span className="rating-text">
                {employee.rating} ({employee.reviewCount})
              </span>
            </div>
          </div>

          <div className="employee-category">
            <Tag color="blue">{employee.category}</Tag>
          </div>

          <p className="employee-description">{employee.description}</p>

          <div className="employee-skills">
            {employee.skills.slice(0, 3).map(skill => (
              <Tag key={skill} className="skill-tag">{skill}</Tag>
            ))}
            {employee.skills.length > 3 && (
              <Tag className="more-skills">+{employee.skills.length - 3}</Tag>
            )}
          </div>

          <div className="employee-stats">
            <div className="stat-item">
              <span className="stat-label">经验:</span>
              <span className="stat-value">{employee.experience}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">项目:</span>
              <span className="stat-value">{employee.completedProjects}</span>
            </div>
          </div>

          <div className="employee-footer">
            <div className="price-info">
              <span className="price">¥{employee.price}</span>
              <span className="price-unit">/{employee.workMode}</span>
            </div>
            <div className="response-time">
              <span className="response-label">响应时间:</span>
              <span className="response-value">{employee.responseTime}</span>
            </div>
          </div>
        </div>
      </Card>
    </Col>
  );

  return (
    <div className="browse-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">选择AI员工</h1>
          <p className="page-subtitle">
            从{filteredEmployees.length}位专业AI员工中找到最适合您的合作伙伴
          </p>
        </div>
      </div>

      <div className="browse-container">
        {/* 搜索和筛选区域 */}
        <div className="filter-section">
          <div className="search-bar">
            <Search
              placeholder="搜索员工姓名、技能或描述..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              className="main-search"
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">类别:</label>
              <Select
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
                className="filter-select"
                placeholder="选择类别"
              >
                <Option value="all">全部类别</Option>
                <Option value="ui-designer">UI设计师</Option>
                <Option value="data-analyst">数据分析师</Option>
                <Option value="content-marketer">内容营销专家</Option>
                <Option value="frontend-developer">前端开发者</Option>
                <Option value="backend-developer">后端开发者</Option>
                <Option value="product-manager">产品经理</Option>
              </Select>
            </div>

            <div className="filter-group">
              <label className="filter-label">价格区间:</label>
              <Select
                value={filters.priceRange}
                onChange={(value) => handleFilterChange('priceRange', value)}
                className="filter-select"
                placeholder="选择价格区间"
              >
                <Option value="all">不限价格</Option>
                <Option value="0-200">¥0-200</Option>
                <Option value="200-400">¥200-400</Option>
                <Option value="400-600">¥400-600</Option>
                <Option value="600">¥600以上</Option>
              </Select>
            </div>

            <div className="filter-group">
              <label className="filter-label">工作模式:</label>
              <Select
                value={filters.workMode}
                onChange={(value) => handleFilterChange('workMode', value)}
                className="filter-select"
                placeholder="选择工作模式"
              >
                <Option value="all">全部模式</Option>
                <Option value="按小时">按小时</Option>
                <Option value="按项目">按项目</Option>
                <Option value="按月">按月</Option>
                <Option value="长期合作">长期合作</Option>
              </Select>
            </div>

            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilters({
                category: 'all',
                priceRange: 'all',
                workMode: 'all',
                skills: [],
                searchTerm: ''
              })}
              className="clear-filters-btn"
            >
              清除筛选
            </Button>
          </div>
        </div>

        {/* 员工列表 */}
        <div className="employees-section">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <p>正在加载AI员工信息...</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <span className="results-count">
                  找到 {filteredEmployees.length} 位AI员工
                </span>
                <div className="sort-controls">
                  <Select
                    defaultValue="rating"
                    className="sort-select"
                    placeholder="排序方式"
                  >
                    <Option value="rating">按评分排序</Option>
                    <Option value="price-low">价格从低到高</Option>
                    <Option value="price-high">价格从高到低</Option>
                    <Option value="experience">按经验排序</Option>
                    <Option value="projects">按项目数排序</Option>
                  </Select>
                </div>
              </div>

              <Row gutter={[24, 24]} className="employees-grid">
                {getPaginatedEmployees().map(renderEmployeeCard)}
              </Row>

              {filteredEmployees.length > pageSize && (
                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    total={filteredEmployees.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;