import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, DatePicker, Checkbox, Row, Col, Tag } from 'antd';
import { Pencil, Trash2, Plus, Upload, CheckCircle, XCircle, Printer } from 'lucide-react';
import dayjs from 'dayjs';
import { defaultNcc, defaultDonVi, defaultNhanSu } from '../data';

const { TextArea } = Input;

const Intake = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  
  // Lấy user đăng nhập hiện tại
  const currentUser = localStorage.getItem('user') || 'Admin';

  // Hủy Yêu Cầu state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingRecord, setRejectingRecord] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // In Phiếu Yêu Cầu
  const [printingRecord, setPrintingRecord] = useState(null);
  
  // State for inner products table
  const [products, setProducts] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [productForm] = Form.useForm();

  // State for dropdowns
  const [donviOptions, setDonviData] = useState([]);
  const [nhansuOptions, setNhansuData] = useState([]);
  const [nccOptions, setNccData] = useState([]);
  const googleEmail = localStorage.getItem('googleEmail');
  const [googleNhanSu, setGoogleNhanSu] = useState(null);

  useEffect(() => {
    // Tải dữ liệu dropdown từ localStorage hoặc fallback sang default
    const storedDonvi = localStorage.getItem('donviData');
    const parsedDonvi = storedDonvi && JSON.parse(storedDonvi).length > 0 ? JSON.parse(storedDonvi) : defaultDonVi;
    setDonviData(parsedDonvi.map(d => ({ label: d.fullName, value: d.shortName })));

    const storedNhansu = localStorage.getItem('nhansuData');
    const parsedNhansu = storedNhansu && JSON.parse(storedNhansu).length > 0 ? JSON.parse(storedNhansu) : defaultNhanSu;
    setNhansuData(parsedNhansu.map(ns => ({ label: ns.name, value: ns.name })));

    if (googleEmail) {
      const match = parsedNhansu.find(ns => ns.email === googleEmail);
      if (match) {
        setGoogleNhanSu(match);
      }
    }

    const storedNcc = localStorage.getItem('nccData');
    const parsedNcc = storedNcc && JSON.parse(storedNcc).length > 0 ? JSON.parse(storedNcc) : defaultNcc;
    setNccData(parsedNcc.map(ncc => ({ label: ncc.name, value: ncc.name, mst: ncc.mst })));

    const stored = localStorage.getItem('pycData');
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      const mockData = [
        { 
          key: 1, pycCode: 'PYC-001', ngaytn: '2026-06-25', donvi: 'Dego Holding', 
          bophan: 'Kế toán', mucdich: 'Mua văn phòng phẩm tháng 6', totalAmount: 1500000, status: 'Chờ duyệt',
          history: [
            { time: '2026-06-25T08:00:00Z', user: 'user', action: 'Tạo phiếu yêu cầu', note: '' }
          ]
        }
      ];
      setData(mockData);
      localStorage.setItem('pycData', JSON.stringify(mockData));
    }
  }, []);

  const saveToStorage = (newData) => {
    setData(newData);
    localStorage.setItem('pycData', JSON.stringify(newData));
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setProducts([]);
    form.resetFields();
    const defaultVals = { ngaytn: dayjs(), showCode: true };
    if (googleNhanSu) {
      defaultVals.nhansu = googleNhanSu.name;
      defaultVals.bophan = googleNhanSu.dept;
      defaultVals.tbp = googleNhanSu.manager;
      defaultVals.chucvu = googleNhanSu.chucvu || '';
    }
    form.setFieldsValue(defaultVals);
    setIsModalOpen(true);
  };

  const handleNhanSuChange = (val) => {
    const storedNhansu = localStorage.getItem('nhansuData');
    const parsedNhansu = storedNhansu && JSON.parse(storedNhansu).length > 0 ? JSON.parse(storedNhansu) : defaultNhanSu;
    const match = parsedNhansu.find(ns => ns.name === val);
    if (match) {
      form.setFieldsValue({
        bophan: match.dept,
        tbp: match.manager,
        chucvu: match.chucvu || ''
      });
    }
  };

  const handleNccChange = (val, option) => {
    if (option) {
      form.setFieldsValue({
        nccMst: option.mst || ''
      });
    }
  };

  const handleEdit = (record, index) => {
    setEditingRecord({ ...record, index });
    setProducts(record.products || []);
    form.setFieldsValue({
      ...record,
      ngaytn: record.ngaytn ? dayjs(record.ngaytn) : null,
      ngaytrakq: record.ngaytrakq ? dayjs(record.ngaytrakq) : null
    });
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    saveToStorage(newData);
    message.success('Đã xóa phiếu yêu cầu');
  };

  const handleBatchDelete = () => {
    const newData = data.filter((_, index) => !selectedRowKeys.includes(index));
    saveToStorage(newData);
    setSelectedRowKeys([]);
    message.success(`Đã xóa ${selectedRowKeys.length} phiếu yêu cầu`);
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
      const recordToSave = {
        ...values,
        ngaytn: values.ngaytn ? values.ngaytn.format('YYYY-MM-DD') : null,
        ngaytrakq: values.ngaytrakq ? values.ngaytrakq.format('YYYY-MM-DD') : null,
        products: products,
        totalAmount: products.reduce((sum, p) => sum + (p.amount || 0), 0),
        status: editingRecord ? editingRecord.status : 'Chờ duyệt',
        pycCode: values.pycCode || `PYC-${Math.floor(Math.random() * 1000)}`
      };

      const logEntry = {
        time: new Date().toISOString(),
        user: currentUser,
        action: editingRecord ? 'Cập nhật thông tin phiếu' : 'Tạo phiếu yêu cầu',
        note: ''
      };

      if (editingRecord !== null) {
        const updatedRecord = { ...recordToSave, history: [...(editingRecord.history || []), logEntry] };
        newData[editingRecord.index] = updatedRecord;
        message.success('Đã cập nhật phiếu yêu cầu');
      } else {
        const newRecord = { ...recordToSave, status: 'Chờ duyệt', history: [logEntry] };
        newData.push({ ...newRecord, key: Date.now() });
        message.success('Đã thêm phiếu yêu cầu mới');
      }
      saveToStorage(newData);
      setIsModalOpen(false);
    });
  };

  // Product Functions
  const handleAddProduct = () => {
    setEditingProductIndex(null);
    productForm.resetFields();
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (record, index) => {
    setEditingProductIndex(index);
    productForm.setFieldsValue(record);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleSaveProduct = () => {
    productForm.validateFields().then(values => {
      const newProducts = [...products];
      const productToSave = {
        ...values,
        amount: (values.qty || 0) * (values.price || 0)
      };

      if (editingProductIndex !== null) {
        newProducts[editingProductIndex] = productToSave;
      } else {
        newProducts.push({ ...productToSave, key: Date.now() });
      }
      setProducts(newProducts);
      setIsProductModalOpen(false);
    });
  };

  // Approval Workflow
  const handleApprove = (index) => {
    const newData = [...data];
    const record = newData[index];
    if (record.status !== 'Chờ duyệt') {
      message.warning('Chỉ có thể duyệt phiếu ở trạng thái Chờ duyệt');
      return;
    }
    record.status = 'Đã duyệt';
    record.history = record.history || [];
    record.history.push({
      time: new Date().toISOString(),
      user: currentUser,
      action: 'Duyệt Phiếu Yêu Cầu',
      note: ''
    });
    saveToStorage(newData);
    message.success(`Đã duyệt phiếu ${record.pycCode}`);
  };

  const handlePrint = (record) => {
    setPrintingRecord(record);
    setTimeout(() => {
      window.print();
    }, 300); // Wait for state to render
  };

  const handleRejectPrompt = (record, index) => {
    if (record.status !== 'Chờ duyệt' && record.status !== 'Đã duyệt') {
      message.warning('Trạng thái này không thể hủy');
      return;
    }
    setRejectingRecord({ ...record, index });
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      message.error('Vui lòng nhập lý do hủy!');
      return;
    }
    const newData = [...data];
    const record = newData[rejectingRecord.index];
    record.status = 'Đã hủy';
    record.history = record.history || [];
    record.history.push({
      time: new Date().toISOString(),
      user: currentUser,
      action: 'Hủy Phiếu Yêu Cầu',
      note: rejectReason
    });
    saveToStorage(newData);
    setIsRejectModalOpen(false);
    setRejectingRecord(null);
    message.success(`Đã hủy phiếu ${record.pycCode}`);
  };

  const columns = [
    { title: 'Mã PYC', dataIndex: 'pycCode', key: 'pycCode', width: 120, render: t => <strong>{t}</strong> },
    { title: 'Ngày tạo', dataIndex: 'ngaytn', key: 'ngaytn', width: 120 },
    { title: 'Bộ phận YC', dataIndex: 'bophan', key: 'bophan', width: 150 },
    { title: 'Mục đích', dataIndex: 'mucdich', key: 'mucdich', width: 250, ellipsis: true },
    { title: 'Tổng tiền dự kiến', dataIndex: 'totalAmount', key: 'totalAmount', width: 150, render: t => t?.toLocaleString() + ' đ' },
    { 
      title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 120,
      render: (st) => {
        let color = 'default';
        if (st === 'Chờ duyệt') color = 'processing';
        if (st === 'Đã duyệt') color = 'success';
        if (st === 'Đã hủy') color = 'error';
        return <Tag color={color}>{st}</Tag>;
      }
    },
    {
      title: 'Hành động', key: 'action', align: 'center', width: 160, fixed: 'right',
      render: (_, record, index) => (
        <Space size="small" style={{ whiteSpace: 'nowrap' }}>
          <Button type="text" icon={<Printer size={16} style={{ color: '#8b5cf6' }} />} onClick={() => handlePrint(record)} title="In phiếu" />
          <Button type="text" icon={<Pencil size={16} style={{ color: '#0275d8' }} />} onClick={() => handleEdit(record, index)} title="Xem/Sửa" />
          <Popconfirm title="Xóa phiếu này?" onConfirm={() => handleDelete(index)}>
            <Button type="text" danger icon={<Trash2 size={16} />} title="Xóa" />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const productColumns = [
    { title: 'Mã hàng', dataIndex: 'code', key: 'code' },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'ĐVT', dataIndex: 'unit', key: 'unit' },
    { title: 'Số lượng', dataIndex: 'qty', key: 'qty', align: 'right' },
    { title: 'Đơn giá', dataIndex: 'price', key: 'price', align: 'right', render: t => t?.toLocaleString() },
    { title: 'Thành tiền', dataIndex: 'amount', key: 'amount', align: 'right', render: t => t?.toLocaleString() },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Hành động', key: 'action', align: 'center',
      render: (_, record, index) => (
        <Space size="small">
          <Button type="text" size="small" icon={<Pencil size={16} style={{ color: '#0275d8' }}/>} onClick={() => handleEditProduct(record, index)} />
          <Button type="text" size="small" danger icon={<Trash2 size={16} />} onClick={() => handleDeleteProduct(index)} />
        </Space>
      ),
    },
  ];

  const totalProductAmount = products.reduce((sum, p) => sum + (p.amount || 0), 0);

  // History Log Columns
  const historyColumns = [
    { 
      title: 'Thời gian', 
      dataIndex: 'time', 
      key: 'time',
      render: (t) => dayjs(t).format('DD/MM/YYYY HH:mm')
    },
    { 
      title: 'Người thực hiện', 
      dataIndex: 'user', 
      key: 'user',
      render: (u) => <strong>{u}</strong>
    },
    { 
      title: 'Hành động', 
      dataIndex: 'action', 
      key: 'action',
      render: (act) => <Tag color={act.includes('Hủy') ? 'error' : act.includes('Duyệt') ? 'success' : 'blue'}>{act}</Tag>
    },
    { 
      title: 'Ghi chú / Lý do', 
      dataIndex: 'note', 
      key: 'note' 
    }
  ];

  const expandedRowRender = (record) => {
    return (
      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#334155' }}>Lịch sử thay đổi phiếu {record.pycCode}</h4>
        <Table 
          columns={historyColumns} 
          dataSource={record.history || []} 
          pagination={false}
          size="small"
          rowKey={(r, i) => i}
        />
      </div>
    );
  };

  return (
    <div className="page-content" style={{ display: 'block' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div className="header-titles">
          <h2 className="page-title" style={{ margin: 0 }}>Danh sách Phiếu Yêu Cầu Thu Mua</h2>
          <p className="page-subtitle" style={{ margin: '5px 0 0 0' }}>Nơi tiếp nhận yêu cầu từ các bộ phận và phân bổ cho NSTM xử lý.</p>
        </div>
        <Space style={{ flexWrap: 'wrap' }}>
          {selectedRowKeys.length > 0 && (
            <Popconfirm title={`Xóa ${selectedRowKeys.length} phiếu yêu cầu đã chọn?`} onConfirm={handleBatchDelete} okText="Đồng ý" cancelText="Hủy">
              <Button danger icon={<Trash2 size={16} />}>Xóa ({selectedRowKeys.length})</Button>
            </Popconfirm>
          )}
          <Button type="primary" icon={<Plus size={16} />} onClick={handleAdd}>Tạo Yêu cầu</Button>
        </Space>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflowX: 'auto' }}>
        <Table 
          rowSelection={rowSelection}
          columns={columns} 
          dataSource={data.map((item, i) => ({ ...item, key: i }))} 
          pagination={{ pageSize: 10 }} 
          bordered 
          scroll={{ x: 1000 }}
          expandable={{ expandedRowRender }}
        />
      </div>

      <Modal 
        title={editingRecord ? "Sửa Yêu cầu Thu mua" : "Tạo Yêu cầu Thu mua mới"} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        width={800} 
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Hủy</Button>,
          editingRecord && (
            <Button 
              key="print" 
              icon={<Printer size={16} />} 
              onClick={() => handlePrint(editingRecord)}
            >
              In Phiếu
            </Button>
          ),
          (editingRecord && editingRecord.status === 'Chờ duyệt') && (
            <Button 
              key="reject" 
              danger 
              onClick={() => { setIsModalOpen(false); handleRejectPrompt(editingRecord, editingRecord.index); }}
            >
              Từ chối (Hủy phiếu)
            </Button>
          ),
          (editingRecord && editingRecord.status === 'Chờ duyệt') && (
            <Button 
              key="approve" 
              type="primary" 
              style={{ background: '#10b981', borderColor: '#10b981' }} 
              onClick={() => { setIsModalOpen(false); handleApprove(editingRecord.index); }}
            >
              Duyệt Phiếu
            </Button>
          ),
          <Button key="submit" type="primary" onClick={handleOk}>
            Lưu & Gửi Duyệt
          </Button>
        ].filter(Boolean)}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}><Form.Item name="pycCode" label="Mã phiếu yêu cầu"><Input placeholder="Để trống để tự động tạo" /></Form.Item></Col>
            <Col span={12}><Form.Item name="ngaytn" label="Ngày tiếp nhận" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" /></Form.Item></Col>
          </Row>
          
          <Form.Item name="showCode" valuePropName="checked">
            <Checkbox>Hiển thị Mã phiếu trên form in</Checkbox>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}><Form.Item name="donvi" label="Công ty" rules={[{ required: true }]}><Select options={donviOptions} placeholder="-- Chọn Công ty --" /></Form.Item></Col>
            <Col span={12}><Form.Item name="nhansu" label="Nhân sự YC" rules={[{ required: true }]}><Select options={nhansuOptions} placeholder="-- Chọn Nhân sự --" onChange={handleNhanSuChange} disabled={!!googleNhanSu} /></Form.Item></Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}><Form.Item name="bophan" label="Bộ phận YC" rules={[{ required: true }]}><Input placeholder="Tự động điền theo Nhân sự..." /></Form.Item></Col>
            <Col span={12}><Form.Item name="chucvu" label="Chức vụ (Nếu có)"><Input /></Form.Item></Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}><Form.Item name="tbp" label="Trưởng bộ phận (TBP) / Người liên hệ" rules={[{ required: true }]}><Input placeholder="Tự động điền theo Nhân sự..." /></Form.Item></Col>
          </Row>

          <Form.Item name="mucdich" label="Mục đích mua hàng" rules={[{ required: true }]}><TextArea rows={2} placeholder="Nhập mục đích mua hàng hóa/dịch vụ..." /></Form.Item>

          <Row gutter={16}>
            <Col span={12}><Form.Item name="ngaytrakq" label="Thời gian cần hàng/dịch vụ"><DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" /></Form.Item></Col>
          </Row>

          <Form.Item name="noidung" label="Nội dung mua hàng"><TextArea rows={2} placeholder="Nhập nội dung chi tiết..." /></Form.Item>

          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, color: '#0f172a' }}>Danh sách Sản phẩm Yêu cầu</h4>
              <Button type="dashed" size="small" icon={<Plus size={16} />} onClick={handleAddProduct}>Thêm SP</Button>
            </div>
            <Table columns={productColumns} dataSource={products} pagination={false} size="small" bordered 
              summary={() => {
                const vat = totalProductAmount * 0.08;
                const grandTotal = totalProductAmount + vat;
                return (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={5} align="right"><strong>Cộng:</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right"><strong>{totalProductAmount.toLocaleString()}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} colSpan={2}></Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={5} align="right"><strong>VAT (8%):</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right"><strong>{vat.toLocaleString()}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} colSpan={2}></Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={5} align="right"><strong>Tổng cộng thanh toán:</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="right"><strong>{grandTotal.toLocaleString()}</strong></Table.Summary.Cell>
                      <Table.Summary.Cell index={2} colSpan={2}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
          </div>

          <Row gutter={16}>
            <Col span={12}><Form.Item name="ncc" label="Tên nhà cung cấp đề xuất (Nếu có)"><Select options={nccOptions} placeholder="-- Chọn NCC --" onChange={handleNccChange} allowClear showSearch /></Form.Item></Col>
            <Col span={12}><Form.Item name="nccMst" label="Mã số thuế NCC"><Input /></Form.Item></Col>
          </Row>
          
          <Form.Item name="nccLienhe" label="Liên hệ NCC"><Input placeholder="SĐT / Email..." /></Form.Item>
          <Form.Item label="Báo giá đính kèm (nếu có)"><Button icon={<Upload size={16} />}>Chọn file đính kèm</Button></Form.Item>
        </Form>
      </Modal>

      {/* Product Modal */}
      <Modal title={editingProductIndex !== null ? "Sửa Sản phẩm" : "Thêm Sản phẩm"} open={isProductModalOpen} onOk={handleSaveProduct} onCancel={() => setIsProductModalOpen(false)}>
         <Form form={productForm} layout="vertical">
            <Row gutter={16}>
              <Col span={12}><Form.Item name="code" label="Mã hàng"><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}><Input /></Form.Item></Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}><Form.Item name="unit" label="ĐVT" rules={[{ required: true }]}><Input /></Form.Item></Col>
              <Col span={12}><Form.Item name="qty" label="Số lượng" rules={[{ required: true }]}><Input type="number" min={0} /></Form.Item></Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}><Form.Item name="price" label="Đơn giá"><Input type="number" min={0} /></Form.Item></Col>
            </Row>
            <Form.Item name="note" label="Ghi chú"><Input /></Form.Item>
         </Form>
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        title="Lý do Hủy Yêu Cầu"
        open={isRejectModalOpen}
        onOk={submitReject}
        onCancel={() => { setIsRejectModalOpen(false); setRejectingRecord(null); }}
        okText="Xác nhận Hủy"
        okButtonProps={{ danger: true }}
        cancelText="Bỏ qua"
      >
        <div style={{ marginBottom: '16px' }}>
          Bạn đang thao tác Hủy Phiếu Yêu Cầu <strong>{rejectingRecord?.pycCode}</strong>.
          <br/>Vui lòng ghi chú lý do Hủy để lưu lại Lịch sử.
        </div>
        <TextArea 
          rows={4} 
          placeholder="Nhập lý do hủy..." 
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>

      {/* Hidden Print Container */}
      {/* Hidden Print Container */}
      {printingRecord && (
        <div className="print-container">
          <style>
            {`
              @media print {
                  @page {
                      size: A4 portrait;
                      margin: 4mm 5mm !important;
                  }
                  body * {
                      visibility: hidden;
                  }
                  .print-container, .print-container * {
                      visibility: visible;
                  }
                  .print-container {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      margin: 0;
                      padding: 0;
                  }
                  body {
                      margin: 0 !important;
                      padding: 0 !important;
                  }
                  .print-format {
                      padding: 0 !important;
                      margin: 0 !important;
                      width: 100% !important;
                  }
              }

              .print-format {
                  padding: 5mm 6mm !important;
                  font-family: "Arial", sans-serif;
                  font-size: 11px;
                  color: #000;
                  line-height: 1.35;
                  width: 100%;
                  box-sizing: border-box;
              }

              .print-format .header-wrapper {
                  position: relative;
                  width: 100%;
                  margin-bottom: 12px;
                  min-height: 55px;
              }

              .print-format .header-company {
                  font-weight: bold;
                  font-size: 12px;
              }

              .print-format .header-company .company-name {
                  color: #1F4E79;
              }

              .print-format .meta-box {
                  position: absolute;
                  top: 0;
                  right: 0;
                  border-collapse: collapse;
                  font-size: 10px;
                  line-height: 1.4;
              }

              .print-format .meta-box td {
                  border: 1px solid #000;
                  padding: 2px 8px;
                  white-space: nowrap;
              }

              .print-format .meta-box .meta-title {
                  text-align: center;
                  font-weight: bold;
              }

              .print-format .title-section {
                  text-align: center;
                  margin-bottom: 15px;
              }

              .print-format .title-main {
                  font-size: 16px;
                  font-weight: bold;
                  text-transform: uppercase;
                  margin-bottom: 3px;
              }

              .print-format .info-section {
                  margin-bottom: 8px;
              }

              .print-format .section-title {
                  font-weight: bold;
                  text-transform: uppercase;
                  background-color: #d9d9d9;
                  padding: 4px 6px;
                  margin-bottom: 4px;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
              }

              .print-format .info-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 2px;
              }

              .print-format .info-table td {
                  border: none !important;
                  padding: 1px 0 !important;
                  vertical-align: top !important;
                  line-height: 1.25 !important;
              }

              .print-format .info-table td.info-label {
                  width: 1% !important;
                  white-space: nowrap !important;
                  padding-right: 8px !important;
                  font-weight: bold !important;
              }

              .print-format .info-table td.info-value {
                  text-align: left !important;
              }

              .print-format .items-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 8px;
                  margin-bottom: 10px;
              }

              .print-format .items-table th,
              .print-format .items-table td {
                  border: 1px solid #000;
                  padding: 6px 6px;
                  text-align: center;
                  vertical-align: middle;
              }

              .print-format .items-table th {
                  background-color: #d9d9d9;
                  font-weight: bold;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
              }

              .print-format .text-left { text-align: left !important; }
              .print-format .text-right { text-align: right !important; }

              .print-format .signature-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
              }

              .print-format .signature-table td {
                  border: none !important;
                  text-align: center;
                  vertical-align: top;
                  padding: 3px 10px !important;
                  width: 25%;
              }

              .print-format .signature-table tr.sign-row td {
                  height: 70px;
              }

              .print-format .sign-line {
                  border-top: 1px solid #000;
                  width: 80%;
                  margin: 0 auto;
              }

              .print-format .signature-table tr.sign-name td {
                  font-weight: bold;
                  padding-bottom: 3px !important;
                  vertical-align: bottom;
              }
            `}
          </style>

          {(() => {
            const totalAmount = printingRecord.products?.reduce((s, p) => s + (Number(p.amount) || 0), 0) || 0;
            return (
          <div className="print-format">
              <div className="header-wrapper">
                  <div className="header-company">Đơn vị: <span className="company-name">{printingRecord.donvi ? printingRecord.donvi.toUpperCase() : "CÔNG TY TNHH DEGO HOLDING"}</span></div>
                  <table className="meta-box">
                      <tbody>
                        <tr>
                            <td className="meta-title" colSpan="2">Mẫu 003/BM/PKT</td>
                        </tr>
                        <tr>
                            <td>Phiên bản</td>
                            <td>V1-062025</td>
                        </tr>
                        <tr>
                            <td>Ngày update:</td>
                            <td>17/7/2025</td>
                        </tr>
                      </tbody>
                  </table>
              </div>

              <div className="title-section">
                  <div className="title-main">PHIẾU ĐỀ XUẤT MUA HÀNG HÓA/DỊCH VỤ</div>
                  <div>Số: {printingRecord.pycCode}</div>
                  <div>Ngày {printingRecord.ngaytn ? dayjs(printingRecord.ngaytn).format('DD') : '...'} tháng {printingRecord.ngaytn ? dayjs(printingRecord.ngaytn).format('MM') : '...'} năm {printingRecord.ngaytn ? dayjs(printingRecord.ngaytn).format('YYYY') : '....'}</div>
              </div>

              <div className="info-section">
                  <div className="section-title">THÔNG TIN CHUNG</div>
                  <table className="info-table">
                      <tbody>
                        <tr>
                            <td className="info-label">Người đề xuất:</td>
                            <td className="info-value">{printingRecord.history?.[0]?.user || printingRecord.nhansu || ""}</td>
                        </tr>
                        <tr>
                            <td className="info-label">Chức vụ:</td>
                            <td className="info-value">{printingRecord.chucvu || ""}</td>
                        </tr>
                        <tr>
                            <td className="info-label">Hiện công tác tại bộ phận:</td>
                            <td className="info-value">{printingRecord.bophan || ""}</td>
                        </tr>
                        <tr>
                            <td className="info-label">Trưởng phòng ban/bộ phận:</td>
                            <td className="info-value">{printingRecord.tbp || ""}</td>
                        </tr>
                      </tbody>
                  </table>
              </div>

              <div className="info-section">
                  <div className="section-title">MỤC ĐÍCH &amp; NỘI DUNG ĐỀ XUẤT</div>
                  <table className="info-table">
                      <tbody>
                        <tr>
                            <td className="info-label">Mục đích mua hàng hoá/dịch vụ:</td>
                            <td className="info-value">{printingRecord.mucdich || ""}</td>
                        </tr>
                        <tr>
                            <td className="info-label">Thời gian cần hàng/dịch vụ:</td>
                            <td className="info-value">{printingRecord.ngaytrakq ? dayjs(printingRecord.ngaytrakq).format('DD/MM/YYYY') : "....."}</td>
                        </tr>
                        <tr>
                            <td className="info-label">Nội dung:</td>
                            <td className="info-value remarks-text">{printingRecord.noidung || ""}</td>
                        </tr>
                      </tbody>
                  </table>
              </div>

              <table className="items-table">
                  <thead>
                      <tr>
                          <th style={{ width: '5%' }}>STT</th>
                          <th style={{ width: '32%' }} className="text-left">Tên hàng hoá/dịch vụ</th>
                          <th style={{ width: '12%' }}>Mã Hàng</th>
                          <th style={{ width: '7%' }}>ĐVT</th>
                          <th style={{ width: '11%' }}>Số lượng yêu cầu</th>
                          <th style={{ width: '12%' }} className="text-right">Đơn giá</th>
                          <th style={{ width: '12%' }} className="text-right">Thành tiền</th>
                          <th style={{ width: '9%' }} className="text-left">Ghi chú</th>
                      </tr>
                  </thead>
                  <tbody>
                      {printingRecord.products?.length > 0 ? printingRecord.products.map((p, i) => (
                          <tr key={i}>
                              <td>{i + 1}</td>
                              <td className="text-left">{p.name}</td>
                              <td>{p.code || ""}</td>
                              <td>{p.unit || ""}</td>
                              <td className="text-right">{p.qty || ""}</td>
                              <td className="text-right">{p.price?.toLocaleString() || ""}</td>
                              <td className="text-right">{p.amount?.toLocaleString() || ""}</td>
                              <td className="text-left">{p.note || ""}</td>
                          </tr>
                      )) : (
                          <tr><td colSpan="8">Chưa có sản phẩm</td></tr>
                      )}
                      
                      <tr style={{ fontWeight: 'bold' }}>
                          <td colSpan="5" className="text-left" style={{ border: '1px solid #000 !important' }}>Tổng cộng</td>
                          <td style={{ border: '1px solid #000 !important' }}></td>
                          <td className="text-right" style={{ border: '1px solid #000 !important' }}>
                              {totalAmount ? totalAmount.toLocaleString() : ''}
                          </td>
                          <td style={{ border: '1px solid #000 !important' }}></td>
                      </tr>
                      <tr style={{ border: 'none !important' }}>
                          <td colSpan="5" style={{ border: 'none !important' }}></td>
                          <td className="text-right" style={{ border: 'none !important', fontWeight: 'bold', backgroundColor: 'transparent' }}>VAT</td>
                          <td className="text-right" style={{ border: 'none !important', fontWeight: 'bold' }}>
                              {totalAmount ? (totalAmount * 0.08).toLocaleString() : ''}
                          </td>
                          <td style={{ border: 'none !important' }}></td>
                      </tr>
                      <tr style={{ border: 'none !important' }}>
                          <td colSpan="5" style={{ border: 'none !important' }}></td>
                          <td className="text-right" style={{ border: 'none !important', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tổng cộng thanh toán</td>
                          <td className="text-right" style={{ border: 'none !important', fontWeight: 'bold' }}>
                              {totalAmount ? (totalAmount * 1.08).toLocaleString() : ''}
                          </td>
                          <td style={{ border: 'none !important' }}></td>
                      </tr>
                  </tbody>
              </table>

              <div className="info-section">
                  <div className="section-title">THÔNG TIN NHÀ CUNG CẤP</div>
                  <table className="info-table">
                      <tbody>
                        <tr>
                            <td className="info-label">Tên nhà cung cấp:</td>
                            <td className="info-value">{printingRecord.ncc || ""}</td>
                        </tr>
                        <tr>
                            <td className="info-label">Mã số thuế:</td>
                            <td className="info-value">{printingRecord.nccMst || ""}</td>
                        </tr>
                        <tr>
                            <td className="info-label">Liên hệ:</td>
                            <td className="info-value">{printingRecord.nccLienhe || ""}</td>
                        </tr>
                        <tr>
                            <td className="info-label">Báo giá đính kèm:</td>
                            <td className="info-value">&#9744; Có &nbsp;&nbsp;&nbsp; &#9744; Không: &nbsp;&nbsp; .....</td>
                        </tr>
                      </tbody>
                  </table>
              </div>

              <div className="info-section">
                  <div className="section-title">PHẦN DÀNH CHO BỘ PHẬN MUA HÀNG</div>
                  <table className="info-table">
                      <tbody>
                        <tr>
                            <td className="info-label">Thời gian cần hàng/dịch vụ:</td>
                            <td className="info-value">.....</td>
                        </tr>
                        <tr>
                            <td className="info-label">Yêu cầu khác (nếu có):</td>
                            <td className="info-value">.....</td>
                        </tr>
                      </tbody>
                  </table>
              </div>

              <div className="info-section" style={{ marginTop: '15px' }}>
                  <div className="section-title">XÉT DUYỆT</div>
                  <table className="signature-table">
                      <tbody>
                        <tr style={{ fontWeight: 'bold' }}>
                            <td>Giám đốc</td>
                            <td>TP/BP mua hàng</td>
                            <td>TP/BP đề xuất</td>
                            <td>Người lập</td>
                        </tr>
                        <tr style={{ fontSize: '10px', fontStyle: 'italic' }}>
                            <td>(Ký, ghi rõ họ tên)</td>
                            <td>(Ký, ghi rõ họ tên)</td>
                            <td>(Ký, ghi rõ họ tên)</td>
                            <td>(Ký, ghi rõ họ tên)</td>
                        </tr>
                        <tr className="sign-row">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr className="sign-name">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{printingRecord.history?.[0]?.user || printingRecord.nhansu || ""}</td>
                        </tr>
                        <tr>
                            <td><div className="sign-line"></div></td>
                            <td><div className="sign-line"></div></td>
                            <td><div className="sign-line"></div></td>
                            <td><div className="sign-line"></div></td>
                        </tr>
                      </tbody>
                  </table>
              </div>
          </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Intake;
