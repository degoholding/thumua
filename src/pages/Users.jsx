import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { defaultNhanSu, defaultDepartments } from '../data';

const Users = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('nhansuData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    }
    return defaultNhanSu;
  });

  const [departmentsData] = useState(() => {
    const saved = localStorage.getItem('departmentsData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    }
    return defaultDepartments;
  });

  const [rolesData] = useState(() => {
    const saved = localStorage.getItem('rolesData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    }
    return [
      { role: 'Nhân viên' },
      { role: 'Trưởng bộ phận' },
      { role: 'Quản lý thu mua' },
      { role: 'Nhân sự thu mua' },
      { role: 'Admin' }
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();

  const saveToStorage = (newData) => {
    setData(newData);
    localStorage.setItem('nhansuData', JSON.stringify(newData));
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record, index) => {
    setEditingRecord({ ...record, index });
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    saveToStorage(newData);
    message.success('Đã xóa người dùng');
  };

  const handleBatchDelete = () => {
    const newData = data.filter((_, index) => !selectedRowKeys.includes(index));
    saveToStorage(newData);
    setSelectedRowKeys([]);
    message.success(`Đã xóa ${selectedRowKeys.length} người dùng`);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newData = [...data];
      
      // Auto-assign manager based on department
      const deptInfo = departmentsData.find(d => d.dept === values.dept);
      const computedManager = deptInfo ? deptInfo.manager : '';
      
      const recordToSave = {
        ...values,
        manager: computedManager
      };

      if (editingRecord !== null) {
        newData[editingRecord.index] = recordToSave;
        message.success('Đã cập nhật thông tin người dùng');
      } else {
        newData.push(recordToSave);
        message.success('Đã thêm người dùng mới');
      }
      saveToStorage(newData);
      setIsModalOpen(false);
    });
  };

  const columns = [
    { title: 'Họ và Tên', dataIndex: 'name', key: 'name', render: t => <strong>{t}</strong> },
    { title: 'Phòng ban', dataIndex: 'dept', key: 'dept' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role', render: t => <span style={{ color: '#64748b' }}>{t || 'Nhân viên'}</span> },
    { title: 'Trưởng bộ phận', dataIndex: 'manager', key: 'manager' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Hành động', key: 'action', align: 'right',
      render: (_, record, index) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined style={{ color: '#0275d8' }}/>} onClick={() => handleEdit(record, index)} />
          <Popconfirm title="Xóa User này?" onConfirm={() => handleDelete(index)} okText="Đồng ý" cancelText="Hủy">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-content" style={{ display: 'block' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Nhân sự / Người dùng</h2>
          <p className="page-subtitle" style={{ margin: '5px 0 0 0' }}>Quản lý danh sách nhân sự và phân quyền duyệt PYC.</p>
        </div>
        <Space style={{ flexWrap: 'wrap' }}>
          {selectedRowKeys.length > 0 && (
            <Popconfirm title={`Xóa ${selectedRowKeys.length} người dùng đã chọn?`} onConfirm={handleBatchDelete} okText="Đồng ý" cancelText="Hủy">
              <Button danger icon={<DeleteOutlined />}>Xóa ({selectedRowKeys.length})</Button>
            </Popconfirm>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm Người dùng
          </Button>
        </Space>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflowX: 'auto' }}>
        <Table 
          rowSelection={rowSelection}
          columns={columns} 
          dataSource={data.map((item, i) => ({ ...item, key: i }))} 
          pagination={{ pageSize: 10 }} 
        />
      </div>

      <Modal title={editingRecord ? "Sửa Nhân sự" : "Thêm Nhân sự"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Họ và Tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="dept" label="Phòng ban">
            <Input placeholder="Nhập phòng ban..." />
          </Form.Item>
          <Form.Item name="role" label="Vai trò">
            <Select 
              placeholder="Chọn vai trò..." 
              options={rolesData.map(r => ({ label: r.role, value: r.role }))} 
              disabled={editingRecord && departmentsData.some(d => d.manager === editingRecord.name)}
            />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
          <Form.Item name="email" label="Email"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
