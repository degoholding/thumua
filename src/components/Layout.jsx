import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ClipboardList, Search, CheckCircle, Package, Truck, 
  CreditCard, BookOpen, AlertTriangle, FileText, 
  Repeat, BarChart2, Building2, Users, Folder, Shield, ShoppingCart, Store 
} from 'lucide-react';
import { Menu, Dropdown, Avatar, message, Select, Modal, Input, Button } from 'antd';
import { mockUsers } from '../data';

const Layout = ({ user, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('currentRole') || 'NSYC';
  });

  const handleRoleChange = (val) => {
    setCurrentRole(val);
    localStorage.setItem('currentRole', val);
    message.success(`Đã chuyển sang vai trò: ${val}`);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={() => setIsProfileModalOpen(true)}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item key="2" onClick={() => message.info('Chức năng đổi mật khẩu đang được phát triển.')}>
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={handleLogout} danger>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
        <div className="sidebar-header" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/logo.svg" alt="DEGO Logo" style={{ height: '32px', maxWidth: '100%' }} />
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-group">
            <ul className="nav-list">
              <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <BarChart2 className="nav-icon" size={18} /> {!collapsed && "Dashboard"}
              </NavLink>
            </ul>
          </div>
          
          <div className="nav-group">
            {!collapsed && <div className="nav-group-title">QUY TRÌNH THU MUA</div>}
            <ul className="nav-list">
              <NavLink to="/intake" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <ClipboardList className="nav-icon" size={18} /> {!collapsed && "PYC Thu Mua"}
              </NavLink>
              <NavLink to="/supplier-survey" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Search className="nav-icon" size={18} /> {!collapsed && "Khảo sát NCC"}
              </NavLink>
              <NavLink to="/product-survey" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Package className="nav-icon" size={18} /> {!collapsed && "Khảo sát Sản phẩm"}
              </NavLink>
              <NavLink to="/purchase-orders" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <ShoppingCart className="nav-icon" size={18} /> {!collapsed && "Đơn đặt hàng (PO)"}
              </NavLink>
            </ul>
          </div>

          <div className="nav-group">
            {!collapsed && <div className="nav-group-title">DANH MỤC</div>}
            <ul className="nav-list">
              <NavLink to="/suppliers" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Store className="nav-icon" size={18} /> {!collapsed && "Nhà cung cấp"}
              </NavLink>
              <NavLink to="/companies" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Building2 className="nav-icon" size={18} /> {!collapsed && "Công ty thành viên"}
              </NavLink>
              <NavLink to="/departments" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Folder className="nav-icon" size={18} /> {!collapsed && "Phòng ban"}
              </NavLink>
              <NavLink to="/users" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Users className="nav-icon" size={18} /> {!collapsed && "Người dùng"}
              </NavLink>
              <NavLink to="/roles" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Shield className="nav-icon" size={18} /> {!collapsed && "Vai trò"}
              </NavLink>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="btn-hamburger" onClick={() => setCollapsed(!collapsed)}>☰</button>
          </div>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Select 
              value={currentRole} 
              onChange={handleRoleChange} 
              style={{ width: 160 }}
              options={[
                { value: 'NSYC', label: 'NSYC (Người tạo)' },
                { value: 'TBP', label: 'Trưởng Bộ Phận' },
                { value: 'QLTM', label: 'Quản Lý Thu Mua' },
                { value: 'NSTM', label: 'Nhân Sự Thu Mua' },
                { value: 'Admin', label: 'Administrator' }
              ]}
            />
            <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', transition: '0.2s', _hover: { backgroundColor: '#f1f5f9' } }}>
                <Avatar style={{ backgroundColor: '#0098db' }}>{user ? user.charAt(0).toUpperCase() : 'A'}</Avatar>
                <span className="user-info">{user || 'Admin'}</span>
              </div>
            </Dropdown>
          </div>
        </header>
        
        {/* Render child routes with role context */}
        <Outlet context={{ currentRole, currentUser: user }} />
      </main>

      <Modal
        title="Thông tin cá nhân"
        open={isProfileModalOpen}
        onCancel={() => setIsProfileModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsProfileModalOpen(false)}>Đóng</Button>
        ]}
      >
        <div style={{ padding: '10px 0' }}>
          <p style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <strong style={{ width: '100px' }}>Họ tên:</strong> 
            <span>{user || 'Administrator'}</span>
          </p>
          <p style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <strong style={{ width: '100px' }}>Email:</strong> 
            <Input value={`${user || 'admin'}@degoholding.com`} readOnly disabled style={{ width: '250px' }} />
          </p>
          <p style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <strong style={{ width: '100px' }}>SĐT:</strong> 
            <Input defaultValue="0987654321" style={{ width: '250px' }} />
          </p>
          <p style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <strong style={{ width: '100px' }}>Phòng ban:</strong> 
            <Input value="Phòng Thu Mua" readOnly disabled style={{ width: '250px' }} />
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Layout;
