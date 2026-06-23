const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'TaiLieu_ThuMua_DEGO_Final.html');
let html = fs.readFileSync(filePath, 'utf8');

const updates = {
  'TC-01': { status: 'P', note: '' },
  'TC-02': { status: 'F', note: 'Cho lưu' },
  'TC-03': { status: 'P', note: '' },
  'TC-04': { status: 'P', note: '' },
  'TC-05': { status: 'P', note: '' },
  'TC-06': { status: 'P', note: '' },
  'TC-07': { status: 'P', note: '' },
  'TC-08': { status: 'P', note: '' },
  'TC-09': { status: 'P', note: '' },
  'TC-10': { status: 'P', note: '' },
  'TC-11': { status: 'F', note: 'Lỗi chưa gắn nhân sự xử lý -> ko lưu đc' },
  'TC-12': { status: 'F', note: '' },
  'TC-13': { status: 'P', note: '' },
  'TC-14': { status: 'F', note: 'Không có chức năng này' },
  'Thực tế: "Đã gửi vẫn chỉnh sửa được"': '', // Just a mental note
  'TC-15': { status: 'F', note: 'Đã gửi vẫn chỉnh sửa được' },
  'TC-16': { status: 'P', note: '' },
  'TC-17': { status: 'F', note: 'Sửa được' },
  'TC-18': { status: 'P', note: '' },
  'TC-19': { status: 'P', note: '' },
  'TC-20': { status: 'P', note: '' },
  'TC-21': { status: 'P', note: '' },
  'TC-22': { status: 'P', note: '' },
  'TC-23': { status: 'P', note: '' },
  'TC-24': { status: 'F', note: 'Trạng thái đã gửi -> edit được' },
  'TC-25': { status: 'F', note: 'Chưa có chức năng' },
  'TC-26': { status: 'F', note: 'Chưa có chức năng, chỉ có hủy' },
  'TC-27': { status: 'P', note: '' },
  'TC-28': { status: 'P', note: '' },
  'TC-29': { status: 'P', note: '' },
  'TC-30': { status: 'F', note: 'Chưa có chức năng' },
  'TC-31': { status: 'P', note: '' },
  'TC-32': { status: 'F', note: 'Chưa có chức năng' },
  'TC-33': { status: 'P', note: '' },
  'TC-34': { status: 'F', note: 'Chưa có' },
  'TC-35': { status: 'P', note: '' },
  'TC-36': { status: 'F', note: 'Có chức năng ẩn mục này' },
  'TC-37': { status: 'F', note: 'Trạng thái: Chờ nhận hàng' },
  'TC-38': { status: 'F', note: 'Không có chức năng' },
  'TC-39': { status: 'F', note: 'Trạng thái: Hủy đơn' }
};

// Regex to find table rows
// Example row: <tr><td>TC-01</td><td>...</td><td>...</td><td></td></tr>
const trRegex = /<tr><td>(TC-\d{2})<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g;

html = html.replace(trRegex, (match, tc, desc, expected, pf) => {
  if (updates[tc]) {
    const data = updates[tc];
    
    // Add note to expected column if exists
    let newExpected = expected;
    if (data.note) {
      newExpected += `<div style="color:var(--red); font-style:italic; font-weight:600; margin-top:4px;">Thực tế: ${data.note}</div>`;
    }

    // Add P/F status
    let newPf = pf;
    if (data.status === 'P') {
      newPf = `<b style="color:var(--green); font-size:12pt;">P</b>`;
    } else if (data.status === 'F') {
      newPf = `<b style="color:var(--red); font-size:12pt;">F</b>`;
    }

    return `<tr><td>${tc}</td><td>${desc}</td><td>${newExpected}</td><td style="text-align:center; vertical-align:middle;">${newPf}</td></tr>`;
  }
  return match;
});

// Update the summary at the bottom too
const passedCount = Object.values(updates).filter(u => u.status === 'P').length;
const failedCount = Object.values(updates).filter(u => u.status === 'F').length;
const totalTested = passedCount + failedCount;

html = html.replace(
  /Kết luận: ☐ PASS \/ ☐ CONDITIONAL PASS \/ ☐ FAIL/, 
  `Kết luận: ☑ FAIL (Đã test ${totalTested}/48 TC - Pass: ${passedCount}, Fail: ${failedCount})`
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('HTML updated with test results.');
