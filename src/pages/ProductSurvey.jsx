import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Select, DatePicker, Row, Col, Divider, Tag } from 'antd';
import { Pencil, Trash2, Plus, Download } from 'lucide-react';
import { defaultProductSurvey } from '../data';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const ProductSurvey = () => {
  const [searchParams] = useSearchParams();
  const pycFromUrl = searchParams.get('pyc');
  const { currentUser } = useOutletContext() || {};

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('productSurveyData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    }
    return defaultProductSurvey;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [mainForm] = Form.useForm();
  const [spForm] = Form.useForm();

  // Danh sách SP trong phiếu KS đang mở
  const [spRows, setSpRows] = useState([]);
  const [isSpPopupOpen, setIsSpPopupOpen] = useState(false);
  const [editingSpIndex, setEditingSpIndex] = useState(null);

  // Lấy thông tin PYC nếu có
  const [pycInfo, setPycInfo] = useState(null);

  useEffect(() => {
    if (pycFromUrl) {
      const pycData = localStorage.getItem('pycData');
      if (pycData) {
        const allPyc = JSON.parse(pycData);
        const found = allPyc.find(p => p.pycCode === pycFromUrl);
        if (found) {
          setPycInfo(found);
        }
      }
    }
  }, [pycFromUrl]);

  const saveToStorage = (newData) => {
    setData(newData);
    localStorage.setItem('productSurveyData', JSON.stringify(newData));
  };

  // === Bảng danh sách phiếu KS SP (trang chính) ===

  const handleAdd = () => {
    setEditingRecord(null);
    let initialSpRows = [];
    
    if (pycInfo) {
      // Tự động lấy các sản phẩm mà NSTM này được phân bổ
      const assignedProducts = (pycInfo.products || []).filter(p => p.assignedTo === currentUser);
      initialSpRows = assignedProducts.map((p, idx) => ({
        key: Date.now() + idx,
        tenSp: p.name,
        soLuongYc: p.qty,
        dvtBaoGia: p.unit
      }));
      
      mainForm.setFieldsValue({
        maYc: pycInfo.pycCode,
        ngayTiepNhan: pycInfo.ngaytn ? dayjs(pycInfo.ngaytn) : dayjs(),
        yeuCauChiTiet: pycInfo.mucdich || '',
      });
    } else {
      mainForm.resetFields();
    }
    
    setSpRows(initialSpRows);
    setIsModalOpen(true);
  };

  const handleEdit = (record, index) => {
    setEditingRecord({ ...record, index });
    setSpRows(record.spList || []);
    mainForm.setFieldsValue({
      maYc: record.maYc,
      ngayTiepNhan: record.ngayTiepNhan ? dayjs(record.ngayTiepNhan) : null,
      nhomHang: record.nhomHang,
      yeuCauChiTiet: record.yeuCauChiTiet,
      duyetTp: record.duyetTp,
      ghiChuDuyet: record.ghiChuDuyet,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    saveToStorage(newData);
    message.success('Đã xóa phiếu khảo sát SP');
  };

  const handleBatchDelete = () => {
    const newData = data.filter((_, index) => !selectedRowKeys.includes(index));
    saveToStorage(newData);
    setSelectedRowKeys([]);
    message.success(`Đã xóa ${selectedRowKeys.length} phiếu`);
  };

  const handleOk = () => {
    mainForm.validateFields().then(values => {
      const record = {
        maYc: values.maYc,
        ngayTiepNhan: values.ngayTiepNhan ? values.ngayTiepNhan.format('YYYY-MM-DD') : null,
        nhomHang: values.nhomHang,
        yeuCauChiTiet: values.yeuCauChiTiet,
        duyetTp: values.duyetTp,
        ghiChuDuyet: values.ghiChuDuyet,
        spList: spRows,
        soSp: spRows.length,
        tenSpChinh: spRows.length > 0 ? spRows[0].tenSp : '',
        tenNccChinh: spRows.length > 0 ? spRows[0].tenNcc : '',
      };

      const newData = [...data];
      if (editingRecord !== null) {
        newData[editingRecord.index] = record;
        message.success('Đã cập nhật phiếu khảo sát SP');
      } else {
        newData.push(record);
        message.success('Đã tạo phiếu khảo sát SP mới');
      }
      saveToStorage(newData);
      setIsModalOpen(false);
    });
  };

  // === Bảng SP bên trong phiếu ===

  const handleAddSp = () => {
    setEditingSpIndex(null);
    spForm.resetFields();
    setIsSpPopupOpen(true);
  };

  const handleEditSp = (record, index) => {
    setEditingSpIndex(index);
    spForm.setFieldsValue(record);
    setIsSpPopupOpen(true);
  };

  const handleDeleteSp = (index) => {
    const newRows = [...spRows];
    newRows.splice(index, 1);
    setSpRows(newRows);
  };

  const handleSaveSp = () => {
    spForm.validateFields().then(values => {
      // Tự động tính thành tiền
      const soLuong = values.soLuongYc || 0;
      const gia = values.giaKhungSl || 0;
      const vat = values.vat || 0;
      values.thanhTien = soLuong * gia * (1 + vat / 100);

      const newRows = [...spRows];
      if (editingSpIndex !== null) {
        newRows[editingSpIndex] = values;
      } else {
        newRows.push(values);
      }
      setSpRows(newRows);
      setIsSpPopupOpen(false);
    });
  };

  // === Columns cho bảng chính ===
  const mainColumns = [
    { title: 'Mã Yêu Cầu', dataIndex: 'maYc', key: 'maYc', render: t => <strong>{t}</strong> },
    { title: 'Ngày', dataIndex: 'ngayTiepNhan', key: 'ngayTiepNhan', width: 110 },
    { title: 'NCC chính', dataIndex: 'tenNccChinh', key: 'tenNccChinh', ellipsis: true },
    { title: 'SP chính', dataIndex: 'tenSpChinh', key: 'tenSpChinh', ellipsis: true },
    { title: 'Số SP', dataIndex: 'soSp', key: 'soSp', width: 70, align: 'center',
      render: t => <Tag color="blue">{t || 0}</Tag>
    },
    { title: 'Duyệt', dataIndex: 'duyetTp', key: 'duyetTp', width: 120,
      render: t => {
        if (t === 'Duyệt') return <Tag color="success">Duyệt</Tag>;
        if (t === 'Không duyệt') return <Tag color="error">Không duyệt</Tag>;
        return <Tag>Chưa duyệt</Tag>;
      }
    },
    { title: 'Hành động', key: 'action', align: 'right', width: 100,
      render: (_, record, index) => (
        <Space size="small">
          <Button type="text" icon={<Pencil size={16} style={{ color: '#0275d8' }} />} onClick={() => handleEdit(record, index)} />
          <Popconfirm title="Xóa phiếu này?" onConfirm={() => handleDelete(index)} okText="Đồng ý" cancelText="Hủy">
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // === Columns cho bảng SP bên trong phiếu ===
  const spColumns = [
    { title: 'STT', key: 'stt', width: 50, align: 'center', render: (_, __, i) => i + 1 },
    { title: 'Tên SP', dataIndex: 'tenSp', key: 'tenSp' },
    { title: 'NCC', dataIndex: 'tenNcc', key: 'tenNcc', ellipsis: true },
    { title: 'ĐVT', dataIndex: 'dvtBaoGia', key: 'dvtBaoGia', width: 70 },
    { title: 'Giá', dataIndex: 'giaKhungSl', key: 'giaKhungSl', width: 100, align: 'right',
      render: t => t ? t.toLocaleString() : ''
    },
    { title: 'Kết quả LAB', dataIndex: 'ketQuaLab', key: 'ketQuaLab', width: 110,
      render: t => {
        if (t === 'Đạt') return <Tag color="success">Đạt</Tag>;
        if (t === 'Không đạt') return <Tag color="error">Không đạt</Tag>;
        return '';
      }
    },
    { title: '', key: 'action', width: 80, align: 'center',
      render: (_, record, index) => (
        <Space size="small">
          <Button type="text" size="small" icon={<Pencil size={14} style={{ color: '#0275d8' }} />} onClick={() => handleEditSp(record, index)} />
          <Button type="text" size="small" danger icon={<Trash2 size={14} />} onClick={() => handleDeleteSp(index)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="page-content" style={{ display: 'block' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Khảo sát Sản phẩm</h2>
          <p className="page-subtitle" style={{ margin: '5px 0 0 0' }}>Đánh giá định mức, chất lượng LAB và giá mua.</p>
        </div>
        <Space style={{ flexWrap: 'wrap' }}>
          {selectedRowKeys.length > 0 && (
            <Popconfirm title={`Xóa ${selectedRowKeys.length} phiếu đã chọn?`} onConfirm={handleBatchDelete} okText="Đồng ý" cancelText="Hủy">
              <Button danger icon={<Trash2 size={16} />}>Xóa ({selectedRowKeys.length})</Button>
            </Popconfirm>
          )}
          <Button icon={<Download size={16} />}>Export CSV</Button>
          <Button type="primary" icon={<Plus size={16} />} onClick={handleAdd}>Thêm Khảo sát</Button>
        </Space>
      </div>

      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflowX: 'auto' }}>
        <Table
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          columns={mainColumns}
          dataSource={data.map((item, i) => ({ ...item, key: i }))}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* === MODAL PHIẾU KHẢO SÁT SP === */}
      <Modal
        title={editingRecord ? "Cập nhật Phiếu Khảo sát Sản phẩm" : "Tạo Phiếu Khảo sát Sản phẩm"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu phiếu"
        cancelText="Hủy"
        width={950}
      >
        <Form form={mainForm} layout="vertical">

          {/* === VÙNG 1: THÔNG TIN TIẾP NHẬN === */}
          <Divider orientation="left" style={{ fontWeight: 'bold', color: '#1E7F9C' }}>THÔNG TIN TIẾP NHẬN</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="maYc" label="Mã yêu cầu (PYC)" rules={[{ required: true }]}>
                <Input placeholder="VD: PYC.NM.280326.01" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="ngayTiepNhan" label="Ngày tiếp nhận">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="nhomHang" label="Nhóm hàng">
                <Select placeholder="Chọn nhóm">
                  <Option value="Bao bì">Bao bì</Option>
                  <Option value="Nguyên liệu">Nguyên liệu</Option>
                  <Option value="In ấn">In ấn</Option>
                  <Option value="Chai lọ">Chai lọ</Option>
                  <Option value="Hóa chất">Hóa chất</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="yeuCauChiTiet" label="Yêu cầu chi tiết">
                <TextArea rows={2} placeholder="Mô tả thông số kỹ thuật, số lượng, giá tham khảo..." />
              </Form.Item>
            </Col>
          </Row>

          {/* === VÙNG 2: BẢNG KHẢO SÁT SP === */}
          <Divider orientation="left" style={{ fontWeight: 'bold', color: '#1E7F9C' }}>BẢNG KHẢO SÁT SẢN PHẨM</Divider>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '13px' }}>
                {spRows.length > 0 ? `${spRows.length} sản phẩm` : 'Chưa có sản phẩm nào. Bấm nút bên phải để thêm.'}
              </span>
              <Button type="dashed" icon={<Plus size={16} />} onClick={handleAddSp}>Thêm Sản phẩm</Button>
            </div>
            <Table
              columns={spColumns}
              dataSource={spRows.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="small"
              bordered
              locale={{ emptyText: 'Bấm "Thêm Sản phẩm" để bắt đầu khảo sát' }}
            />
          </div>

          {/* === VÙNG 3: PHÊ DUYỆT === */}
          <Divider orientation="left" style={{ fontWeight: 'bold', color: '#1E7F9C' }}>PHÊ DUYỆT (QLTM)</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="duyetTp" label="Duyệt (TP/QL)">
                <Select placeholder="Chọn" allowClear>
                  <Option value="Duyệt">Duyệt</Option>
                  <Option value="Không duyệt">Không duyệt</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="ghiChuDuyet" label="Yêu cầu / Ghi chú từ TP/QL">
                <TextArea rows={2} placeholder="Ghi chú chỉ đạo xử lý..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* === POPUP NHẬP CHI TIẾT 1 SẢN PHẨM === */}
      <Modal
        title={editingSpIndex !== null ? "Cập nhật thông tin Sản phẩm" : "Thêm Sản phẩm mới"}
        open={isSpPopupOpen}
        onOk={handleSaveSp}
        onCancel={() => setIsSpPopupOpen(false)}
        okText="Lưu SP"
        cancelText="Hủy"
        width={700}
      >
        <Form form={spForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="tenSp" label="Tên Sản phẩm" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Input placeholder="Tên NVL/VTBB" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tenNcc" label="Nhà cung cấp" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Input placeholder="Tên NCC báo giá" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="thongSoKt" label="Thông số kỹ thuật">
                <Input placeholder="Kích thước, tỷ trọng, màu..." />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="xuatXu" label="Xuất xứ">
                <Input placeholder="VN, TQ..." />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="dvtBaoGia" label="ĐVT Báo giá">
                <Input placeholder="Cái, Kg..." />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0' }} />

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="moq" label="MOQ">
                <InputNumber style={{ width: '100%' }} placeholder="Min" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="khungSl" label="Khung SL">
                <Input placeholder="500-1000" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="giaKhungSl" label="Giá theo khung">
                <InputNumber style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="vat" label="VAT (%)">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="soLuongYc" label="Số lượng YC">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="chiPhiVanChuyen" label="Phí vận chuyển">
                <InputNumber style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="thoiGianGiaoHang" label="Thời gian giao">
                <Input placeholder="10-15 ngày" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="ketQuaLab" label="Kết quả LAB">
                <Select placeholder="Chọn" allowClear>
                  <Option value="Đạt">Đạt</Option>
                  <Option value="Không đạt">Không đạt</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductSurvey;
