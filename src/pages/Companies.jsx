import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { defaultDonVi } from '../data';

const Companies = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('donviData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    }
    return defaultDonVi;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();

  const saveToStorage = (newData) => {
    setData(newData);
    localStorage.setItem('donviData', JSON.stringify(newData));
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
    message.success('Đã xóa Công ty');
  };

  const handleBatchDelete = () => {
    const newData = data.filter((_, index) => !selectedRowKeys.includes(index));
    saveToStorage(newData);
    setSelectedRowKeys([]);
    message.success(`Đã xóa ${selectedRowKeys.length} công ty`);
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
      if (editingRecord !== null) {
        newData[editingRecord.index] = values;
        message.success('Đã cập nhật công ty');
      } else {
        newData.push(values);
        message.success('Đã thêm công ty mới');
      }
      saveToStorage(newData);
      setIsModalOpen(false);
    });
  };

  const columns = [
    { title: 'Tên ngắn gọn', dataIndex: 'shortName', key: 'shortName', render: t => <strong>{t}</strong> },
    { title: 'Tên đầy đủ CTY', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'MST', dataIndex: 'mst', key: 'mst' },
    {
      title: 'Hành động', key: 'action', align: 'right',
      render: (_, record, index) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined style={{ color: '#0275d8' }}/>} onClick={() => handleEdit(record, index)} />
          <Popconfirm title="Xóa CTY này?" onConfirm={() => handleDelete(index)} okText="Đồng ý" cancelText="Hủy">
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
          <h2 className="page-title" style={{ margin: 0 }}>Công ty thành viên</h2>
          <p className="page-subtitle" style={{ margin: '5px 0 0 0' }}>Quản lý danh sách các công ty thành viên trong hệ thống.</p>
        </div>
        <Space style={{ flexWrap: 'wrap' }}>
          {selectedRowKeys.length > 0 && (
            <Popconfirm title={`Xóa ${selectedRowKeys.length} công ty đã chọn?`} onConfirm={handleBatchDelete} okText="Đồng ý" cancelText="Hủy">
              <Button danger icon={<DeleteOutlined />}>Xóa ({selectedRowKeys.length})</Button>
            </Popconfirm>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm Công ty
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

      <Modal title={editingRecord ? "Sửa Công ty" : "Thêm Công ty"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} okText="Lưu" cancelText="Hủy">
        <Form form={form} layout="vertical">
          <Form.Item name="shortName" label="Tên Đơn vị (Ngắn gọn)" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="fullName" label="Tên đầy đủ" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="address" label="Địa chỉ"><Input /></Form.Item>
          <Form.Item name="mst" label="MST"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Companies;
