import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="page-content" style={{ display: 'block' }}>
      <div className="page-header">
        <div className="header-titles">
          <h2 className="page-title">Dashboard Quản trị</h2>
          <p className="page-subtitle">Tổng quan hệ thống và truy cập nhanh các module.</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div 
          style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', transition: '0.2s' }} 
          onClick={() => navigate('/suppliers')}
        >
          <div style={{ fontSize: '32px', marginBottom: '15px' }}>🏢</div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Nhà cung cấp</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Quản lý và đánh giá danh sách các nhà cung cấp vật tư, dịch vụ.</p>
        </div>
        
        <div 
          style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', transition: '0.2s' }} 
          onClick={() => navigate('/companies')}
        >
          <div style={{ fontSize: '32px', marginBottom: '15px' }}>🏢</div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Công ty thành viên</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Quản lý danh sách và thông tin các công ty thành viên trong hệ thống.</p>
        </div>
        
        <div 
          style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', transition: '0.2s' }} 
          onClick={() => navigate('/users')}
        >
          <div style={{ fontSize: '32px', marginBottom: '15px' }}>👥</div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Người dùng</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Quản lý nhân sự, phân bổ phòng ban và cấp quyền truy cập hệ thống.</p>
        </div>

        <div 
          style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', transition: '0.2s' }} 
          onClick={() => navigate('/departments')}
        >
          <div style={{ fontSize: '32px', marginBottom: '15px' }}>📁</div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Phòng ban</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Danh sách phòng ban và trưởng bộ phận (tự động trích xuất).</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
