# KỊCH BẢN MANUAL TEST — LUỒNG MUA HÀNG
## Hệ thống ERP — erp.degoholding.vn

**Phiên bản:** 1.0  
**Ngày:** 30/05/2026  
**Người thực hiện:** _______________  
**Môi trường test:** UAT / Production

---

## HƯỚNG DẪN SỬ DỤNG TÀI LIỆU

- **Passed (P):** Test case chạy đúng như mong đợi
- **Failed (F):** Kết quả khác với mong đợi → ghi rõ lỗi vào cột Ghi chú
- **Blocked (B):** Không thể test do phụ thuộc test case khác bị Failed
- **N/A:** Không áp dụng trong lần test này

---

## MODULE 1: YÊU CẦU THU MUA (Procurement Request)

### 1.1 Tạo mới PYC

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-01 | Tạo PYC thành công với đầy đủ thông tin bắt buộc | 1. Đăng nhập bằng tài khoản BP/YC<br>2. Vào Buying > Procurement Request > + New<br>3. Chọn Company<br>4. Chọn Department<br>5. Chọn Required Date<br>6. Thêm ít nhất 1 dòng Items (Item Name + Qty)<br>7. Bấm Save | - Phiếu được lưu thành công<br>- Mã PYC tự động sinh theo format PYC.NM.DDMMYYYY.##<br>- Trạng thái = Draft<br>- Requester tự động = user đang đăng nhập<br>- Date tự động = ngày hôm nay | | |
| TC-02 | Tạo PYC thiếu trường bắt buộc | 1. Tạo PYC mới<br>2. Bỏ trống Company<br>3. Bấm Save | - Hệ thống báo lỗi validation<br>- Không cho lưu<br>- Highlight trường thiếu | | |
| TC-03 | Tạo PYC không có dòng Items | 1. Tạo PYC mới<br>2. Điền đủ header nhưng không thêm dòng Items<br>3. Bấm Save | - Hệ thống báo lỗi "Items is required"<br>- Không cho lưu | | |
| TC-04 | Thêm nhiều dòng Items | 1. Tạo PYC mới<br>2. Thêm 3-5 dòng Items với Item Name, Qty, Giá đề xuất khác nhau<br>3. Bấm Save | - Tất cả dòng được lưu<br>- Total Qty tự động tính đúng<br>- Total Amount tự động tính = SUM(qty × proposed_rate) | | |
| TC-05 | Chọn Item Code có sẵn trong hệ thống | 1. Trong bảng Items, gõ mã Item Code đã tồn tại<br>2. Chọn từ dropdown | - Item Name tự động điền<br>- ĐVT tự động điền<br>- Mô tả tự động điền (nếu có) | | |
| TC-06 | Nhập Item Name tự do (không có Item Code) | 1. Bỏ trống Item Code<br>2. Nhập Item Name bằng tay<br>3. Nhập Qty<br>4. Save | - Cho phép lưu thành công<br>- Item Code để trống | | |
| TC-07 | Đính kèm file | 1. Tạo PYC<br>2. Đính kèm file PDF/hình ảnh<br>3. Save | - File được upload thành công<br>- Hiển thị tên file + link download | | |

### 1.2 Workflow PYC

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-08 | Gửi yêu cầu (Draft → Submitted) | 1. Mở PYC ở trạng thái Draft<br>2. Bấm nút "Gửi yêu cầu" | - Trạng thái chuyển sang Submitted<br>- Form bị khóa (read-only) cho người tạo<br>- Thông báo gửi thành công | | |
| TC-09 | Admin gán NSTM (Submitted → Assigned) | 1. Đăng nhập bằng tài khoản Admin/QL<br>2. Mở PYC ở trạng thái Submitted<br>3. Chọn Person in Charge (NSTM)<br>4. Save | - Trạng thái chuyển sang Assigned<br>- Trường Person in Charge có giá trị<br>- NSTM nhận được thông báo (nếu có) | | |
| TC-10 | Admin trả lại đơn (Submitted → Returned) | 1. Đăng nhập Admin/QL<br>2. Mở PYC Submitted<br>3. Bấm "Trả lại đơn"<br>4. Nhập lý do | - Trạng thái = Returned<br>- Lý do từ chối được lưu<br>- Người tạo có thể sửa lại | | |
| TC-11 | Người yêu cầu sửa và gửi lại (Returned → Submitted) | 1. Đăng nhập BP/YC<br>2. Mở PYC Returned<br>3. Sửa thông tin<br>4. Bấm "Gửi lại" | - Cho phép sửa các trường<br>- Sau khi gửi lại: trạng thái = Submitted<br>- Form khóa lại | | |
| TC-12 | Duyệt PYC (Assigned → Approved) | 1. Đăng nhập TP/QL<br>2. Mở PYC Assigned<br>3. Bấm "Duyệt" | - Trạng thái = Approved<br>- Form khóa vĩnh viễn<br>- docstatus = 1 | | |

### 1.3 Phân quyền PYC

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-13 | BP/YC chỉ thấy PYC của mình | 1. Đăng nhập BP/YC (user A)<br>2. Vào List Procurement Request | - Chỉ hiển thị PYC do user A tạo<br>- Không thấy PYC của user khác | | |
| TC-14 | NSTM thấy tất cả PYC đã Approved | 1. Đăng nhập NSTM<br>2. Vào List Procurement Request<br>3. Lọc theo trạng thái Approved | - Hiển thị tất cả PYC Approved<br>- Không phân biệt người tạo | | |
| TC-15 | BP/YC không sửa được PYC đã Submitted | 1. Đăng nhập BP/YC<br>2. Mở PYC ở trạng thái Submitted<br>3. Thử sửa bất kỳ trường nào | - Tất cả trường read-only<br>- Không có nút Save/Edit | | |
| TC-16 | NSTM sửa được giá đề xuất khi Assigned | 1. Đăng nhập NSTM được gán<br>2. Mở PYC Assigned<br>3. Sửa trường proposed_rate trong Items<br>4. Save | - Cho phép sửa proposed_rate<br>- Không cho sửa item_code, item_name, qty<br>- Save thành công | | |
| TC-17 | NSTM không sửa được item_code khi Assigned | 1. Đăng nhập NSTM<br>2. Mở PYC Assigned<br>3. Thử sửa item_code hoặc qty | - Trường bị khóa (read-only)<br>- Không cho thay đổi | | |

---

## MODULE 2: KHẢO SÁT NHÀ CUNG CẤP (Supplier Survey)

### 2.1 Tạo mới KS.NCC

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-18 | Tạo KS.NCC từ PYC đã Approved | 1. Đăng nhập NSTM<br>2. Mở PYC Approved<br>3. Trong section KS.NCC bấm "+ Thêm"<br>4. Điền: NSPT, Ngày liên hệ, Tên NCC<br>5. Save | - KS.NCC được tạo thành công<br>- Mã tự sinh: KS.NCC.DDMMYYYY.##<br>- Link procurement_request tự động gắn về PYC<br>- Trạng thái = Draft | | |
| TC-19 | Chọn NCC từ danh mục Supplier | 1. Tạo KS.NCC mới<br>2. Trong trường "Tên viết tắt NCC" chọn Supplier có sẵn | - Tự động điền: Tên NCC, Mã số thuế, Địa chỉ, SĐT<br>- Các trường auto-fill hiển thị đúng | | |
| TC-20 | Nhập NCC mới chưa có trong hệ thống | 1. Tạo KS.NCC mới<br>2. Bỏ trống trường "Tên viết tắt NCC"<br>3. Nhập tay: Tên NCC, MST, Địa chỉ, SĐT<br>4. Save | - Cho phép lưu thành công<br>- Trường supplier để trống<br>- Các trường nhập tay được lưu | | |
| TC-21 | Điền đầy đủ phần đánh giá NCC | 1. Mở KS.NCC Draft<br>2. Điền: Công nghệ SX, Thời gian SX, Đánh giá NVKD, Hóa đơn, Mức tin cậy, Chính sách nhận hàng, Công nợ, Hàng trả<br>3. Save | - Tất cả trường đánh giá được lưu đúng<br>- Giá trị Select hiển thị đúng | | |
| TC-22 | Thêm Items vào KS.NCC | 1. Mở KS.NCC<br>2. Thêm dòng Items: Item Name, Qty, ĐVT, Đơn giá<br>3. Save | - Dòng được thêm thành công<br>- Amount tự động = qty × rate | | |
| TC-23 | BP/YC không được tạo KS.NCC | 1. Đăng nhập BP/YC<br>2. Thử tạo Supplier Survey mới | - Không có nút "+ New"<br>- Hoặc báo lỗi permission denied | | |

### 2.2 Workflow KS.NCC

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-24 | NSTM gửi KS.NCC (Draft → Submitted/Under Review) | 1. Đăng nhập NSTM<br>2. Mở KS.NCC Draft đã điền đủ<br>3. Bấm "Gửi" | - Trạng thái chuyển sang Surveying hoặc Under Review<br>- NSTM không sửa được nữa | | |
| TC-25 | TP/QL duyệt KS.NCC (→ Approved) | 1. Đăng nhập TP/QL<br>2. Mở KS.NCC Under Review<br>3. Điền Duyệt (TP/QL) = "Đã duyệt"<br>4. Save/Approve | - Trạng thái = Approved<br>- Hiển thị trong PYC gốc với badge "Đạt" | | |
| TC-26 | TP/QL từ chối KS.NCC (→ Rejected) | 1. Đăng nhập TP/QL<br>2. Mở KS.NCC<br>3. Chọn "Không duyệt" + nhập lý do<br>4. Save | - Trạng thái = Rejected<br>- Lý do từ chối được lưu<br>- Hiển thị badge "Không đạt" trong PYC | | |

---

## MODULE 3: KHẢO SÁT SẢN PHẨM (Product Survey)

### 3.1 Tạo mới KS.SP

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-27 | Tạo KS.SP từ PYC | 1. Đăng nhập NSTM<br>2. Mở PYC Approved<br>3. Section KS.SP > "+ Thêm"<br>4. Điền: NSPT, Ngày liên hệ, Tên VTBB/NL, Ngày khảo sát<br>5. Save | - KS.SP tạo thành công<br>- Mã: KS.SP.DDMMYYYY.##<br>- Link về PYC đúng<br>- Trạng thái = Draft | | |
| TC-28 | Thêm nhiều NCC vào bảng so sánh | 1. Mở KS.SP<br>2. Thêm 3 dòng Items, mỗi dòng 1 NCC khác nhau<br>3. Điền: Supplier, Tên SP theo NCC, Giá, MOQ, Lead time, VAT<br>4. Save | - 3 dòng được lưu<br>- Thành tiền tự động tính cho mỗi dòng<br>- Có thể so sánh giá giữa các NCC | | |
| TC-29 | Quy đổi ĐVT | 1. Trong dòng Items KS.SP<br>2. Nhập ĐVT NCC (vd: Thùng)<br>3. Nhập ĐVT quy đổi (vd: Cái)<br>4. Nhập giá<br>5. Save | - Thành tiền (đã quy đổi) tính đúng<br>- Hiển thị cả 2 ĐVT | | |
| TC-30 | Ghi nhận kết quả LAB | 1. Mở KS.SP<br>2. Trong dòng Items, điền: Đánh giá chất lượng từ LAB<br>3. Save | - Kết quả LAB được lưu<br>- Hiển thị trong bảng so sánh | | |
| TC-31 | TP/QL duyệt từng NCC trong KS.SP | 1. Đăng nhập TP/QL<br>2. Mở KS.SP<br>3. Trong bảng Items, chọn "Đã duyệt" cho 1 NCC<br>4. Chọn "Không duyệt" cho NCC khác<br>5. Save | - Mỗi dòng NCC có trạng thái duyệt riêng<br>- NCC được duyệt = NCC được chọn mua | | |

### 3.2 Phân quyền KS.SP

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-32 | BP/YC xem được KS.SP trong PYC của mình | 1. Đăng nhập BP/YC<br>2. Mở PYC của mình (đã có KS.SP) | - Thấy danh sách KS.SP<br>- Có thể xem chi tiết<br>- KHÔNG thấy thông tin giá nội bộ (nếu có ẩn) | | |
| TC-33 | BP/YC không sửa được KS.SP | 1. Đăng nhập BP/YC<br>2. Mở KS.SP chi tiết | - Tất cả trường read-only<br>- Không có nút Edit/Save | | |

---

## MODULE 4: ĐƠN THU MUA (Procurement Purchase)

### 4.1 Tạo đơn thu mua

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-34 | Tạo đơn mua từ PYC đã Approved | 1. Đăng nhập NSTM<br>2. Từ PYC Approved, tạo đơn mua<br>3. Chọn NCC (từ KS đã duyệt)<br>4. Save | - Đơn mua tạo thành công<br>- Số lượng = số lượng trong PYC<br>- Link về PYC đúng<br>- Trạng thái = Draft | | |
| TC-35 | Tạo đơn mua tự do (không từ PYC) | 1. Đăng nhập NSTM<br>2. Tạo Procurement Purchase mới trực tiếp<br>3. Nhập: NCC, Items, Qty, Giá<br>4. Save | - Cho phép tạo không cần PYC<br>- Số lượng nhập tay tự do<br>- Trạng thái = Draft | | |
| TC-36 | BP/YC không tạo được đơn mua | 1. Đăng nhập BP/YC<br>2. Thử tạo Procurement Purchase | - Không có quyền<br>- Báo lỗi permission | | |

### 4.2 Workflow đơn thu mua

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-37 | NSTM gửi đơn mua (Draft → Submitted) | 1. Mở đơn mua Draft<br>2. Bấm Submit | - Trạng thái = Submitted<br>- Chờ TP/QL duyệt | | |
| TC-38 | TP/QL duyệt đơn mua (→ Approved) | 1. Đăng nhập TP/QL<br>2. Mở đơn mua Submitted<br>3. Bấm Approve | - Trạng thái = Approved<br>- NSTM có thể chuyển sang Ordered | | |
| TC-39 | TP/QL từ chối đơn mua (→ Rejected) | 1. Đăng nhập TP/QL<br>2. Bấm Reject + nhập lý do | - Trạng thái = Rejected<br>- Lý do được lưu | | |
| TC-40 | NSTM đánh dấu đã đặt hàng (→ Ordered) | 1. Đăng nhập NSTM<br>2. Mở đơn mua Approved<br>3. Bấm "Đặt hàng" | - Trạng thái = Ordered<br>- Sau bước này chỉ TP/QL sửa được | | |
| TC-41 | Xác nhận nhận hàng (→ Received) | 1. Mở đơn mua Ordered<br>2. Bấm "Đã nhận hàng" | - Trạng thái = Received<br>- Cập nhật % đã mua trên PYC gốc (nếu có) | | |

---

## MODULE 5: LUỒNG END-TO-END

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-42 | Luồng hoàn chỉnh: PYC → KS.NCC → KS.SP → Đơn mua → Nhận hàng | 1. BP/YC tạo PYC + gửi<br>2. Admin gán NSTM<br>3. TP/QL duyệt PYC<br>4. NSTM tạo KS.NCC cho 2 NCC<br>5. TP/QL duyệt 1 KS.NCC<br>6. NSTM tạo KS.SP so sánh 2 NCC<br>7. TP/QL duyệt NCC tốt nhất<br>8. NSTM tạo đơn mua<br>9. TP/QL duyệt đơn mua<br>10. NSTM đánh dấu Ordered<br>11. Xác nhận Received | - Mỗi bước chuyển trạng thái đúng<br>- Dữ liệu liên kết giữa các DocType đúng<br>- % khảo sát NCC, % khảo sát SP, % đã mua trên PYC cập nhật đúng<br>- Không có lỗi permission ở bất kỳ bước nào | | |
| TC-43 | Luồng có trả lại: PYC bị trả → sửa → gửi lại → duyệt | 1. BP/YC tạo PYC + gửi<br>2. Admin trả lại (lý do: thiếu thông tin)<br>3. BP/YC sửa + gửi lại<br>4. Admin gán NSTM<br>5. TP/QL duyệt | - Trạng thái chuyển đúng qua từng bước<br>- Lý do trả lại được lưu<br>- Sau khi gửi lại, flow tiếp tục bình thường | | |
| TC-44 | Nhiều đơn mua từ 1 PYC | 1. Tạo PYC với 3 Items<br>2. Duyệt PYC<br>3. Tạo đơn mua #1 cho Item 1+2 (NCC A)<br>4. Tạo đơn mua #2 cho Item 3 (NCC B) | - Cả 2 đơn mua link về cùng PYC<br>- % đã mua trên PYC cập nhật đúng<br>- Tổng SL đã mua = Tổng SL yêu cầu khi hoàn tất | | |

---

## MODULE 6: TÍNH TOÁN TỰ ĐỘNG

| # | Mô tả test case | Bước thực hiện | Kết quả mong đợi | P/F/B | Ghi chú |
|---|-----------------|----------------|-------------------|-------|---------|
| TC-45 | Total Amount trên PYC | 1. Tạo PYC với 3 dòng Items:<br>- Item A: qty=10, rate=100,000<br>- Item B: qty=5, rate=200,000<br>- Item C: qty=20, rate=50,000<br>2. Save | Total Amount = (10×100,000) + (5×200,000) + (20×50,000) = 3,000,000 | | |
| TC-46 | % Khảo sát NCC trên PYC | 1. PYC có 3 KS.NCC<br>2. Duyệt 2 trong 3 | % KS.NCC = 2/3 × 100 = 66.67% | | |
| TC-47 | % Đã mua trên PYC | 1. PYC yêu cầu tổng 100 đơn vị<br>2. Đơn mua #1: 60 đơn vị (Received)<br>3. Đơn mua #2: 40 đơn vị (Ordered) | % đã mua = (60+40)/100 × 100 = 100% | | |
| TC-48 | Thành tiền trong KS.SP | 1. Trong KS.SP, dòng NCC:<br>- Giá = 150,000 VNĐ<br>- VAT = 10%<br>2. Save | Thành tiền = 150,000 × 1.1 = 165,000 VNĐ (hoặc theo công thức hệ thống) | | |

---

## TÓM TẮT KẾT QUẢ TEST

| Module | Tổng TC | Passed | Failed | Blocked | N/A |
|--------|---------|--------|--------|---------|-----|
| 1. Yêu Cầu Thu Mua | 17 | | | | |
| 2. Khảo Sát NCC | 9 | | | | |
| 3. Khảo Sát SP | 7 | | | | |
| 4. Đơn Thu Mua | 8 | | | | |
| 5. End-to-End | 3 | | | | |
| 6. Tính toán | 4 | | | | |
| **TỔNG** | **48** | | | | |

---

## GHI CHÚ BUG TÌM THẤY

| # | TC liên quan | Mô tả bug | Mức độ (Critical/High/Medium/Low) | Screenshot/Video |
|---|-------------|-----------|-----------------------------------|-----------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

**Người test:** _______________  
**Ngày hoàn thành:** _______________  
**Kết luận:** ☐ PASS (tất cả TC passed) / ☐ CONDITIONAL PASS (có bug Medium/Low) / ☐ FAIL (có bug Critical/High)
