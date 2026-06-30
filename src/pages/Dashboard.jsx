import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Statistic, Table, Tag, Button, Upload, message } from 'antd';
import { FileText, ShoppingCart, CheckSquare, XCircle, Search, ClipboardList, Download, Upload as UploadIcon } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPyc: 0,
    approvedPyc: 0,
    cancelledPyc: 0,
    totalNccSurveys: 0,
    totalProductSurveys: 0,
    totalPos: 0,
    recentPycs: []
  });

  useEffect(() => {
    // Đọc dữ liệu từ localStorage
    const pycData = JSON.parse(localStorage.getItem('pycData') || '[]');
    const supplierSurveys = JSON.parse(localStorage.getItem('supplierSurveyData') || '[]');
    const productSurveys = JSON.parse(localStorage.getItem('productSurveyData') || '[]');
    const poData = JSON.parse(localStorage.getItem('poData') || '[]');

    const approvedPyc = pycData.filter(p => p.status === 'Đã duyệt QLTM').length;
    const cancelledPyc = pycData.filter(p => p.status === 'Đã hủy').length;

    // Lấy 5 PYC mới nhất
    const recentPycs = [...pycData].reverse().slice(0, 5);

    setStats({
      totalPyc: pycData.length,
      approvedPyc,
      cancelledPyc,
      totalNccSurveys: supplierSurveys.length,
      totalProductSurveys: productSurveys.length,
      totalPos: poData.length,
      recentPycs
    });
  }, []);

  const handleExportData = () => {
    const keys = ['pycData', 'supplierSurveyData', 'productSurveyData', 'poData', 'nccData', 'donviData', 'usersData'];
    const backupData = {};
    keys.forEach(k => {
      backupData[k] = localStorage.getItem(k) || '[]';
    });
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thumua_backup_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success("Đã tải xuống file sao lưu dữ liệu!");
  };

  const handleImportData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target.result);
        Object.keys(backupData).forEach(k => {
          localStorage.setItem(k, backupData[k]);
        });
        message.success("Đã phục hồi dữ liệu thành công! Trang sẽ tải lại...");
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        message.error("File sao lưu không hợp lệ!");
      }
    };
    reader.readAsText(file);
    return false; // Prevent auto upload
  };

  const pycColumns = [
    { title: 'Mã PYC', dataIndex: 'pycCode', key: 'pycCode', render: t => <strong>{t}</strong> },
    { title: 'Bộ phận YC', dataIndex: 'bophan', key: 'bophan' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (st) => {
        let color = 'default';
        if (st === 'Chờ TBP duyệt') color = 'processing';
        if (st === 'Đã duyệt TBP') color = 'cyan';
        if (st === 'Đã duyệt QLTM') color = 'success';
        if (st === 'Đã hủy') color = 'error';
        return <Tag color={color}>{st}</Tag>;
      }
    }
  ];

  return (
    <div className="page-content" style={{ display: 'block' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="header-titles">
          <h2 className="page-title">Dashboard Thống Kê</h2>
          <p className="page-subtitle">Tổng quan tình hình xử lý yêu cầu thu mua và đơn hàng.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button icon={<Download size={16} />} onClick={handleExportData}>
            Sao lưu dữ liệu
          </Button>
          <Upload beforeUpload={handleImportData} showUploadList={false} accept=".json">
            <Button icon={<UploadIcon size={16} />} type="primary">
              Phục hồi dữ liệu
            </Button>
          </Upload>
        </div>
      </div>
      
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={6}>
          <div style={{ background: 'linear-gradient(135deg, #0098db 0%, #009ad1 100%)', padding: '24px', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 20px -10px rgba(0, 152, 219, 0.5)', height: '100%' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Tổng số Phiếu YC (PYC)</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalPyc}</div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Yêu cầu tạo</div>
              <FileText size={24} style={{ opacity: 0.3 }} />
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '24px', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 20px -10px rgba(16, 185, 129, 0.5)', height: '100%' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>PYC Đã duyệt (QLTM)</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.approvedPyc}</div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Đã duyệt</div>
              <CheckSquare size={24} style={{ opacity: 0.3 }} />
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', padding: '24px', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 20px -10px rgba(244, 63, 94, 0.5)', height: '100%' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>PYC Bị hủy</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.cancelledPyc}</div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Từ chối</div>
              <XCircle size={24} style={{ opacity: 0.3 }} />
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', padding: '24px', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 20px -10px rgba(139, 92, 246, 0.5)', height: '100%' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Đơn đặt hàng (PO)</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalPos}</div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Đang xử lý</div>
              <ShoppingCart size={24} style={{ opacity: 0.3 }} />
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={12}>
          <Card title="Thống kê Khảo sát" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Row>
              <Col span={12}>
                <Statistic title="Khảo sát Nhà cung cấp" value={stats.totalNccSurveys} prefix={<Search size={20} style={{ color: '#0d9488', marginRight: 8 }} />} />
              </Col>
              <Col span={12}>
                <Statistic title="Khảo sát Sản phẩm" value={stats.totalProductSurveys} prefix={<ClipboardList size={20} style={{ color: '#7c3aed', marginRight: 8 }} />} />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Phiếu YC mới nhất" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 0 }}>
            <Table 
              dataSource={stats.recentPycs}
              columns={pycColumns}
              pagination={false}
              size="small"
              rowKey="pycCode"
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '24px' }}>
        <h3>Truy cập nhanh Module</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '12px' }}>
          <div 
            style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: '0.2s' }} 
            onClick={() => navigate('/intake')}
          >
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📋</div>
            <h4 style={{ margin: 0 }}>Tiếp nhận PYC</h4>
          </div>
          <div 
            style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: '0.2s' }} 
            onClick={() => navigate('/supplier-survey')}
          >
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🏢</div>
            <h4 style={{ margin: 0 }}>Khảo sát NCC</h4>
          </div>
          <div 
            style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: '0.2s' }} 
            onClick={() => navigate('/product-survey')}
          >
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📦</div>
            <h4 style={{ margin: 0 }}>Khảo sát Sản phẩm</h4>
          </div>
          <div 
            style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', transition: '0.2s' }} 
            onClick={() => navigate('/purchase-orders')}
          >
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>🛒</div>
            <h4 style={{ margin: 0 }}>Đơn đặt hàng (PO)</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
