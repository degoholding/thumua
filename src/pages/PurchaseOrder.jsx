import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message, Select, DatePicker, Row, Col, Divider, Tag } from 'antd';
import { Pencil, Trash2, Plus, Printer, Download } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import POPrintFormat from '../components/POPrintFormat';
import { defaultDonVi, defaultNcc } from '../data';

const { Option } = Select;
const { TextArea } = Input;

const defaultAgreements = {
  payment_terms_template: "Công nợ 30 ngày",
  custom_invoice_receive_time: "Chậm nhất 24h kể từ khi nhận hàng",
  custom_delivery_method: "Giao hàng tận nơi",
  custom_buyer_contact: "",
  custom_billing_email: "phongsanxuat.luutru@gmail.com",
  terms: ""
};

const PurchaseOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pycFromUrl = searchParams.get('pyc');

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('poData');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Data for Select options
  const [pycList, setPycList] = useState([]);
  const [nccOptions, setNccOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

  // Printing state
  const [printingDoc, setPrintingDoc] = useState(null);

  const [form] = Form.useForm();
  
  // Items array (inner editable table)
  const [items, setItems] = useState([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [itemForm] = Form.useForm();

  useEffect(() => {
    // Load options
    const storedPyc = localStorage.getItem('pycData');
    if (storedPyc) {
      setPycList(JSON.parse(storedPyc).filter(p => p.status === 'Đã duyệt'));
    }

    const storedNcc = localStorage.getItem('nccData');
    const parsedNcc = storedNcc ? JSON.parse(storedNcc) : defaultNcc;
    setNccOptions(parsedNcc);

    const storedDonVi = localStorage.getItem('donviData');
    const parsedDonVi = storedDonVi ? JSON.parse(storedDonVi) : defaultDonVi;
    setCompanyOptions(parsedDonVi);
  }, []);

  useEffect(() => {
    if (pycFromUrl && pycList.length > 0) {
      handleAdd(pycFromUrl);
      // Remove query param to prevent reopening
      searchParams.delete('pyc');
      setSearchParams(searchParams);
    }
  }, [pycFromUrl, pycList]);

  const saveToStorage = (newData) => {
    setData(newData);
    localStorage.setItem('poData', JSON.stringify(newData));
  };

  const handleAdd = (prefillPycCode = null) => {
    setEditingRecord(null);
    setItems([]);
    form.resetFields();
    
    let defaultVals = {
      transaction_date: dayjs(),
      poCode: `PO-${dayjs().format('YYYYMMDD')}-${Math.floor(Math.random()*100)}`,
      ...defaultAgreements
    };

    if (typeof prefillPycCode === 'string') {
      const pyc = pycList.find(p => p.pycCode === prefillPycCode);
      if (pyc) {
        defaultVals = { ...defaultVals, ...mapPycToPo(pyc) };
        if (pyc.products) {
          setItems(pyc.products.map(p => ({
            item_code: p.code,
            item_name: p.name,
            uom: p.unit,
            qty: p.qty,
            rate: p.price,
            tax_rate: 8, // Default 8%
            description: p.note
          })));
        }
      }
    }

    form.setFieldsValue(defaultVals);
    setIsModalOpen(true);
  };

  const mapPycToPo = (pyc) => {
    return {
      pycCode: pyc.pycCode,
      company: pyc.donvi,
      company_name: pyc.donvi,
      supplier: pyc.ncc,
      supplier_name: pyc.ncc,
    };
  };

  const handlePycChange = (val) => {
    const pyc = pycList.find(p => p.pycCode === val);
    if (pyc) {
      const mapped = mapPycToPo(pyc);
      form.setFieldsValue(mapped);
      if (pyc.products) {
        setItems(pyc.products.map(p => ({
          item_code: p.code,
          item_name: p.name,
          uom: p.unit,
          qty: p.qty,
          rate: p.price,
          tax_rate: 8,
          description: p.note
        })));
      }
    }
  };

  const handleEdit = (record, index) => {
    setEditingRecord({ ...record, index });
    setItems(record.items || []);
    form.setFieldsValue({
      ...record,
      transaction_date: record.transaction_date ? dayjs(record.transaction_date) : null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    saveToStorage(newData);
    message.success('Đã xóa PO');
  };

  const handleBatchDelete = () => {
    const newData = data.filter((_, index) => !selectedRowKeys.includes(index));
    saveToStorage(newData);
    setSelectedRowKeys([]);
    message.success(`Đã xóa ${selectedRowKeys.length} PO`);
  };

  const handlePrint = (record) => {
    // Enrich with supplier and company address if needed before print
    const comp = companyOptions.find(c => c.shortName === record.company || c.fullName === record.company);
    const supp = nccOptions.find(s => s.name === record.supplier);

    const enrichRecord = {
      ...record,
      company_address_display: comp ? comp.address : "Cần Thơ",
      company_tax_id: comp ? "1801648xxx" : "", // mock
      supplier_address_display: supp ? supp.address : "",
    };

    setPrintingDoc(enrichRecord);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const record = {
        ...values,
        transaction_date: values.transaction_date ? values.transaction_date.format('YYYY-MM-DD') : null,
        items: items,
      };

      const newData = [...data];
      if (editingRecord !== null) {
        newData[editingRecord.index] = record;
        message.success('Đã cập nhật PO');
      } else {
        newData.push(record);
        message.success('Đã tạo PO mới');
      }
      saveToStorage(newData);
      setIsModalOpen(false);
    });
  };

  // --- ITEM MODAL FUNCTIONS ---
  const handleAddItem = () => {
    setEditingItemIndex(null);
    itemForm.resetFields();
    itemForm.setFieldsValue({ tax_rate: 8 });
    setIsItemModalOpen(true);
  };

  const handleEditItem = (record, index) => {
    setEditingItemIndex(index);
    itemForm.setFieldsValue(record);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = () => {
    itemForm.validateFields().then(values => {
      const newItems = [...items];
      if (editingItemIndex !== null) {
        newItems[editingItemIndex] = values;
      } else {
        newItems.push(values);
      }
      setItems(newItems);
      setIsItemModalOpen(false);
    });
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // --- COLUMNS ---
  const mainColumns = [
    { title: 'Mã PO', dataIndex: 'poCode', key: 'poCode', render: t => <strong>{t}</strong> },
    { title: 'Ngày lập', dataIndex: 'transaction_date', key: 'transaction_date' },
    { title: 'Mã PYC', dataIndex: 'pycCode', key: 'pycCode', render: t => <Tag color="blue">{t}</Tag> },
    { title: 'Công ty', dataIndex: 'company', key: 'company' },
    { title: 'Nhà cung cấp', dataIndex: 'supplier', key: 'supplier' },
    { 
      title: 'Tổng tiền (đã VAT)', 
      key: 'total', 
      align: 'right',
      render: (_, record) => {
        const total = (record.items || []).reduce((sum, item) => {
          const qty = Number(item.qty) || 0;
          const rate = Number(item.rate) || 0;
          const taxRate = Number(item.tax_rate) || 0;
          return sum + (qty * rate * (1 + taxRate / 100));
        }, 0);
        return <strong>{total.toLocaleString()} đ</strong>;
      }
    },
    { title: 'Hành động', key: 'action', align: 'right', width: 140,
      render: (_, record, index) => (
        <Space size="small">
          <Button type="text" icon={<Printer size={16} style={{ color: '#8b5cf6' }} />} onClick={() => handlePrint(record)} title="In phiếu" />
          <Button type="text" icon={<Pencil size={16} style={{ color: '#0275d8' }} />} onClick={() => handleEdit(record, index)} />
          <Popconfirm title="Xóa PO này?" onConfirm={() => handleDelete(index)} okText="Đồng ý" cancelText="Hủy">
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const itemColumns = [
    { title: 'Mã HH', dataIndex: 'item_code', key: 'item_code' },
    { title: 'Tên hàng hóa', dataIndex: 'item_name', key: 'item_name' },
    { title: 'ĐVT', dataIndex: 'uom', key: 'uom', width: 70 },
    { title: 'SL', dataIndex: 'qty', key: 'qty', align: 'right', width: 80 },
    { title: 'Đơn giá (chưa VAT)', dataIndex: 'rate', key: 'rate', align: 'right', render: t => t?.toLocaleString() },
    { title: 'VAT (%)', dataIndex: 'tax_rate', key: 'tax_rate', align: 'center', width: 80, render: t => `${t || 0}%` },
    { title: '', key: 'action', width: 80, align: 'center',
      render: (_, record, index) => (
        <Space size="small">
          <Button type="text" size="small" icon={<Pencil size={14} style={{ color: '#0275d8' }} />} onClick={() => handleEditItem(record, index)} />
          <Button type="text" size="small" danger icon={<Trash2 size={14} />} onClick={() => handleDeleteItem(index)} />
        </Space>
      ),
    },
  ];

  return (
    <div className="page-content" style={{ display: 'block' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Đơn Đặt Hàng (PO)</h2>
          <p className="page-subtitle" style={{ margin: '5px 0 0 0' }}>Tạo và in ấn Đơn đặt hàng từ PYC</p>
        </div>
        <Space style={{ flexWrap: 'wrap' }}>
          {selectedRowKeys.length > 0 && (
            <Popconfirm title={`Xóa ${selectedRowKeys.length} PO đã chọn?`} onConfirm={handleBatchDelete} okText="Đồng ý" cancelText="Hủy">
              <Button danger icon={<Trash2 size={16} />}>Xóa ({selectedRowKeys.length})</Button>
            </Popconfirm>
          )}
          <Button type="primary" icon={<Plus size={16} />} onClick={() => handleAdd()}>Tạo PO Mới</Button>
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

      {/* === MODAL FORM PO === */}
      <Modal
        title={editingRecord ? "Cập nhật Đơn Đặt Hàng" : "Tạo Đơn Đặt Hàng (PO)"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu PO"
        cancelText="Hủy"
        width={1000}
      >
        <Form form={form} layout="vertical">

          <Divider orientation="left" style={{ fontWeight: 'bold', color: '#1E7F9C' }}>THÔNG TIN CHUNG</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="poCode" label="Mã PO" rules={[{ required: true }]}>
                <Input placeholder="PO-..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="transaction_date" label="Ngày lập">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="pycCode" label="Kế thừa từ PYC">
                <Select placeholder="Chọn PYC" allowClear onChange={handlePycChange}>
                  {pycList.map(p => <Option key={p.pycCode} value={p.pycCode}>{p.pycCode} ({p.donvi})</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="company" label="Công ty (Bên mua)" rules={[{ required: true }]}>
                <Select placeholder="Chọn Công ty" allowClear>
                  {companyOptions.map(c => <Option key={c.shortName} value={c.shortName}>{c.fullName}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="supplier" label="Nhà cung cấp (Kính gửi)" rules={[{ required: true }]}>
                <Select placeholder="Chọn NCC" allowClear>
                  {nccOptions.map(n => <Option key={n.name} value={n.name}>{n.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" style={{ fontWeight: 'bold', color: '#1E7F9C' }}>DANH SÁCH SẢN PHẨM</Divider>
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <Button type="dashed" icon={<Plus size={16} />} onClick={handleAddItem}>Thêm Sản phẩm</Button>
            </div>
            <Table
              columns={itemColumns}
              dataSource={items.map((item, i) => ({ ...item, key: i }))}
              pagination={false}
              size="small"
              bordered
            />
          </div>

          <Divider orientation="left" style={{ fontWeight: 'bold', color: '#1E7F9C' }}>THỎA THUẬN KHÁC</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="payment_terms_template" label="Thời gian thanh toán/ Số ngày công nợ">
                <Input placeholder="VD: Công nợ 30 ngày" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="custom_invoice_receive_time" label="Thời gian nhận hóa đơn">
                <Input placeholder="VD: Chậm nhất 24h kể từ khi nhận hàng" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="custom_delivery_method" label="Phương thức giao nhận">
                <Input placeholder="Giao hàng tận nơi" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="custom_buyer_contact" label="Người liên hệ bên mua">
                <Input placeholder="SĐT người nhận" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="custom_billing_email" label="Mail nhận hóa đơn">
                <Input placeholder="Email kế toán" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="custom_attached_info" label="Các thông tin, file, hình ảnh gửi kèm">
                <Input placeholder="File đính kèm..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="terms" label="Ghi chú / Điều khoản khác">
                <TextArea rows={2} placeholder="Nội dung điều khoản bổ sung" />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Modal>

      {/* === MODAL ITEM === */}
      <Modal
        title={editingItemIndex !== null ? "Sửa SP" : "Thêm SP vào PO"}
        open={isItemModalOpen}
        onOk={handleSaveItem}
        onCancel={() => setIsItemModalOpen(false)}
        okText="Lưu"
        width={700}
      >
        <Form form={itemForm} layout="vertical">
          <Row gutter={16}>
            <Col span={8}><Form.Item name="item_code" label="Mã SP"><Input /></Form.Item></Col>
            <Col span={16}><Form.Item name="item_name" label="Tên SP" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}><Form.Item name="custom_item_specs" label="Xuất xứ/ TSKT/ chất liệu"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="uom" label="ĐVT" rules={[{ required: true }]}><Input /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="qty" label="Số lượng" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={8}><Form.Item name="rate" label="Đơn giá (chưa VAT)" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} /></Form.Item></Col>
            <Col span={8}><Form.Item name="tax_rate" label="VAT (%)"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="warehouse" label="Kho nhận"><Input /></Form.Item></Col>
            <Col span={12}><Form.Item name="custom_invoice_name" label="Tên xuất hóa đơn"><Input /></Form.Item></Col>
          </Row>
          <Form.Item name="description" label="Ghi chú"><TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>

      {/* RENDER IN ẤN ẨN */}
      {printingDoc && <POPrintFormat doc={printingDoc} />}

    </div>
  );
};

export default PurchaseOrder;
