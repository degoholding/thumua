# HƯỚNG DẪN SỬ DỤNG MODULE THU MUA
## Hệ thống ERP — erp.degoholding.vn

**Phiên bản:** 1.0  
**Ngày cập nhật:** 30/05/2026  
**Đối tượng:** Người dùng cuối (Bộ phận yêu cầu, Nhân sự thu mua, Quản lý)

---

## 1. TỔNG QUAN QUY TRÌNH

Quy trình thu mua trên hệ thống gồm 4 bước chính:

```
Yêu Cầu Thu Mua (PYC) → Khảo Sát NCC (KS.NCC) → Khảo Sát Sản Phẩm (KS.SP) → Đơn Thu Mua
```

Mỗi bước có vai trò rõ ràng:

| Bước | Tên | Ai thực hiện | Mục đích |
|------|-----|-------------|----------|
| 1 | Yêu Cầu Thu Mua (PYC) | Bộ phận có nhu cầu | Khai báo cần mua gì, bao nhiêu, khi nào |
| 2 | Khảo Sát NCC (KS.NCC) | Nhân sự thu mua (NSTM) | Khảo sát năng lực, pháp lý, chính sách NCC |
| 3 | Khảo Sát Sản Phẩm (KS.SP) | Nhân sự thu mua (NSTM) | So sánh giá, chất lượng, mẫu từ nhiều NCC |
| 4 | Đơn Thu Mua | Nhân sự thu mua (NSTM) | Lập đơn mua chính thức sau khi duyệt |

---

## 2. CÁC VAI TRÒ TRONG HỆ THỐNG

| Vai trò | Mã viết tắt | Quyền hạn chính |
|---------|-------------|-----------------|
| Người yêu cầu | BP/YC | Tạo PYC, xem PYC của mình, xem khảo sát liên quan |
| Nhân sự thu mua | NSTM | Xem tất cả PYC đã duyệt, tạo khảo sát, tạo đơn mua |
| Quản lý / Trưởng phòng | TP/QL | Duyệt PYC, duyệt khảo sát, gán NSTM, toàn quyền sửa |
| Admin | Admin | Toàn quyền hệ thống |

---

## 3. YÊU CẦU THU MUA (Procurement Request)

### 3.1 Mục đích
Phiếu yêu cầu thu mua là điểm khởi đầu của toàn bộ quy trình mua. Bộ phận có nhu cầu khai báo: cần mua cái gì, bao nhiêu, khi nào cần, độ ưu tiên.

### 3.2 Cách tạo mới

**Bước 1:** Đăng nhập hệ thống → Vào module **Buying** → Chọn **Procurement Request** → Bấm **+ Thêm mới**

**Bước 2:** Điền thông tin bắt buộc:

| Trường | Ý nghĩa | Lưu ý |
|--------|---------|-------|
| Company | Công ty yêu cầu | Chọn đúng pháp nhân |
| Requester | Người yêu cầu | Tự động lấy tài khoản đang đăng nhập |
| Date | Ngày yêu cầu | Mặc định là hôm nay |
| Required Date | Ngày cần có hàng | Deadline nghiệp vụ |
| Department | Bộ phận yêu cầu | Chọn từ danh sách |
| Invoice Company | Công ty nhận hóa đơn | Có thể khác Company nếu cần |
| Receiving Warehouse | Kho nhận hàng | Chọn kho mặc định |

**Bước 3:** Thêm danh sách vật tư cần mua (bảng Items):

| Trường | Ý nghĩa | Bắt buộc |
|--------|---------|----------|
| Item Code | Mã vật tư (nếu đã có trong hệ thống) | Không |
| Item Name | Tên vật tư/sản phẩm | Có |
| Phân loại | Nhóm hàng (VTBB, NL, BTP...) | Không |
| Mô tả | Quy cách kỹ thuật chi tiết | Không |
| Số lượng mua | Số lượng cần mua | Có |
| ĐVT | Đơn vị tính | Không |
| Giá đề xuất | Đơn giá dự kiến | Không |

**Bước 4:** Đính kèm tài liệu (báo giá tham khảo, hình ảnh mẫu...) nếu có

**Bước 5:** Bấm **Lưu** → Kiểm tra lại → Bấm **"Gửi yêu cầu"**

### 3.3 Các trạng thái của PYC

| Trạng thái | Ý nghĩa | Ai chuyển |
|------------|---------|-----------|
| Draft (Bản nháp) | Đang soạn, chưa gửi | Người tạo |
| Submitted (Đã gửi) | Đã gửi, chờ Admin xử lý | Người tạo bấm "Gửi" |
| Assigned (Đã gán) | Admin đã gán NSTM phụ trách | Admin/QL |
| Returned (Trả lại) | Thông tin sai, cần sửa lại | Admin/NSTM |
| Approved (Đã duyệt) | Đã duyệt, sẵn sàng mua | TP/QL |

### 3.4 Lưu ý quan trọng
- Sau khi bấm "Gửi yêu cầu", bạn **không thể sửa** phiếu nữa
- Nếu phiếu bị **Trả lại**, bạn sẽ nhận thông báo kèm lý do → sửa lại → gửi lại
- Mã PYC tự động sinh theo format: `PYC.NM.DDMMYYYY.##`

---

## 4. KHẢO SÁT NHÀ CUNG CẤP (Supplier Survey)

### 4.1 Mục đích
Khảo sát thông tin pháp lý, năng lực sản xuất, chính sách thanh toán/giao hàng của một NCC cụ thể. Một PYC có thể có nhiều KS.NCC (ứng với nhiều NCC tiềm năng).

### 4.2 Ai được tạo
Chỉ **NSTM** và **TP/QL** mới được tạo khảo sát NCC. Người yêu cầu (BP/YC) chỉ xem được.

### 4.3 Cách tạo mới

**Bước 1:** Mở phiếu PYC đã được duyệt → Trong section **Khảo Sát NCC** → Bấm **+ Thêm**

**Bước 2:** Điền thông tin:

| Trường | Ý nghĩa | Bắt buộc |
|--------|---------|----------|
| Yêu Cầu Thu Mua | Link về PYC gốc | Tự động điền |
| NSPT | Nhân sự phụ trách | Có |
| Ngày liên hệ NCC | Ngày bắt đầu liên hệ | Có |
| Ngày dự kiến NCC phản hồi | Hạn NCC cam kết trả lời | Không |
| Ngày dự kiến trả KQ | Ngày hoàn tất khảo sát | Không |
| Tên viết tắt NCC | Chọn từ danh mục Supplier | Không (có thể nhập tay nếu NCC mới) |

**Lưu ý:** Khi chọn NCC từ danh mục, hệ thống tự động điền: Tên NCC, Mã số thuế, Địa chỉ, SĐT. Nếu NCC chưa có trong hệ thống, bạn có thể nhập tay tự do.

**Bước 3:** Điền phần đánh giá NCC:

| Trường | Ý nghĩa |
|--------|---------|
| Công nghệ sản xuất | Đánh giá năng lực công nghệ |
| Thời gian SX | Thời gian sản xuất trung bình |
| Đánh giá tư vấn NVKD | Rất tốt / Tốt / Trung bình / Kém |
| Hóa đơn | Có VAT / Không có / Khác |
| Mức độ tin cậy | Cao / Trung bình / Thấp |
| Chính sách nhận hàng | Quy định giao nhận |
| Chính sách công nợ | Điều khoản thanh toán |
| Hàng lỗi, hàng trả | Chính sách đổi trả |

**Bước 4:** Thêm danh sách mặt hàng NCC có thể cung ứng (bảng Items) nếu cần

**Bước 5:** Bấm **Lưu** → Bấm **"Gửi"** để chuyển cho QL duyệt

### 4.4 Các trạng thái

| Trạng thái | Ý nghĩa |
|------------|---------|
| Draft | Đang khảo sát |
| Surveying | Đang tiến hành |
| Under Review | Chờ QL xem xét |
| Approved | Đạt yêu cầu |
| Rejected | Không đạt |
| Completed | Hoàn tất |

---

## 5. KHẢO SÁT SẢN PHẨM (Product Survey)

### 5.1 Mục đích
So sánh chi tiết giữa **nhiều NCC khác nhau** cùng chào giá cho **một mặt hàng nội bộ cụ thể** để đưa ra lựa chọn tối ưu nhất.

### 5.2 Cách tạo mới

**Bước 1:** Mở phiếu PYC → Section **Khảo Sát Sản Phẩm** → Bấm **+ Thêm**

**Bước 2:** Điền thông tin header:

| Trường | Ý nghĩa | Bắt buộc |
|--------|---------|----------|
| Yêu Cầu Thu Mua | Link PYC gốc | Tự động |
| NSPT | Nhân sự phụ trách | Có |
| Ngày liên hệ | Ngày bắt đầu khảo sát | Có |
| Mã VTBB/NL (nội bộ) | Mã vật tư nội bộ | Không |
| Tên VTBB/NL (nội bộ) | Tên vật tư cần khảo sát | Có |
| Phân loại | Nhóm hàng | Không |
| Ngày Khảo Sát | Ngày thực hiện | Có |

**Bước 3:** Thêm bảng so sánh các NCC (bảng Items) — mỗi dòng là một NCC:

| Trường | Ý nghĩa |
|--------|---------|
| Tên viết tắt NCC | Chọn NCC |
| Tên VTBB/NVL (tên NCC đặt) | Tên SP theo cách gọi NCC |
| Thông số kỹ thuật | Quy cách chi tiết |
| Xuất xứ | Quốc gia sản xuất |
| ĐVT | Đơn vị tính NCC chào |
| MOQ tối thiểu | Số lượng đặt tối thiểu |
| Giá theo sản lượng (VNĐ) | Đơn giá |
| Khung sản lượng | Mô tả khung giá |
| VAT | % thuế |
| Thành tiền | Tự động tính |
| ĐVT quy đổi | Quy đổi về ĐVT công ty |
| Thành tiền (đã quy đổi) | Giá sau quy đổi |
| Chi phí vận chuyển | Phí ship |
| Thời gian giao hàng (ngày) | Số ngày cam kết |
| Địa điểm giao/nhận | Nơi nhận hàng |
| Link báo giá | Đường dẫn file báo giá |
| Mẫu sẵn | Có mẫu thử chưa |
| Ngày lấy mẫu | Ngày nhận mẫu |
| Đánh giá chất lượng từ LAB | Kết quả test |
| NSPT Đánh giá | Nhận xét NSTM |
| Duyệt | Chờ duyệt / Đã duyệt / Không duyệt |
| Ý kiến TP/QL | Chỉ đạo từ quản lý |

**Bước 4:** Đính kèm tài liệu (bản test mẫu, hình ảnh SP) → Bấm **Lưu** → **Gửi**

### 5.3 Lưu ý
- Mỗi dòng trong bảng Items là **một NCC khác nhau** chào giá cho cùng một sản phẩm
- Cột "Thành tiền (đã quy đổi)" giúp so sánh công bằng khi NCC dùng ĐVT khác nhau
- TP/QL sẽ duyệt từng dòng NCC (Đã duyệt = chọn NCC đó)

---

## 6. ĐƠN THU MUA (Procurement Purchase)

### 6.1 Mục đích
Lập đơn mua hàng chính thức sau khi PYC được duyệt và khảo sát hoàn tất.

### 6.2 Nguồn tạo đơn

| Nguồn | Mô tả | Số lượng |
|--------|--------|----------|
| Từ Yêu cầu (PYC) | Tạo từ khảo sát đã Approved | Tự động = SL trong PYC |
| Tự tạo | NSTM tạo trực tiếp (mua phát sinh) | Nhập tay |

### 6.3 Các trạng thái

| Trạng thái | Ý nghĩa | Ai thực hiện |
|------------|---------|--------------|
| Draft | Bản nháp | NSTM |
| Submitted | Đã gửi chờ duyệt | NSTM |
| Approved | Đã duyệt | TP/QL |
| Ordered | Đã đặt hàng NCC | NSTM |
| Partially Received | Nhận một phần | NSTM/Kho |
| Received | Đã nhận đủ | NSTM/Kho |
| Rejected | Từ chối | TP/QL |

### 6.4 Lưu ý
- Đơn thu mua **không bắt buộc** phải có PYC (có thể tự tạo cho mua phát sinh)
- Nếu tạo từ PYC → số lượng tự động lấy từ PYC, không được sửa
- Sau khi Ordered → chỉ TP/QL/Admin mới được sửa

---

## 7. MẸO SỬ DỤNG

- **Tìm kiếm nhanh:** Dùng thanh Search (Ctrl+K) gõ mã PYC hoặc tên vật tư
- **Lọc danh sách:** Trong List View, dùng bộ lọc theo trạng thái, ngày, người tạo
- **Xem lịch sử:** Cuộn xuống cuối form → phần Comments/Activity Log
- **Đính kèm file:** Kéo thả file vào vùng Attach hoặc bấm nút đính kèm
- **In phiếu:** Bấm Menu (⋮) → Print → chọn Print Format

---

## 8. CÂU HỎI THƯỜNG GẶP

**Q: Tôi gửi PYC rồi nhưng muốn sửa lại thì làm sao?**  
A: Liên hệ Admin/QL để họ bấm "Trả lại đơn". Phiếu sẽ về trạng thái Returned và bạn có thể sửa.

**Q: Tôi không thấy phiếu PYC của đồng nghiệp?**  
A: Người yêu cầu (BP/YC) chỉ thấy PYC của chính mình. Nếu cần xem của người khác, liên hệ QL.

**Q: NCC chưa có trong hệ thống, tôi có thể khảo sát không?**  
A: Có. Khi tạo KS.NCC, bỏ trống trường "Tên viết tắt NCC" và nhập tay toàn bộ thông tin.

**Q: Khảo sát bị Rejected thì sao?**  
A: Xem lý do từ chối trong phần ghi chú của QL → Tạo khảo sát mới hoặc bổ sung thông tin.

**Q: Một PYC có thể tạo nhiều đơn mua không?**  
A: Có. Một PYC có thể sinh nhiều đơn mua (ví dụ: mua từ nhiều NCC khác nhau cho các item khác nhau).

---

*Liên hệ hỗ trợ: Phòng IT — admin@degoholding.vn*
