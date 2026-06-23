const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'TaiLieu_ThuMua_DEGO_Final.html');
let html = fs.readFileSync(filePath, 'utf8');

const replacements = [
  [/<i>System<\/i>/g, ''],
  [/<i>Date updated<\/i>/g, ''],
  [/<i>Module<\/i>/g, ''],
  [/<i>Target Audience<\/i>/g, ''],
  [/<i>Author<\/i>/g, ''],
  [/<i>Version<\/i>/g, ''],
  [/\(Buying\)/g, ''],
  [/Quản lý \/ Trưởng phòng/g, 'Trưởng bộ phận'],
  [/TP\/QL/g, 'TBP'],
  [/KS\.NCC/g, 'Khảo sát Nhà cung cấp'],
  [/KS\.SP/g, 'Khảo sát Sản phẩm'],
  [/Tổng KS/g, 'Tổng Khảo sát'],
  [/Company/g, 'Công ty'],
  [/Required Date/g, 'Ngày bắt buộc giao hàng'],
  [/Department/g, 'Phòng ban'],
  [/Receiving Warehouse/g, 'Kho nhận hàng'],
  [/Items is required/g, 'Bắt buộc phải có Hàng hóa'],
  [/bảng Items/g, 'bảng Hàng hóa'],
  [/dòng Items/g, 'dòng Hàng hóa'],
  [/thêm Items/g, 'thêm Hàng hóa'],
  [/Item Code/g, 'Mã hàng'],
  [/item_code/g, 'mã hàng'],
  [/Item Name/g, 'Tên hàng'],
  [/Total Qty/g, 'Tổng số lượng'],
  [/Total Amount/g, 'Tổng tiền'],
  [/Amount/g, 'Thành tiền'],
  [/Qty/g, 'Số lượng'],
  [/qty/g, 'số lượng'],
  [/Draft \/ Surveying/g, 'Nháp / Đang khảo sát'],
  [/Draft/g, 'Nháp'],
  [/Submitted/g, 'Đã gửi'],
  [/Approved/g, 'Đã duyệt'],
  [/Returned/g, 'Bị trả lại'],
  [/Assigned/g, 'Đã phân công'],
  [/Ordered/g, 'Đã đặt hàng'],
  [/Received/g, 'Đã nhận hàng'],
  [/Under Review/g, 'Đang chờ duyệt'],
  [/Rejected/g, 'Từ chối'],
  [/Person in Charge/g, 'Người phụ trách'],
  [/danh mục Supplier/g, 'danh mục Nhà cung cấp'],
  [/proposed_rate/g, 'giá đề xuất'],
  [/rate/g, 'đơn giá'],
  [/read-only/g, 'chỉ xem'],
  [/<span>Overview & Roles<\/span>/g, ''],
  [/<span>Request Phase<\/span>/g, ''],
  [/<span>Supplier Survey<\/span>/g, ''],
  [/<span>Product Survey<\/span>/g, ''],
  [/<span>Purchase Order & Tips<\/span>/g, ''],
  [/<span>Test Cases: Request<\/span>/g, ''],
  [/<span>Test Cases: Supplier Survey<\/span>/g, ''],
  [/<span>Test Cases: Product Survey<\/span>/g, ''],
  [/<span>Test Cases: Purchase Order & E2E<\/span>/g, ''],
  [/<span>Auto Calculations & Summary<\/span>/g, ''],
  [/Quản lý sẽ duyệt/g, 'Trưởng bộ phận sẽ duyệt'],
  [/Chờ Quản lý xem xét/g, 'Chờ Trưởng bộ phận xem xét'],
  [/List View/g, 'Danh sách']
];

for (const [pattern, replacement] of replacements) {
  html = html.replace(pattern, replacement);
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('HTML updated.');

// Update pdf.js too
const pdfjsPath = path.join(__dirname, 'scratch_pdf', 'pdf.js');
let pdfjs = fs.readFileSync(pdfjsPath, 'utf8');
pdfjs = pdfjs.replace(/<i style="display:block;color:#8A95A0;font-style:italic;">USER GUIDE & TEST CASES<\/i>/g, '');
pdfjs = pdfjs.replace(/Tài liệu hệ thống ERP · Module Thu Mua \(Procurement\)/g, 'Tài liệu hệ thống ERP · Phân hệ Thu Mua');
fs.writeFileSync(pdfjsPath, pdfjs, 'utf8');
console.log('pdf.js updated.');
