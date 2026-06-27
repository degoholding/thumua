import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Divider, Form, Input, message } from 'antd';
import { UserOutlined, SafetyCertificateOutlined, ShoppingCartOutlined, CarOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const CLIENT_ID = '692103387453-062rkmq1cinfhqerd9hn6bj3omfq18h8.apps.googleusercontent.com';

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: handleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-login-button"),
          { theme: "outline", size: "large", width: "100%", text: "continue_with" }
        );
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }
  }, []);

  const handleCredentialResponse = (response) => {
    // Decode JWT token (basic parsing for demo purposes)
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      
      message.success(`Đăng nhập Google thành công: ${payload.name}`);
      // Dùng email phần đầu làm username hoặc truyền nguyên email
      onLogin(payload.email.split('@')[0]);
    } catch (e) {
      message.error("Đăng nhập Google thất bại!");
    }
  };

  const handleManualLogin = (values) => {
    if (values.username === 'admin' && values.password === 'admin') {
      message.success('Đăng nhập thành công!');
      onLogin('admin');
    } else {
      message.error('Sai tên đăng nhập hoặc mật khẩu (Thử admin/admin)');
    }
  };

  const handleQuickLogin = (roleName) => {
    setLoading(roleName);
    setTimeout(() => {
      onLogin(roleName);
    }, 500);
  };

  return (
    <div className="login-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ maxWidth: '450px', width: '100%', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', background: '#0f172a', borderRadius: '12px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>D</span>
          </div>
          <Title level={2} style={{ margin: 0, color: '#0f172a' }}>DEGO Thu Mua</Title>
          <Paragraph style={{ color: '#64748b', marginTop: '8px' }}>
            Đăng nhập để quản lý mua hàng
          </Paragraph>
        </div>

        <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          {/* Form đăng nhập thủ công */}
          <Form form={form} layout="vertical" onFinish={handleManualLogin}>
            <Form.Item 
              name="username" 
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input size="large" prefix={<UserOutlined />} placeholder="Tên đăng nhập (admin)" />
            </Form.Item>
            <Form.Item 
              name="password" 
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="Mật khẩu (admin)" />
            </Form.Item>
            <Form.Item style={{ marginBottom: '16px' }}>
              <Button type="primary" htmlType="submit" size="large" block style={{ background: '#0f172a' }}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          {/* Google Login Button Container */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div id="google-login-button" style={{ width: '100%' }}></div>
          </div>

          <Divider style={{ color: '#94a3b8', fontSize: '12px' }}>Hoặc đăng nhập nhanh để test</Divider>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button 
              block 
              size="large" 
              type="default"
              icon={<UserOutlined style={{ color: '#0ea5e9' }} />}
              onClick={() => handleQuickLogin('user')}
              loading={loading === 'user'}
              style={{ textAlign: 'left', height: 'auto', padding: '12px 20px', borderRadius: '12px' }}
            >
              <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#334155' }}>Nhân viên (User)</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Người ra yêu cầu thu mua</div>
              </div>
            </Button>

            <Button 
              block 
              size="large" 
              type="default"
              icon={<SafetyCertificateOutlined style={{ color: '#10b981' }} />}
              onClick={() => handleQuickLogin('manager')}
              loading={loading === 'manager'}
              style={{ textAlign: 'left', height: 'auto', padding: '12px 20px', borderRadius: '12px' }}
            >
              <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#334155' }}>Trưởng bộ phận (Manager)</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Người duyệt, hủy yêu cầu</div>
              </div>
            </Button>

            <Button 
              block 
              size="large" 
              type="default"
              icon={<ShoppingCartOutlined style={{ color: '#8b5cf6' }} />}
              onClick={() => handleQuickLogin('purchase_manager')}
              loading={loading === 'purchase_manager'}
              style={{ textAlign: 'left', height: 'auto', padding: '12px 20px', borderRadius: '12px' }}
            >
              <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#334155' }}>Quản lý Thu mua</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Phân bổ cho team thu mua</div>
              </div>
            </Button>

            <Button 
              block 
              size="large" 
              type="default"
              icon={<CarOutlined style={{ color: '#f59e0b' }} />}
              onClick={() => handleQuickLogin('purchaser')}
              loading={loading === 'purchaser'}
              style={{ textAlign: 'left', height: 'auto', padding: '12px 20px', borderRadius: '12px' }}
            >
              <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#334155' }}>Nhân sự Thu mua</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Khảo sát, mua hàng</div>
              </div>
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Login;
