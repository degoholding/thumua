const fs = require('fs');
const path = require('path');

const filePath = 'd:/01.Soft/pltgiang/thu_mua_tool/src/pages/Intake.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. State for nccOptions and googleEmail effect
const stateMatch = `  const [donviOptions, setDonviData] = useState([]);
  const [nhansuOptions, setNhansuData] = useState([]);`;
const stateReplacement = `  const [donviOptions, setDonviData] = useState([]);
  const [nhansuOptions, setNhansuData] = useState([]);
  const [nccOptions, setNccData] = useState([]);
  const googleEmail = localStorage.getItem('googleEmail');
  const [googleNhanSu, setGoogleNhanSu] = useState(null);`;
content = content.replace(stateMatch, stateReplacement);

// 2. Load ncc data in useEffect
const useEffectMatch = `    const storedNhansu = localStorage.getItem('nhansuData');
    const parsedNhansu = storedNhansu && JSON.parse(storedNhansu).length > 0 ? JSON.parse(storedNhansu) : defaultNhanSu;
    setNhansuData(parsedNhansu.map(ns => ({ label: ns.name, value: ns.name })));`;
const useEffectReplacement = `    const storedNhansu = localStorage.getItem('nhansuData');
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
    setNccData(parsedNcc.map(ncc => ({ label: ncc.name, value: ncc.name, mst: ncc.mst })));`;
content = content.replace(useEffectMatch, useEffectReplacement);

// 3. handleAdd and change handlers
const handleAddMatch = `  const handleAdd = () => {
    setEditingRecord(null);
    setProducts([]);
    form.resetFields();
    form.setFieldsValue({ ngaytn: dayjs(), showCode: true });
    setIsModalOpen(true);
  };`;
const handleAddReplacement = `  const handleAdd = () => {
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
  };`;
content = content.replace(handleAddMatch, handleAddReplacement);

// 4. Update the form fields
// Replace the nhansu form item
content = content.replace(
  /<Form.Item name="nhansu" label="Nhân sự YC" rules={\[{ required: true }\]}><Select options={nhansuOptions} placeholder="-- Chọn Nhân sự --" \/><\/Form.Item>/,
  `<Form.Item name="nhansu" label="Nhân sự YC" rules={[{ required: true }]}><Select options={nhansuOptions} placeholder="-- Chọn Nhân sự --" onChange={handleNhanSuChange} disabled={!!googleNhanSu} /></Form.Item>`
);

// Replace the ncc form item
content = content.replace(
  /<Form.Item name="ncc" label="Tên nhà cung cấp đề xuất \(Nếu có\)"><Input placeholder="-- Nhập tên NCC --" \/><\/Form.Item>/,
  `<Form.Item name="ncc" label="Tên nhà cung cấp đề xuất (Nếu có)"><Select options={nccOptions} placeholder="-- Chọn NCC --" onChange={handleNccChange} allowClear showSearch /></Form.Item>`
);

// 5. Update the UI Table summary to include VAT
const summaryMatch = `              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5} align="right"><strong>Cộng:</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right"><strong>{totalProductAmount.toLocaleString()}</strong></Table.Summary.Cell>
                  <Table.Summary.Cell index={2} colSpan={2}></Table.Summary.Cell>
                </Table.Summary.Row>
              )}`;
const summaryReplacement = `              summary={() => {
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
              }}`;
content = content.replace(summaryMatch, summaryReplacement);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Update Intake.jsx complete!');
