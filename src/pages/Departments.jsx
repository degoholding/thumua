import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Upload, Switch, Tag } from 'antd';
import { Pencil, Trash2, Plus, Download, Upload as UploadIcon, CheckSquare } from 'lucide-react';
import Papa from 'papaparse';
import { defaultDepartments, defaultNhanSu } from '../data';

const Departments = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('departmentsData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    }
    return defaultDepartments;
  });
  
  const [nhansuData, setNhansuData] = useState(() => {
    const saved = localStorage.getItem('nhansuData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    }
    return defaultNhanSu;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();

  const saveToStorage = (newData) => {
    setData(newData);
    localStorage.setItem('departmentsData', JSON.stringify(newData));
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
    message.success('Đã xóa phòng ban');
  };

  const handleBatchDelete = () => {
    const newData = data.filter((_, index) => !selectedRowKeys.includes(index));
    saveToStorage(newData);
    setSelectedRowKeys([]);
    message.success(`Đã xóa ${selectedRowKeys.length} phòng ban`);
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
      const oldManager = editingRecord ? editingRecord.manager : null;
      const newManager = values.manager;

      if (editingRecord !== null) {
        newData[editingRecord.index] = { ...editingRecord, ...values };
        message.success('Đã cập nhật thông tin phòng ban');
      } else {
        const maxId = data.reduce((max, item) => {
          if (!item.id || !item.id.startsWith('PBA')) return max;
          const num = parseInt(item.id.replace('PBA', ''), 10);
          return num > max ? num : max;
        }, 0);
        const newId = `PBA${String(maxId + 1).padStart(3, '0')}`;
        
        newData.push({ id: newId, disabled: false, ...values });
        message.success('Đã thêm phòng ban mới');
      }
      
      // Auto update roles in nhansuData
      if (oldManager !== newManager) {
        const newNhansuData = [...nhansuData];
        let nhansuChanged = false;

        // Downgrade old manager
        if (oldManager) {
          const oldIndex = newNhansuData.findIndex(ns => ns.name === oldManager);
          if (oldIndex !== -1) {
            newNhansuData[oldIndex] = { ...newNhansuData[oldIndex], role: 'Nhân viên' };
            nhansuChanged = true;
          }
        }

        // Upgrade new manager
        if (newManager) {
          const newIndex = newNhansuData.findIndex(ns => ns.name === newManager);
          if (newIndex !== -1) {
            newNhansuData[newIndex] = { ...newNhansuData[newIndex], role: 'Trưởng bộ phận' };
            nhansuChanged = true;
          }
        }

        if (nhansuChanged) {
          setNhansuData(newNhansuData);
          localStorage.setItem('nhansuData', JSON.stringify(newNhansuData));
        }
      }

      saveToStorage(newData);
      setIsModalOpen(false);
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
    a.download = 'departments.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const newData = [...data];
          let maxId = data.reduce((max, item) => {
            if (!item.id || !item.id.startsWith('PBA')) return max;
            const num = parseInt(item.id.replace('PBA', ''), 10);
            return num > max ? num : max;
          }, 0);

          results.data.forEach(importedRow => {
            if (typeof importedRow.disabled === 'string') {
              importedRow.disabled = importedRow.disabled.toLowerCase() === 'true';
            }

            if (importedRow.id) {
              const index = newData.findIndex(item => item.id === importedRow.id);
              if (index > -1) {
                newData[index] = { ...newData[index], ...importedRow };
              } else {
                newData.push(importedRow);
              }
            } else {
              maxId++;
              newData.push({ ...importedRow, id: `PBA${String(maxId).padStart(3, '0')}` });
            }
          });

          saveToStorage(newData);
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
      title: 'Tên Phòng ban', 
      dataIndex: 'dept', 
      key: 'dept', 
      render: (text, record) => (
        <Space>
          <strong style={{ opacity: record.disabled ? 0.5 : 1 }}>{text}</strong>
          {record.disabled && <Tag color="error">Vô hiệu hóa</Tag>}
        </Space>
      )
    },
    { 
      title: 'Tên Trưởng bộ phận', 
      dataIndex: 'manager', 
      key: 'manager',
      render: (text, record) => <span style={{ opacity: record.disabled ? 0.5 : 1 }}>{text}</span>
    },
    { 
      title: 'Email Trưởng bộ phận', 
      dataIndex: 'email', 
      key: 'email',
      render: (text, record) => <span style={{ opacity: record.disabled ? 0.5 : 1 }}>{text}</span>
    },
    {
      title: 'Hành động', key: 'action', align: 'right',
      render: (_, record, index) => (
        <Space size="small">
          <Button type="text" icon={<Pencil size={16} style={{ color: '#0275d8' }}/>} onClick={() => handleEdit(record, index)} />
          <Popconfirm title="Xóa Phòng ban này?" onConfirm={() => handleDelete(index)} okText="Đồng ý" cancelText="Hủy">
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
          <h2 className="page-title" style={{ margin: 0 }}>Phòng ban</h2>
          <p className="page-subtitle" style={{ margin: '5px 0 0 0' }}>Quản lý cơ cấu phòng ban và trưởng bộ phận.</p>
        </div>
        <Space style={{ flexWrap: 'wrap' }}>
          <Button icon={<CheckSquare size={16} />} onClick={handleSelectAll}>
            Chọn tất cả
          </Button>
          {selectedRowKeys.length > 0 && (
            <Popconfirm title={`Xóa ${selectedRowKeys.length} phòng ban đã chọn?`} onConfirm={handleBatchDelete} okText="Đồng ý" cancelText="Hủy">
              <Button danger icon={<Trash2 size={16} />}>Xóa ({selectedRowKeys.length})</Button>
            </Popconfirm>
          )}
          <Upload beforeUpload={handleImport} showUploadList={false} accept=".csv">
            <Button icon={<UploadIcon size={16} />}>Nhập</Button>
          </Upload>
          <Button icon={<Download size={16} />} onClick={handleExport}>Xuất</Button>
          <Button type="primary" icon={<Plus size={16} />} onClick={handleAdd}>
            Thêm Phòng ban
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

      <Modal title={editingRecord ? "Sửa Phòng ban" : "Thêm Phòng ban"} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="dept" label="Tên Phòng ban" rules={[{ required: true }]}><Input /></Form.Item>
          {editingRecord && (
            <Form.Item 
              name="disabled" 
              label="Trạng thái" 
              valuePropName="checked"
            >
              <Switch checkedChildren="Vô hiệu hóa" unCheckedChildren="Hoạt động" />
            </Form.Item>
          )}
          <Form.Item 
            name="manager" 
            label="Trưởng bộ phận"
          >
            <Select 
              showSearch
              placeholder="Chọn trưởng bộ phận..." 
              options={nhansuData.map(ns => ({ label: ns.name, value: ns.name }))} 
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item 
            name="email"  label="Email Trưởng bộ phận"><Input type="email" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Departments;
