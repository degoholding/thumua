import React, { useState, useEffect } from 'react';
import { Table, Typography, Card, Tag, Button, Modal, Form, Input, Checkbox, Space, Popconfirm, message, Upload } from 'antd';
import { ShieldCheck, Plus, Pencil, Trash2, Download, Upload as UploadIcon, CheckSquare } from 'lucide-react';
import Papa from 'papaparse';

const { TextArea } = Input;

const permissionsList = [
  { label: 'Tạo Phiếu Yêu Cầu (PYC)', value: 'create_pyc' },
  { label: 'Xem PYC cá nhân', value: 'view_own_pyc' },
  { label: 'Xem tất cả PYC', value: 'view_all_pyc' },
  { label: 'Duyệt PYC của phòng', value: 'approve_dept_pyc' },
  { label: 'Duyệt PYC cấp cao', value: 'approve_all_pyc' },
  { label: 'Phân bổ yêu cầu', value: 'allocate_pyc' },
  { label: 'Khảo sát giá & Mua hàng', value: 'survey_buy' },
  { label: 'Quản lý Nhân sự', value: 'manage_users' },
  { label: 'Quản lý Danh mục (NCC, Công ty, PB)', value: 'manage_categories' },
  { label: 'Quản lý Vai trò (Phân quyền)', value: 'manage_roles' },
  { label: 'Toàn quyền Admin', value: 'full_admin' }
];

const defaultRolesData = [
  {
    key: '1',
    role: 'Nhân viên',
    description: 'Người ra yêu cầu thu mua hàng hóa, dịch vụ cho bộ phận của mình.',
    permissions: ['create_pyc', 'view_own_pyc'],
    color: 'blue'
  },
  {
    key: '2',
    role: 'Trưởng bộ phận',
    description: 'Người duyệt yêu cầu từ nhân viên trong phòng ban.',
    permissions: ['create_pyc', 'view_own_pyc', 'approve_dept_pyc'],
    color: 'green'
  },
  {
    key: '3',
    role: 'Quản lý thu mua',
    description: 'Người phân bổ yêu cầu đã duyệt cho team thu mua.',
    permissions: ['view_all_pyc', 'allocate_pyc', 'approve_all_pyc'],
    color: 'purple'
  },
  {
    key: '4',
    role: 'Nhân sự thu mua',
    description: 'Người khảo sát sản phẩm, thu mua sản phẩm trực tiếp từ Nhà cung cấp.',
    permissions: ['view_all_pyc', 'survey_buy', 'manage_categories'],
    color: 'orange'
  },
  {
    key: '5',
    role: 'Admin',
    description: 'Quản trị viên hệ thống có toàn quyền.',
    permissions: ['full_admin'],
    color: 'red'
  }
];

const Roles = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('rolesData');
    return saved ? JSON.parse(saved) : defaultRolesData;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('rolesData', JSON.stringify(data));
  }, [data]);

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
    if (data[index].role === 'Admin' || data[index].role === 'Trưởng bộ phận') {
      message.error('Không thể xóa vai trò hệ thống quan trọng này!');
      return;
    }
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    message.success('Đã xóa vai trò');
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newData = [...data];
      const recordToSave = {
        ...values,
        color: editingRecord ? editingRecord.color : 'default'
      };

      if (editingRecord !== null) {
        newData[editingRecord.index] = recordToSave;
        message.success('Đã cập nhật vai trò');
      } else {
        newData.push({ ...recordToSave, key: Date.now().toString() });
        message.success('Đã thêm vai trò mới');
      }
      setData(newData);
      setIsModalOpen(false);
    });
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleExport = () => {
    const dataToExport = selectedRowKeys.length > 0 
      ? data.filter((_, i) => selectedRowKeys.includes(i))
      : data;
      
    if (dataToExport.length === 0) {
      return message.warning('Không có dữ liệu để xuất');
    }

    // Role permissions might be arrays, stringify them for CSV
    const csvData = dataToExport.map(row => ({
      ...row,
      permissions: Array.isArray(row.permissions) ? row.permissions.join(';') : row.permissions
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roles.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          // Parse permissions back into arrays if needed
          const importedData = results.data.map(row => ({
            ...row,
            permissions: typeof row.permissions === 'string' && row.permissions ? row.permissions.split(';') : row.permissions
          }));
          setData(importedData);
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const columns = [
    {
      title: 'Tên Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: '20%',
      render: (text, record) => <Tag color={record.color || 'default'} style={{ fontSize: '14px', padding: '4px 10px' }}>{text}</Tag>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '30%'
    },
    {
      title: 'Quyền hạn trên Hệ thống',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (perms) => {
        if (!perms || perms.length === 0) return <span style={{ color: '#ccc' }}>Chưa cấp quyền</span>;
        return (
          <Space size={[0, 8]} wrap>
            {perms.map(p => {
              const label = permissionsList.find(pl => pl.value === p)?.label || p;
              return <Tag key={p} style={{ background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1' }}>{label}</Tag>;
            })}
          </Space>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'right',
      render: (_, record, index) => (
        <Space size="small">
          <Button type="text" icon={<Pencil size={16} style={{ color: '#0275d8' }} />} onClick={() => handleEdit(record, index)} />
          <Popconfirm title="Xóa vai trò này?" onConfirm={() => handleDelete(index)} okText="Đồng ý" cancelText="Hủy">
            <Button type="text" danger icon={<Trash2 size={16} />} disabled={record.role === 'Admin' || record.role === 'Trưởng bộ phận'} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="page-content" style={{ display: 'block' }}>
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={16} style={{ color: '#0275d8' }} /> Quản lý Vai trò & Phân quyền
          </h2>
          <p className="page-subtitle" style={{ margin: '5px 0 0 0', color: '#64748b' }}>
            Định nghĩa các vai trò và gán quyền hạn chi tiết trên hệ thống.
          </p>
        </div>
        <Space style={{ flexWrap: 'wrap' }}>
          <Button icon={<CheckSquare size={16} />} onClick={handleSelectAll}>
            Chọn tất cả
          </Button>
          <Upload beforeUpload={handleImport} showUploadList={false} accept=".csv">
            <Button icon={<UploadIcon size={16} />}>Nhập</Button>
          </Upload>
          <Button icon={<Download size={16} />} onClick={handleExport}>Xuất</Button>
          <Button type="primary" icon={<Plus size={16} />} onClick={handleAdd}>
            Thêm Vai trò
          </Button>
        </Space>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflowX: 'auto' }}>
        <Table 
          rowSelection={rowSelection}
          columns={columns} 
          dataSource={data.map((item, i) => ({ ...item, key: i }))} 
          pagination={false} 
          bordered 
        />
      </Card>

      <Modal 
        title={editingRecord ? "Sửa Vai trò" : "Thêm Vai trò mới"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={() => setIsModalOpen(false)}
        width={700}
        okText="Lưu vai trò"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="role" label="Tên Vai trò" rules={[{ required: true }]}>
             <Input placeholder="Ví dụ: Kế toán trưởng..." disabled={editingRecord && (editingRecord.role === 'Admin' || editingRecord.role === 'Trưởng bộ phận')} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
             <TextArea rows={2} placeholder="Mô tả chức năng chính của vai trò..." />
          </Form.Item>
          <Form.Item name="permissions" label="Chi tiết Quyền hạn">
             <Checkbox.Group>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                 {permissionsList.map(p => (
                   <Checkbox key={p.value} value={p.value} style={{ margin: 0 }}>{p.label}</Checkbox>
                 ))}
               </div>
             </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Roles;
