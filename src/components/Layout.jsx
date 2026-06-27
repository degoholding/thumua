import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  ClipboardList, Search, CheckCircle, Package, Truck, 
  CreditCard, BookOpen, AlertTriangle, FileText, 
  Repeat, BarChart2, Building2, Users, Folder, Shield 
} from 'lucide-react';

const Layout = ({ user, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <div className="logo-dot"></div>
          {!collapsed && <h1 className="logo-text">DEGO Thu Mua</h1>}
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-group">
            {!collapsed && <div className="nav-group-title">KHẢO SÁT</div>}
            <ul className="nav-list">
              <NavLink to="/intake" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <ClipboardList className="nav-icon" size={18} /> {!collapsed && "PYC Thu Mua"}
              </NavLink>
              <li className="nav-item">
                <Search className="nav-icon" size={18} /> {!collapsed && "Khảo sát NCC"}
              </li>
              <li className="nav-item">
                <CheckCircle className="nav-icon" size={18} /> {!collapsed && "Duyệt"}
              </li>
            </ul>
          </div>

          <div className="nav-group">
            {!collapsed && <div className="nav-group-title">QUẢN LÝ</div>}
            <ul className="nav-list">
              <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <BarChart2 className="nav-icon" size={18} /> {!collapsed && "Dashboard"}
              </NavLink>
              <NavLink to="/suppliers" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                <Building2 className="nav-icon" size={18} /> {!collapsed && "Nhà cung cấp"}
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
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="user-info">{user || 'Admin'}</span>
            <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
          </div>
        </header>
        
        {/* Render child routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
