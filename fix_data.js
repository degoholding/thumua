const fs = require('fs');

const app = fs.readFileSync('legacy/app.js', 'utf8');

const donvi = app.match(/donViData = (\[[\s\S]*?\]);/)[1];
const ncc = app.match(/nccData = (\[[\s\S]*?\]);/)[1];
const nhansuText = app.match(/nhanSuData = (\[[\s\S]*?\]);/)[1];

// Parse nhansu array to dynamically compute departmentsData
const nhanSuArray = eval(nhansuText);
let deptsMap = {};
nhanSuArray.forEach(ns => {
    if (ns.dept) {
        if (!deptsMap[ns.dept]) {
            deptsMap[ns.dept] = { dept: ns.dept, manager: ns.manager || '', email: '' };
        }
    }
});
const deptsArray = Object.values(deptsMap);
const depts = JSON.stringify(deptsArray, null, 4);

const additional = `
export const mockUsers = [
  { username: 'nsyc', fullName: 'Nhân sự Yêu Cầu', role: 'NSYC' },
  { username: 'tbp', fullName: 'Trưởng Bộ Phận', role: 'TBP' },
  { username: 'qltm', fullName: 'Quản Lý Thu Mua', role: 'QLTM' },
  { username: 'nstm1', fullName: 'NSTM Giang', role: 'NSTM' },
  { username: 'nstm2', fullName: 'NSTM An', role: 'NSTM' },
  { username: 'admin', fullName: 'Administrator', role: 'Admin' }
];

export const defaultSupplierSurvey = [
  {
    maYc: 'PYC.NM.280326.01',
    ngayTiepNhan: '2026-06-28',
    tenNcc: 'CÔNG TY TNHH BAO BÌ ĐÔNG TÂY',
    sdt: '0909123456',
    danhGiaNspt: 'Đạt',
    duyetTp: 'Duyệt',
    nhomHang: 'Bao bì'
  },
  {
    maYc: 'PYC.NM.280326.02',
    ngayTiepNhan: '2026-06-29',
    tenNcc: 'CÔNG TY TNHH QUẢNG CÁO MỘC ẤN',
    sdt: '0918765432',
    danhGiaNspt: 'Không đạt',
    duyetTp: 'Không duyệt',
    nhomHang: 'In ấn'
  }
];

export const defaultProductSurvey = [
  {
    maYc: 'PYC.NM.280326.01',
    tenNcc: 'CÔNG TY TNHH BAO BÌ ĐÔNG TÂY',
    tenSp: 'Thùng carton 5 lớp',
    dvtBaoGia: 'Cái',
    khungSl: '500-1000',
    giaKhungSl: 15000,
    vat: 8,
    ketQuaLab: 'Đạt',
    duyetTp: 'Duyệt'
  },
  {
    maYc: 'PYC.NM.280326.02',
    tenNcc: 'CÔNG TY TNHH QUẢNG CÁO MỘC ẤN',
    tenSp: 'Tem nhãn decal',
    dvtBaoGia: 'Con',
    khungSl: '1000-5000',
    giaKhungSl: 500,
    vat: 8,
    ketQuaLab: 'Không đạt',
    duyetTp: 'Không duyệt'
  }
];
`;

fs.writeFileSync('src/data.js', `export const defaultDonVi = ${donvi};\nexport const defaultNcc = ${ncc};\nexport const defaultNhanSu = ${nhansuText};\nexport const defaultDepartments = ${depts};\n${additional}`, 'utf8');

console.log('Done!');
