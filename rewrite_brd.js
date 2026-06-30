const fs = require('fs');

const filePath = 'd:/01.Soft/pltgiang/thu_mua_tool/BRD_Tao_Phieu_Yeu_Cau_PYC_DEGO.html';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // 1. Meta
  [/Phiên bản: v1.0/g, 'Phiên bản: v2.0'],
  [/Phiên bản v1.0/g, 'Phiên bản v2.0'],
  [/v1.0 — Bản nháp xác nhận/g, 'v2.0 — Quy trình thủ công (Google Sheet)'],

  // 2. Lead
  [/Tài liệu này được <strong>Dev<\/strong> lập/g, 'Tài liệu này được lập'],
  [/Tài liệu Dev lập để chốt lại quy trình/g, 'Tài liệu lập để chốt lại quy trình thủ công'],

  // 3. Step 3
  [/Bước 3: Số hóa và Tạo Phiếu Yêu Cầu trên Phần Mềm \(Thu Mua\)/g, 'Bước 3: Ghi nhận Yêu Cầu lên Google Sheet (Thu Mua)'],
  [/đăng nhập vào <strong>Hệ thống quản lý nội bộ \(App\)<\/strong>./g, 'mở <strong>File Google Sheet theo dõi Thu Mua<\/strong>.'],
  [/Tại giao diện Dashboard, chọn chức năng <strong>"Tạo Yêu cầu" \(Intake Form\)<\/strong>./g, 'Tại Google Sheet, mở sheet <strong>"Phiếu Yêu Cầu" (Intake)<\/strong>.'],
  [/vào các trường thông tin số hóa/g, 'vào các cột thông tin tương ứng trên bảng'],
  [/Thu mua bắt buộc phải tải lên \(upload\) các hình ảnh/g, 'Thu mua bắt buộc phải <strong>dán link (URL) tải hình ảnh/báo giá<\/strong> (lưu trên Drive) vào cột đính kèm tương ứng thay vì tải lên trực tiếp.'],
  [/, hoặc file báo giá PDF của nhà cung cấp. Điều này giúp minh bạch/g, ' Điều này giúp minh bạch'],

  // 4. Mermaid
  [/participant HT as 4. Hệ Thống \(App\)/g, 'participant GS as 4. Google Sheet'],
  [/Note over TM: Đăng nhập phần mềm/g, 'Note over TM: Mở Google Sheet'],
  [/Note over TM: Nhập liệu & Tạo PYC/g, 'Note over TM: Nhập liệu vào Sheet'],
  [/TM->>QL: Trình duyệt PYC/g, 'TM->>QL: Tag tên / Nhắn Zalo duyệt PYC'],
  [/Note over HT: ⏳ TRẠNG THÁI: CHỜ DUYỆT/g, 'Note over GS: ⏳ CỘT STATUS: CHỜ DUYỆT'],
  [/QL->>HT: Duyệt phiếu/g, 'QL->>GS: Đổi Status thành Đã duyệt'],
  [/Note over HT: ✅ TRẠNG THÁI: ĐÃ DUYỆT/g, 'Note over GS: ✅ CỘT STATUS: ĐÃ DUYỆT'],
  [/HT-->>TM: Hệ thống báo duyệt thành công/g, 'GS-->>TM: Quản lý tag lại / Nhắn Zalo'],
  [/QL->>HT: Từ chối phiếu/g, 'QL->>GS: Đổi Status thành Từ chối'],
  [/Note over HT: ❌ TRẠNG THÁI: ĐÃ HỦY/g, 'Note over GS: ❌ CỘT STATUS: ĐÃ HỦY'],
  [/HT-->>YC: Thông báo hủy yêu cầu/g, 'GS-->>YC: Thu mua báo lại qua Zalo'],

  // 5. Tables 2 & 3
  [/Đăng nhập phần mềm, nhập thông tin đã chốt từ Zalo vào form PYC. Tải lên hình ảnh sản phẩm, ảnh chat Zalo, báo giá làm bằng chứng./g, 'Mở Google Sheet, nhập thông tin đã chốt từ Zalo vào các cột. Dán link (URL) hình ảnh sản phẩm, ảnh chat Zalo, báo giá làm bằng chứng.'],
  [/Nhận thông báo duyệt từ Quản lý, tiến hành in phiếu \(nếu cần\)/g, 'Thấy trạng thái duyệt từ Quản lý trên file, tiến hành in phiếu (nếu cần)'],
  [/Nhận thông báo có PYC chờ duyệt. Đăng nhập hệ thống, rà soát nội dung phiếu/g, 'Nhận tin nhắn Zalo có PYC chờ duyệt. Mở file Google Sheet, rà soát nội dung dòng yêu cầu'],
  [/Thực hiện "Duyệt phiếu" \(hợp lệ\) hoặc "Từ chối" \(không hợp lệ, bắt buộc nhập lý do hủy\) trên hệ thống./g, 'Đổi giá trị cột Trạng thái thành "Đã duyệt" hoặc "Từ chối" (bắt buộc nhập lý do hủy vào cột Ghi chú) trên Google Sheet.'],

  // 6. Section II
  [/CHI TIẾT CÁC TRƯỜNG DỮ LIỆU TRÊN FORM/g, 'CHI TIẾT CÁC CỘT DỮ LIỆU TRÊN BẢNG GOOGLE SHEET'],
  [/Dưới đây là chi tiết các thông tin Dev đã thiết kế trên form tạo PYC./g, 'Dưới đây là chi tiết các thông tin cần nhập liệu lên bảng Google Sheet.'],
  [/Trường trên Form/g, 'Cột trên Sheet'],
  [/Tự động sinh \(VD: <span class="fig">PYC-123<\/span>\) nếu để trống. Có thể tự gõ nếu muốn mã riêng./g, 'Tự gõ hoặc dùng công thức Google Sheet tạo mã tự động (VD: <span class="fig">PYC-123<\/span>).'],
  [/Nhập text \(hệ thống tự điền theo Nhân sự đã chọn\)./g, 'Nhập text (hoặc dùng hàm VLOOKUP tự điền theo Nhân sự đã chọn).'],
  [/<strong>Tự động tính:<\/strong> = Số lượng × Đơn giá./g, '<strong>Công thức Sheet:<\/strong> = Số lượng × Đơn giá.'],
  [/Upload File \(Ảnh, PDF\)./g, 'Dán link Google Drive (Ảnh, PDF).'],
  [/trên form/g, 'trên bảng'], // for small things like "Trường trên Form" which is handled, but just in case
  [/đánh dấu trực tiếp lên bảng A–D ở trên: trường nào/g, 'đánh dấu trực tiếp lên bảng A–D ở trên: cột nào'],

  // 7. Section III
  [/QUY TRÌNH XỬ LÝ \(WORKFLOW\) SAU KHI LƯU PYC/g, 'QUY TRÌNH XỬ LÝ (WORKFLOW) TRÊN GOOGLE SHEET'],
  [/<strong>Trình duyệt PYC lên Hệ thống:<\/strong> Sau khi hoàn tất nhập liệu, Thu mua nhấn nút <strong>Lưu &amp; Gửi<\/strong>\. Hệ thống tự động sinh Mã PYC \(VD: PYC-001\) và chuyển trạng thái phiếu thành <span class="tag wait">Chờ duyệt<\/span>\. Lịch sử hệ thống ghi nhận chính xác thời gian tạo và nhân sự thực hiện./g, '<strong>Trình duyệt PYC trên Google Sheet:<\/strong> Sau khi hoàn tất nhập liệu, Thu mua set trạng thái tại cột Status thành <span class="tag wait">Chờ duyệt<\/span>. Sau đó nhắn tin qua Zalo hoặc tag tên Quản lý vào file để yêu cầu duyệt.'],
  [/tiến hành đăng nhập vào hệ thống. Quản lý sẽ rà soát nội dung phiếu mua hàng, đối chiếu chéo với các <strong>file ảnh chụp màn hình Zalo \/ Báo giá đính kèm<\/strong>/g, 'tiến hành mở file Google Sheet. Quản lý sẽ rà soát nội dung dòng mua hàng, click mở các <strong>link ảnh chụp màn hình Zalo / Báo giá đính kèm<\/strong>'],
  [/Quản lý nhấn <strong>"Duyệt phiếu"<\/strong>\. Hệ thống tự động chuyển trạng thái thành <span class="tag ok">Đã duyệt<\/span>, đồng thời gửi thông báo xác nhận về cho Thu mua/g, 'Quản lý chọn <strong>"Đã duyệt"<\/strong> tại cột Status. Quản lý nhắn lại Zalo hoặc Thu mua tự theo dõi file'],
  [/Quản lý nhấn <strong>"Từ chối"<\/strong>\. Hệ thống yêu cầu <strong>bắt buộc nhập "Lý do hủy"<\/strong>\. Trạng thái phiếu thành <span class="tag cancel">Đã hủy<\/span>, thông báo này sẽ được gửi về cho Thu mua \(và người yêu cầu\)\./g, 'Quản lý chọn <strong>"Đã hủy"<\/strong> và <strong>bắt buộc nhập lý do vào cột Ghi chú\/Lý do<\/strong>. Trạng thái phiếu thành <span class="tag cancel">Đã hủy<\/span>, Thu mua sẽ nhận tin báo và báo lại cho người yêu cầu.'],
  [/Hệ thống sẽ lưu vết lịch sử mọi thay đổi/g, 'Google Sheet sẽ lưu vết lịch sử mọi thay đổi qua tính năng Version History (Lịch sử phiên bản)'],
  [/Trên phần mềm sẽ hỗ trợ in mẫu này/g, 'Trên file sheet sẽ hỗ trợ in mẫu này'],
  
];

replacements.forEach(([regex, replacement]) => {
  content = content.replace(regex, replacement);
});

// A specific manual replacement for some leftovers
content = content.replace(/<strong>trên bảng<\/strong>/g, '<strong>trên form<\/strong>'); // Restore if accidental

fs.writeFileSync(filePath, content, 'utf8');
console.log('Document successfully converted to Google Sheets version.');
