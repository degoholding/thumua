import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, Upload } from 'antd';
import { Pencil, Trash2, Plus, Download, Upload as UploadIcon, CheckSquare } from 'lucide-react';
import Papa from 'papaparse';
import { defaultNcc } from '../data';

const Suppliers = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('nccData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    }
    return defaultNcc;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();

  const saveToStorage = (newData) => {
    setData(newData);
    localStorage.setItem('nccData', JSON.stringify(newData));
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
    message.success('Đã xóa nhà cung cấp');
  };

  const handleBatchDelete = () => {
    const newData = data.filter((_, index) => !selectedRowKeys.includes(index));
    saveToStorage(newData);
    setSelectedRowKeys([]);
    message.success(`Đã xóa ${selectedRowKeys.length} nhà cung cấp`);
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
        message.success('Đã cập nhật thông tin NCC');
      } else {
        newData.push(values);
        message.success('Đã thêm NCC mới');
      }
      saveToStorage(newData);
      setIsModalOpen(false);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleExport = () => {
    const dataToExport = selectedRowKeys.length > 0 
      ? data.filter((_, i) => selectedRowKeys.includes(i))
      : data;
      
    if (dataToExport.length === 0) {
      return message.warning('Không có dữ liệu để xuất');
    }

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'suppliers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          saveToStorage(results.data);
          message.success('Nhập CSV thành công');
        } else {
          message.error('File CSV trống hoặc không hợp lệ');
        }
      },
      error: () => {
        message.error('Lỗi đọc file CSV');
      }
    });
    return false;
  };

  const handleSelectAll = () => {
    setSelectedRowKeys(data.map((_, index) => index));
  };

  const columns = [
    {
      title: 'Tên Nhà Cung Cấp',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'mst',
      key: 'mst',
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: (_, record, index) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<Pencil size={16} style={{ color: '#0275d8' }} />} 
            onClick={() => handleEdit(record, index)}
          />
          <Popconfirm 
            title="Xóa NCC này?" 
            onConfirm={() => handleDelete(index)} 
            okText="Đồng ý" 
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-content" style={{ display: 'block' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Nhà cung cấp (NCC)</h2>
          <p className="page-subtitle" style={{ margin: '5px 0 0 0' }}>Quản lý cơ sở dữ liệu các nhà cung cấp.</p>
        </div>
        <Space style={{ flexWrap: 'wrap' }}>
          <Button icon={<CheckSquare size={16} />} onClick={handleSelectAll}>
            Chọn tất cả
          </Button>
          {selectedRowKeys.length > 0 && (
            <Popconfirm title={`Xóa ${selectedRowKeys.length} NCC đã chọn?`} onConfirm={handleBatchDelete} okText="Đồng ý" cancelText="Hủy">
              <Button danger icon={<Trash2 size={16} />}>Xóa ({selectedRowKeys.length})</Button>
            </Popconfirm>
          )}
          <Upload beforeUpload={handleImport} showUploadList={false} accept=".csv">
            <Button icon={<UploadIcon size={16} />}>Nhập</Button>
          </Upload>
          <Button icon={<Download size={16} />} onClick={handleExport}>Xuất</Button>
          <Button type="primary" icon={<Plus size={16} />} onClick={handleAdd}>
            Thêm NCC
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

      <Modal
        title={editingRecord ? "Sửa Nhà Cung Cấp" : "Thêm Nhà Cung Cấp Mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu thông tin"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="Tên Nhà cung cấp" 
            rules={[{ required: true, message: 'Vui lòng nhập tên NCC' }]}
          >
            <Input placeholder="Nhập tên công ty..." />
          </Form.Item>
          <Form.Item 
            name="address" 
            label="Địa chỉ NCC"
          >
            <Input placeholder="Nhập địa chỉ..." />
          </Form.Item>
          <Form.Item 
            name="mst" 
            label="Mã số thuế"
          >
            <Input placeholder="Nhập MST..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Suppliers;
