import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Badge, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  TeamOutlined,
  HistoryOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

const { Header, Content, Sider } = AntLayout;

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 导航菜单项
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/browse',
      icon: <TeamOutlined />,
      label: '选择员工',
    },
    {
      key: '/records',
      icon: <HistoryOutlined />,
      label: '聘用记录',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: '我的',
    },
  ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setMobileMenuVisible(false);
  };

  return (
    <AntLayout className="layout-container">
      {/* 桌面端侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="layout-sider desktop-only"
        width={240}
        collapsedWidth={80}
      >
        <div className="logo-container">
          <div className="logo">
            {collapsed ? 'AI' : 'AI职场精灵'}
          </div>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          className="sidebar-menu"
        />
      </Sider>

      <AntLayout>
        {/* 顶部导航栏 */}
        <Header className="layout-header">
          <div className="header-left">
            {/* 移动端菜单按钮 */}
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(!mobileMenuVisible)}
              className="mobile-menu-btn mobile-only"
            />
            
            {/* 移动端Logo */}
            <div className="mobile-logo mobile-only">
              AI职场精灵
            </div>
            
            {/* 搜索框 */}
            <div className="search-container desktop-only">
              <SearchOutlined className="search-icon" />
              <input
                type="text"
                placeholder="搜索AI员工..."
                className="search-input"
              />
            </div>
          </div>

          <div className="header-right">
            {/* 通知铃铛 */}
            <Badge count={3} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="notification-btn"
              />
            </Badge>

            {/* 用户头像和下拉菜单 */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="user-info">
                <Avatar
                  src={user?.avatar_url}
                  icon={<UserOutlined />}
                  size={32}
                />
                <span className="username desktop-only">
                  {user?.username || '用户'}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 移动端导航菜单 */}
        {mobileMenuVisible && (
          <div className="mobile-menu mobile-only">
            <Menu
              mode="vertical"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </div>
        )}

        {/* 主要内容区域 */}
        <Content className="layout-content">
          <div className="content-wrapper">
            {children}
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;