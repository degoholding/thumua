import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Select, DatePicker, Row, Col, Divider, Tag } from 'antd';
import { Pencil, Trash2, Plus, Download, Search } from 'lucide-react';
import { defaultSupplierSurvey } from '../data';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const SupplierSurvey = () => {
  const [searchParams] = useSearchParams();
  const pycFromUrl = searchParams.get('pyc');

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('supplierSurveyData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.length > 0) return parsed;
    }
    return defaultSupplierSurvey;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Form chính cho thông tin tiếp nhận + phê duyệt
  const [mainForm] = Form.useForm();
  // Form popup cho từng dòng NCC
  const [nccForm] = Form.useForm();

  // Danh sách NCC trong phiếu KS đang mở
  const [nccRows, setNccRows] = useState([]);
  const [isNccPopupOpen, setIsNccPopupOpen] = useState(false);
  const [editingNccIndex, setEditingNccIndex] = useState(null);

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
    localStorage.setItem('supplierSurveyData', JSON.stringify(newData));
  };

  // === Bảng danh sách phiếu KS NCC (trang chính) ===

  const handleAdd = () => {
    setEditingRecord(null);
    setNccRows([]);
    mainForm.resetFields();
    if (pycInfo) {
      mainForm.setFieldsValue({
        maYc: pycInfo.pycCode,
        ngayTiepNhan: pycInfo.ngaytn ? dayjs(pycInfo.ngaytn) : dayjs(),
        yeuCauChiTiet: pycInfo.mucdich || '',
      });
    }
    setIsModalOpen(true);
  };

  const handleEdit = (record, index) => {
    setEditingRecord({ ...record, index });
    setNccRows(record.nccList || []);
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
    message.success('Đã xóa phiếu khảo sát');
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
        nccList: nccRows,
        // Summary fields for the main table
        soNcc: nccRows.length,
        tenNccChinh: nccRows.length > 0 ? nccRows[0].tenNcc : '',
      };

      const newData = [...data];
      if (editingRecord !== null) {
        newData[editingRecord.index] = record;
        message.success('Đã cập nhật phiếu khảo sát');
      } else {
        newData.push(record);
        message.success('Đã tạo phiếu khảo sát mới');
      }
      saveToStorage(newData);
      setIsModalOpen(false);
    });
  };

  // === Bảng NCC bên trong phiếu (editable table) ===

  const handleAddNcc = () => {
    setEditingNccIndex(null);
    nccForm.resetFields();
    setIsNccPopupOpen(true);
  };

  const handleEditNcc = (record, index) => {
    setEditingNccIndex(index);
    nccForm.setFieldsValue(record);
    setIsNccPopupOpen(true);
  };

  const handleDeleteNcc = (index) => {
    const newRows = [...nccRows];
    newRows.splice(index, 1);
    setNccRows(newRows);
  };

  const handleSaveNcc = () => {
    nccForm.validateFields().then(values => {
      const newRows = [...nccRows];
      if (editingNccIndex !== null) {
        newRows[editingNccIndex] = values;
      } else {
        newRows.push(values);
      }
      setNccRows(newRows);
      setIsNccPopupOpen(false);
    });
  };

  // === Columns cho bảng chính ===
  const mainColumns = [
    { title: 'Mã Yêu Cầu', dataIndex: 'maYc', key: 'maYc', render: t => <strong>{t}</strong> },
    { title: 'Ngày Tiếp Nhận', dataIndex: 'ngayTiepNhan', key: 'ngayTiepNhan', width: 130 },
    { title: 'Nhóm Hàng', dataIndex: 'nhomHang', key: 'nhomHang', width: 120 },
    { title: 'NCC chính', dataIndex: 'tenNccChinh', key: 'tenNccChinh', ellipsis: true },
    { title: 'Số NCC', dataIndex: 'soNcc', key: 'soNcc', width: 80, align: 'center',
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

  // === Columns cho bảng NCC bên trong phiếu ===
  const nccColumns = [
    { title: 'STT', key: 'stt', width: 50, align: 'center', render: (_, __, i) => i + 1 },
    { title: 'Tên NCC', dataIndex: 'tenNcc', key: 'tenNcc' },
    { title: 'MST', dataIndex: 'mst', key: 'mst', width: 120 },
    { title: 'SĐT', dataIndex: 'sdt', key: 'sdt', width: 120 },
    { title: 'Chính sách công nợ', dataIndex: 'chinhSachCongNo', key: 'chinhSachCongNo', width: 150 },
    { title: 'Mức độ tin cậy', dataIndex: 'mucDoTinCay', key: 'mucDoTinCay', width: 130,
      render: t => {
        const colors = { 'Cao': 'green', 'Trung bình': 'gold', 'Thấp': 'red' };
        return t ? <Tag color={colors[t] || 'default'}>{t}</Tag> : '';
      }
    },
    { title: 'Đánh giá NSPT', dataIndex: 'danhGiaNspt', key: 'danhGiaNspt', width: 130,
      render: t => {
        if (t === 'Đạt') return <Tag color="success">Đạt</Tag>;
        if (t === 'Không đạt') return <Tag color="error">Không đạt</Tag>;
        return '';
      }
    },
    { title: '', key: 'action', width: 80, align: 'center',
      render: (_, record, index) => (
        <Space size="small">
          <Button type="text" size="small" icon={<Pencil size={14} style={{ color: '#0275d8' }} />} onClick={() => handleEditNcc(record, index)} />
          <Button type="text" size="small" danger icon={<Trash2 size={14} />} onClick={() => handleDeleteNcc(index)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="page-content" style={{ display: 'block' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Khảo sát Nhà Cung Cấp</h2>
          <p className="page-subtitle" style={{ margin: '5px 0 0 0' }}>Đánh giá hành chính, pháp lý và năng lực NCC.</p>
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

      {/* === MODAL PHIẾU KHẢO SÁT NCC === */}
      <Modal
        title={editingRecord ? "Cập nhật Phiếu Khảo sát NCC" : "Tạo Phiếu Khảo sát NCC"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu phiếu"
        cancelText="Hủy"
        width={900}
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

          {/* === VÙNG 2: BẢNG KHẢO SÁT NCC === */}
          <Divider orientation="left" style={{ fontWeight: 'bold', color: '#1E7F9C' }}>BẢNG KHẢO SÁT NHÀ CUNG CẤP</Divider>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#64748b', fontSize: '13px' }}>
                {nccRows.length > 0 ? `${nccRows.length} nhà cung cấp` : 'Chưa có NCC nào. Bấm nút bên phải để thêm.'}
              </span>
              <Button type="dashed" icon={<Plus size={16} />} onClick={handleAddNcc}>Thêm NCC</Button>
            </div>
            <Table
              columns={nccColumns}
              dataSource={nccRows.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="small"
              bordered
              locale={{ emptyText: 'Bấm "Thêm NCC" để bắt đầu khảo sát' }}
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

      {/* === POPUP NHẬP CHI TIẾT 1 NCC === */}
      <Modal
        title={editingNccIndex !== null ? "Cập nhật thông tin NCC" : "Thêm Nhà cung cấp mới"}
        open={isNccPopupOpen}
        onOk={handleSaveNcc}
        onCancel={() => setIsNccPopupOpen(false)}
        okText="Lưu NCC"
        cancelText="Hủy"
        width={650}
      >
        <Form form={nccForm} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="tenNcc" label="Tên Nhà Cung Cấp" rules={[{ required: true, message: 'Bắt buộc' }]}>
                <Input placeholder="Tên pháp lý công ty" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="mst" label="Mã số thuế">
                <Input placeholder="MST" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="sdt" label="SĐT liên hệ (NVKD)">
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="nguoiLienHe" label="Người liên hệ">
                <Input placeholder="Tên NVKD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="nhomSpCungUng" label="Nhóm SP cung ứng">
                <Input placeholder="Túi, chai, in ấn..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="diaChiKho" label="Địa chỉ kho NCC">
                <Input placeholder="Nơi giao nhận hàng" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="linkGoogleMaps" label="Link Google Maps">
                <Input placeholder="https://maps.google.com/..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="linkBaoGia" label="Link thư mục báo giá (Drive)">
                <Input placeholder="https://drive.google.com/..." />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0' }} />

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="chinhSachCongNo" label="Chính sách công nợ">
                <Select placeholder="Chọn">
                  <Option value="Tiền mặt">Tiền mặt</Option>
                  <Option value="Công nợ 30 ngày">Công nợ 30 ngày</Option>
                  <Option value="Công nợ 60 ngày">Công nợ 60 ngày</Option>
                  <Option value="Trả trước">Trả trước</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="chinhSachHoaDon" label="Chính sách hóa đơn">
                <Input placeholder="Đủ SL, đúng giá..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="mucDoTinCay" label="Mức độ tin cậy">
                <Select placeholder="Đánh giá">
                  <Option value="Cao">Cao</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Thấp">Thấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="thoiGianSx" label="Thời gian SX">
                <Input placeholder="10-15 ngày" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="chinhSachGiaoNhan" label="Chính sách giao nhận">
                <Input placeholder="TP/ngoại tỉnh..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="danhGiaNspt" label="Đánh giá từ NSPT">
                <Select placeholder="Chọn kết quả">
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

export default SupplierSurvey;
