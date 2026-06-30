const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'pages', 'Intake.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add states for Assign and MyProducts
content = content.replace(
  const [googleNhanSu, setGoogleNhanSu] = useState(null);,
  const [googleNhanSu, setGoogleNhanSu] = useState(null);
  
  // State for Assign (Phân b?)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningRecord, setAssigningRecord] = useState(null);
  
  // State for My Products (Ti?p nh?n)
  const [isMyProductsModalOpen, setIsMyProductsModalOpen] = useState(false);
  const [myProductsRecord, setMyProductsRecord] = useState(null);
  
);

// 2. Add Handlers for Assign and MyProducts
content = content.replace(
  const handlePrint = (record) => {,
  const handleOpenAssign = (record, index) => {
    setAssigningRecord({ ...record, index });
    setIsAssignModalOpen(true);
  };
  
  const handleSaveAssign = () => {
    const newData = [...data];
    newData[assigningRecord.index].products = assigningRecord.products;
    saveToStorage(newData);
    message.success('Ðã luu phân b?');
    setIsAssignModalOpen(false);
  };

  const handleOpenMyProducts = (record, index) => {
    setMyProductsRecord({ ...record, index });
    setIsMyProductsModalOpen(true);
  };

  const handleAcceptProduct = (productIndex) => {
    const newData = [...data];
    newData[myProductsRecord.index].products[productIndex].status = 'Ðã ti?p nh?n';
    saveToStorage(newData);
    // Refresh modal state
    setMyProductsRecord(newData[myProductsRecord.index]);
    message.success('Ðã ti?p nh?n s?n ph?m');
  };

  const handlePrint = (record) => {
);

// 3. Update Action Column
content = content.replace(
  ender: (_, record, index) => (
        <Space size="small" style={{ whiteSpace: 'nowrap' }}>
          {record.status === 'Ðã duy?t' && (,
  ender: (_, record, index) => {
        const isMyPyc = currentRole === 'NSTM' && (record.products || []).some(p => p.assignedTo === currentUser);
        return (
        <Space size="small" style={{ whiteSpace: 'nowrap' }}>
          {(currentRole === 'QLTM' || currentRole === 'Admin') && record.status === 'Ðã duy?t QLTM' && (
            <Tooltip title="Phân b? NSTM">
              <Button type="text" icon={<Users size={16} style={{ color: '#ec4899' }} />} onClick={() => handleOpenAssign(record, index)} />
            </Tooltip>
          )}
          {isMyPyc && (
            <Tooltip title="S?n ph?m du?c giao">
              <Button type="text" icon={<CheckSquare size={16} style={{ color: '#059669' }} />} onClick={() => handleOpenMyProducts(record, index)} />
            </Tooltip>
          )}
          {record.status === 'Ðã duy?t' && (
);

// 4. Update Kh?o sát buttons conditions inside the Action Column (optional) - Actually let's just make it 'Ðã duy?t QLTM'
content = content.replace(
  {record.status === 'Ðã duy?t' && (,
  {record.status === 'Ðã duy?t QLTM' && (
);

// 5. Update Status colors
content = content.replace(
  if (st === 'Ch? duy?t') color = 'processing';
        if (st === 'Ðã duy?t') color = 'success';,
  if (st === 'Ch? TBP duy?t') color = 'warning';
        if (st === 'Ðã duy?t TBP') color = 'processing';
        if (st === 'Ðã duy?t QLTM') color = 'success';
);

// 6. Update Form Buttons (Modal footer)
content = content.replace(
  (editingRecord && editingRecord.status === 'Ch? duy?t') && (
            <Button 
              key="reject" ,
  (editingRecord && (
            (currentRole === 'TBP' && editingRecord.status === 'Ch? TBP duy?t') || 
            (currentRole === 'QLTM' && editingRecord.status === 'Ðã duy?t TBP') ||
            (currentRole === 'Admin' && (editingRecord.status === 'Ch? TBP duy?t' || editingRecord.status === 'Ðã duy?t TBP'))
          )) && (
            <Button 
              key="reject" 
);

content = content.replace(
  (editingRecord && editingRecord.status === 'Ch? duy?t') && (
            <Button 
              key="approve" ,
  (editingRecord && (
            (currentRole === 'TBP' && editingRecord.status === 'Ch? TBP duy?t') || 
            (currentRole === 'QLTM' && editingRecord.status === 'Ðã duy?t TBP') ||
            (currentRole === 'Admin' && (editingRecord.status === 'Ch? TBP duy?t' || editingRecord.status === 'Ðã duy?t TBP'))
          )) && (
            <Button 
              key="approve" 
);

// 7. Inject AssignModal and MyProductsModal before final closing div
const modalsToInject = \
      <Modal
        title={"Phân b? NSTM cho PYC: " + (assigningRecord?.pycCode || '')}
        open={isAssignModalOpen}
        onCancel={() => setIsAssignModalOpen(false)}
        onOk={handleSaveAssign}
        width={800}
        okText="Luu Phân b?"
        cancelText="H?y"
      >
        <Table 
          dataSource={assigningRecord?.products || []}
          pagination={false}
          rowKey={(r, i) => i}
          columns={[
            { title: 'Tên s?n ph?m', dataIndex: 'name', key: 'name' },
            { title: 'S? lu?ng', dataIndex: 'qty', key: 'qty' },
            { 
              title: 'Giao cho NSTM', 
              key: 'assign',
              render: (_, record, i) => (
                <Select
                  style={{ width: '100%' }}
                  value={record.assignedTo}
                  placeholder="-- Ch?n NSTM --"
                  options={mockUsers.filter(u => u.role === 'NSTM').map(u => ({ label: u.fullName, value: u.username }))}
                  onChange={(val) => {
                    const newData = {...assigningRecord};
                    newData.products[i].assignedTo = val;
                    newData.products[i].status = 'Ch? ti?p nh?n';
                    setAssigningRecord(newData);
                  }}
                  allowClear
                />
              )
            },
            {
              title: 'Tr?ng thái',
              key: 'status',
              dataIndex: 'status',
              render: (st) => <Tag color={st === 'Ðã ti?p nh?n' ? 'green' : 'orange'}>{st || 'Chua giao'}</Tag>
            }
          ]}
        />
      </Modal>

      <Modal
        title={"S?n ph?m du?c giao - " + (myProductsRecord?.pycCode || '')}
        open={isMyProductsModalOpen}
        onCancel={() => setIsMyProductsModalOpen(false)}
        footer={[<Button key="close" onClick={() => setIsMyProductsModalOpen(false)}>Ðóng</Button>]}
        width={900}
      >
        <Table 
          dataSource={(myProductsRecord?.products || []).filter(p => p.assignedTo === currentUser)}
          pagination={false}
          rowKey={(r, i) => i}
          columns={[
            { title: 'Tên s?n ph?m', dataIndex: 'name', key: 'name' },
            { title: 'S? lu?ng', dataIndex: 'qty', key: 'qty' },
            { title: 'Tr?ng thái', dataIndex: 'status', key: 'status', render: st => <Tag color={st === 'Ðã ti?p nh?n' ? 'green' : 'orange'}>{st}</Tag> },
            {
              title: 'Hành d?ng',
              key: 'action',
              render: (_, record) => {
                // Find original index
                const originalIndex = myProductsRecord.products.findIndex(p => p === record);
                if (record.status !== 'Ðã ti?p nh?n') {
                  return (
                    <Button type="primary" size="small" onClick={() => handleAcceptProduct(originalIndex)}>
                      Ch?p thu?n
                    </Button>
                  );
                } else {
                  return (
                    <Space>
                      <Button size="small" type="dashed" onClick={() => {
                        setIsMyProductsModalOpen(false);
                        navigate(\/supplier-survey?pyc=\\);
                      }}>KS NCC</Button>
                      <Button size="small" type="dashed" onClick={() => {
                        setIsMyProductsModalOpen(false);
                        navigate(\/product-survey?pyc=\\);
                      }}>KS SP</Button>
                    </Space>
                  );
                }
              }
            }
          ]}
        />
      </Modal>
\;

content = content.replace('    </div>\n  );\n};\n\nexport default Intake;', modalsToInject + '    </div>\n  );\n};\n\nexport default Intake;');

fs.writeFileSync(file, content);
console.log('Patched Intake.jsx successfully');
