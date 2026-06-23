# BỘ CÂU HỎI KHẢO SÁT NGHIỆP VỤ & KỸ THUẬT
## Dự án: Xây dựng hệ thống ERP cho Dego Holding

> **Hướng dẫn trả lời:** Trả lời theo thực tế đang làm, không cần trả lời hoàn hảo. Nếu chưa có quy trình chuẩn, ghi "đang làm thủ công" hoặc mô tả cách xử lý hiện tại là đủ.

---

# PHẦN A — CẤU TRÚC TẬP ĐOÀN VÀ CÁC CÔNG TY

> Gửi cho: Ban lãnh đạo Dego Holding / Bộ phận Hành chính

**A1.** Dego Holding hiện có bao nhiêu công ty đã đăng ký kinh doanh? Liệt kê tên và mã số thuế của từng công ty.

**A2.** Trong danh sách trên, công ty nào có đăng ký kinh doanh riêng và mã số thuế riêng, công ty nào chỉ là tên thương hiệu dùng chung tên công ty khác (không có mã số thuế riêng)?

**A3.** Mỗi công ty đặt tại địa chỉ nào? Có công ty nào hoạt động ở nhiều địa điểm hoặc chi nhánh ở các tỉnh thành khác nhau không?

**A4.** Khi khách hàng yêu cầu xuất hóa đơn VAT cho các thương hiệu như Dr.Xanh, Bambom, N2 Agro, hóa đơn sẽ đứng tên công ty nào?

**A5.** Khi một đơn hàng đi qua nhiều công ty trong tập đoàn (ví dụ: ABA Chemical sản xuất rồi IDA Global phân phối), các công ty có xuất hóa đơn chuyển tiền cho nhau không? Nếu có, giá nội bộ được tính như thế nào?

**A6.** Các công ty trong tập đoàn hiện dùng chung một phần mềm kế toán (MISA, FAST...) hay mỗi công ty dùng phần mềm riêng?

**A7.** Các công ty trong tập đoàn giao dịch chủ yếu bằng tiền Việt Nam hay có cả ngoại tệ (USD, EUR...)? Nếu dùng ngoại tệ, lấy tỷ giá ở đâu?

**A8.** Ai là người đại diện pháp lý (Tổng giám đốc / Giám đốc) của từng công ty? Họ có phải là người ký kết hợp đồng lao động, ký hợp đồng kinh tế và duyệt các quyết định nhân sự không?

---

# PHẦN B — MẢNG GIA CÔNG (ABA Chemical, Dego Agrochem, Dego Organic)

> Gửi cho: Quản lý nhà máy, Phòng kế hoạch sản xuất, Phòng R&D, Phòng Lab

## B.1 — Tiếp nhận đơn gia công

**B1.** Khách hàng đặt gia công hiện tại là ai? Có khách hàng nội bộ trong tập đoàn (IDA Global, AGC, các brand bán lẻ) không, ngoài ra còn có khách hàng bên ngoài không?

**B2.** Đơn gia công hiện đang tiếp nhận qua kênh nào (email, điện thoại, Zalo, form chuẩn)? Ai là người tiếp nhận và bàn giao cho bộ phận sản xuất?

**B3.** Thông tin bắt buộc cần có trong một đơn gia công là gì? Ví dụ: tên sản phẩm, hoạt chất, nồng độ, dạng bào chế, số lượng, quy cách bao bì, nhãn mác, ngày cần giao hàng.

**B4.** Hợp đồng gia công ký theo từng lần hay có hợp đồng khung theo năm? Ai là người có thẩm quyền ký?

**B5.** Giá gia công có bảng giá cố định hay báo giá từng đơn tùy theo yêu cầu? Ai là người duyệt giá trước khi gửi khách hàng?

## B.2 — Quy trình sản xuất và nguyên vật liệu

**B6.** Một lô sản phẩm gia công đi qua những bước nào từ lúc tiếp nhận đơn đến khi giao hàng? Mỗi bước trung bình mất bao lâu?

**B7.** Công thức sản phẩm (formula/recipe) hiện đang lưu ở đâu (Excel, file Word, hệ thống riêng, sổ tay)? Ai được phép xem và chỉnh sửa?

**B8.** Định mức nguyên liệu (BOM — Bill of Materials) cho từng sản phẩm có được lập thành tài liệu không? Khi thực tế tiêu hao nhiều hơn định mức, xử lý ra sao?

**B9.** Nguyên liệu đầu vào mua từ đâu? Có danh sách nhà cung cấp đã được phê duyệt không? Có nguyên liệu nào phải nhập khẩu không?

**B10.** Khi nhận nguyên liệu về nhà máy, quy trình kiểm tra chất lượng đầu vào gồm những bước gì? Ai thực hiện và kết quả lưu ở đâu?

**B11.** Bao bì (chai, thùng, nhãn, nắp) được quản lý như nguyên liệu riêng hay gộp chung? Khách hàng tự cung cấp hay nhà máy mua hộ?

**B12.** Khi nhận nguyên vật liệu mà **số lượng không đủ** hoặc **không đúng quy cách** so với đơn mua, quy trình phản hồi nhà cung cấp và xử lý (trả lại, yêu cầu giao bổ sung) hiện như thế nào? Với nguyên liệu nhập khẩu, thời gian chờ xử lý trung bình là bao lâu? Việc này có ảnh hưởng đến kế hoạch sản xuất không?

**B13.** Trong quá trình sản xuất, phế liệu hoặc phế phẩm phát sinh được quản lý như thế nào? Có thu hồi giá trị (bán phế liệu) hay xử lý tiêu hủy? Chi phí này được tính vào giá thành sản phẩm hay hạch toán riêng?

## B.3 — Quản lý chất lượng và Lab

**B14.** Phòng Lab đang kiểm nghiệm những chỉ tiêu gì cho từng nhóm sản phẩm (thuốc BVTV, phân bón, chế phẩm sinh học)? Tiêu chuẩn áp dụng là TCVN, QCVN hay tiêu chuẩn khác?

**B15.** Khi một lô sản phẩm không đạt chất lượng (QC fail), quy trình xử lý như thế nào? Ai là người quyết định sản xuất lại, tiêu hủy hay xử lý theo cách khác?

**B16.** Phiếu kiểm nghiệm (COA — Certificate of Analysis) được lập và lưu trữ như thế nào? Có mẫu chuẩn không? Ai ký xác nhận?

**B17.** Mẫu lưu (retain sample) được lưu bao lâu, lưu ở đâu và có mã định danh riêng không?

## B.4 — Kho nhà máy và giao hàng gia công

**B18.** Nhà máy có bao nhiêu khu vực kho? Phân loại như thế nào (kho nguyên liệu, kho bán thành phẩm, kho thành phẩm chờ giao, khu cách ly QC, khu phế phẩm)?

**B19.** Quy trình xuất kho và giao hàng gia công như thế nào? Ai ký lệnh xuất kho, chứng từ giao hàng gồm những gì?

**B20.** Hàng thành phẩm chưa giao được quản lý theo lô sản xuất, ngày sản xuất hay hạn sử dụng? Có áp dụng nguyên tắc hàng hết hạn trước xuất trước (FEFO) không?

**B21.** Khi kế hoạch sản xuất đã lên nhưng **nguyên vật liệu không đủ** để thực hiện (đặc biệt nguyên liệu nhập khẩu), quyết định trì hoãn hay sản xuất một phần do ai đưa ra? Khách hàng gia công có được thông báo không?

**B22.** Khi khách hàng gia công **trả lại sản phẩm** đã giao (phát hiện lỗi sau nhận, hoặc không đúng yêu cầu đơn), quy trình nhận hàng hoàn, kiểm tra, xử lý (sản xuất lại, bù đủ, hoàn tiền) như thế nào? Ai có thẩm quyền quyết định?

## B.5 — Kế hoạch sản xuất

**B23.** Kế hoạch sản xuất hàng tuần hoặc hàng tháng được lập như thế nào và ai lập? Kế hoạch này có liên kết với đơn đặt hàng của khách không?

**B24.** Khi có nhiều đơn gia công cùng lúc, ưu tiên sản xuất theo tiêu chí gì (ngày giao hàng, khách hàng quan trọng, sản lượng)?

## B.6 — An toàn lao động và bảo trì thiết bị

**B25.** Công ty có bộ phận hoặc nhân sự phụ trách an toàn lao động (ATSLĐ) không? Có giấy chứng nhận an toàn lao động cho nhân viên nhà máy không? Các quy định ATLĐ đặc thù nào đang áp dụng (bảo hộ lao động, phòng chống cháy nổ, xử lý hóa chất)?

**B26.** Thiết bị và máy móc sản xuất có được lên lịch bảo trì định kỳ không? Ai chịu trách nhiệm bảo trì? Khi máy móc hỏng hóc ảnh hưởng đến tiến độ sản xuất, quy trình xử lý và thông báo như thế nào?

---

# PHẦN C — MẢNG PHÂN PHỐI (IDA Global, AGC Việt Nam)

> Gửi cho: Quản lý kinh doanh, Phụ trách xuất nhập khẩu

## C.1 — Khách hàng và kênh

**C1.** Khách hàng của IDA Global và AGC Việt Nam là đối tượng nào? Đại lý cấp 1, đại lý cấp 2, nhà bán lẻ, hợp tác xã, trang trại lớn?

**C2.** Vùng phân phối hiện tại gồm những tỉnh thành nào?

**C3.** Sản phẩm phân phối gồm hàng do nội bộ tập đoàn gia công và hàng nhập khẩu trực tiếp từ nước ngoài? Tỷ lệ khoảng bao nhiêu phần trăm?

**C4.** Đại lý được phân cấp như thế nào? Điều kiện để trở thành đại lý (doanh số tối thiểu, ký quỹ, địa bàn phân công)?

## C.2 — Đơn hàng và giao hàng

**C5.** Đại lý đặt hàng qua kênh nào hiện tại (điện thoại, Zalo, email)? Ai tiếp nhận và xử lý đơn hàng?

**C6.** Từ khi nhận đơn hàng đến khi giao hàng cho đại lý trung bình mất bao lâu?

**C7.** Phương thức vận chuyển đến đại lý gồm những hình thức nào (xe tải công ty, thuê vận chuyển, đại lý tự đến lấy)? Chi phí vận chuyển ai chịu?

**C8.** Khi giao hàng bị thiếu, sai sản phẩm hoặc hàng hỏng, quy trình đổi trả và khiếu nại như thế nào? Ai có thẩm quyền duyệt?

**C9.** Có sản phẩm nào yêu cầu điều kiện bảo quản đặc biệt trong quá trình vận chuyển không?

## C.3 — Giá và chính sách bán hàng

**C10.** Bảng giá cho đại lý được cập nhật như thế nào và bao lâu một lần? Ai có quyền duyệt thay đổi giá?

**C11.** Chiết khấu cho đại lý được tính theo tiêu chí nào (sản lượng, cấp đại lý, thanh toán sớm)? Có mức chiết khấu tối đa không?

**C12.** Có chương trình khuyến mại hoặc thưởng doanh số theo kỳ cho đại lý không? Cách tính và chi trả như thế nào?

**C13.** Sản phẩm có tính mùa vụ không? Cao điểm rơi vào tháng nào trong năm?

## C.4 — Thanh toán và công nợ

**C14.** Điều khoản thanh toán với đại lý là gì (trả trước, trả sau bao nhiêu ngày)?

**C15.** Có hạn mức tín dụng cho từng đại lý không? Ai thiết lập và ai theo dõi? Khi vượt hạn mức thì xử lý ra sao?

**C16.** Công nợ đại lý hiện đang theo dõi ở đâu? Bao lâu đối soát một lần?

**C17.** Khi đại lý chậm thanh toán, quy trình nhắc nợ gồm những bước gì?

## C.5 — Xuất nhập khẩu

**C18.** Hiện đang nhập khẩu từ những quốc gia nào? Số lô nhập trung bình mỗi tháng là bao nhiêu?

**C19.** Quy trình nhập khẩu gồm những bước gì? Ai phụ trách khai báo hải quan và kiểm tra chứng từ?

**C20.** Điều kiện giao hàng quốc tế (INCOTERMS) phổ biến nhất đang dùng là gì?

**C21.** Có xuất khẩu sản phẩm ra nước ngoài không? Nếu có, thị trường nào?

**C22.** Chứng từ nhập khẩu (tờ khai hải quan, CO, phiếu kiểm dịch) hiện đang lưu ở đâu?

## C.6 — Bảo hành và kênh phân phối

**C23.** Sản phẩm phân phối có chính sách bảo hành không? Nếu có, thời hạn bảo hành là bao lâu? Quy trình xử lý khi khách hàng/đại lý yêu cầu bảo hành (đổi hàng, sửa chữa, hoàn tiền) như thế nào?

**C24.** Nhà phân phối có phải là đại lý độc quyền trên một số địa bàn nhất định không? Có quy định về vùng phân phối, giá bán sàn hoặc giá bán tối đa cho đại lý không?

**C25.** Có kênh phân phối trực tiếp đến người nông dân hoặc trang trại không? Nếu có, kênh này hoạt động như thế nào (khuyến nông, field force, đại lý cấp 2)?

---

# PHẦN D — MẢNG BÁN LẺ (Dr.Xanh, Bambom, N2 Agro và các thương hiệu khác)

> Gửi cho: Quản lý thương hiệu, Quản lý bán hàng online, Quản lý cửa hàng

## D.1 — Sản phẩm và kênh bán hàng

**D1.** Mỗi thương hiệu bán lẻ đang bán những nhóm sản phẩm nào? Có sản phẩm nào bán chung cho nhiều thương hiệu không?

**D2.** Kênh bán hàng hiện tại của từng thương hiệu gồm những kênh nào? (Shopee, TikTok Shop, Lazada, website Haravan, Facebook/Zalo, cửa hàng vật lý, điện thoại)

**D3.** Có cửa hàng vật lý không? Nếu có, bao nhiêu cửa hàng và ở đâu?

**D4.** Sản phẩm bán lẻ được lấy từ kho nào? Kho tập trung hay mỗi thương hiệu có kho riêng?

## D.2 — Đơn hàng thương mại điện tử

**D5.** Đơn hàng từ Shopee và các sàn TMĐT hiện đang xử lý thủ công hay có phần mềm quản lý đơn hàng (OMS) hỗ trợ?

**D6.** Quy trình từ khi nhận đơn trên sàn đến khi hàng giao cho đơn vị vận chuyển gồm những bước gì và mất bao lâu?

**D7.** Đơn vị vận chuyển cho bán lẻ online đang dùng là những đơn vị nào (GHN, GHTK, J&T)? Đã kết nối API với đơn vị vận chuyển chưa?

**D8.** Tỷ lệ hoàn hàng hiện tại khoảng bao nhiêu phần trăm? Lý do hoàn phổ biến nhất là gì? Hàng hoàn về được xử lý như thế nào?

**D9.** Khi sản phẩm trên sàn TMĐT (Shopee, TikTok Shop...) **hết hàng** nhưng kho chưa nhập kịp, quy trình xử lý hiện tại là gì (tạm khóa sản phẩm, chờ nhập hàng, hủy đơn)? Có ảnh hưởng đến đánh giá cửa hàng trên sàn không?

**D10.** Có bán theo combo hoặc gói sản phẩm không? Tồn kho quản lý theo combo hay theo từng sản phẩm thành phần?

## D.3 — Bán qua Zalo và điện thoại

**D11.** Bán hàng qua Zalo OA hay Zalo cá nhân? Đơn hàng từ kênh này được ghi nhận ở đâu (Excel, app, hệ thống)?

**D12.** Quy trình chốt đơn qua Zalo hoặc điện thoại gồm những bước gì, từ lúc khách hỏi đến lúc xuất kho?

**D13.** Thông tin khách hàng mua qua Zalo hoặc điện thoại có được lưu lại không? Lưu ở đâu?

## D.4 — Website

**D14.** Website bán hàng đang dùng nền tảng nào (Haravan, Sapo, WooCommerce)? Mỗi thương hiệu có website riêng không?

**D15.** Website có tích hợp cổng thanh toán online không (VNPAY, MoMo, ZaloPay)?

**D16.** Đơn hàng từ website hiện đang đồng bộ sang hệ thống kho và kế toán như thế nào? Thủ công hay tự động?

## D.5 — Quản lý khách hàng bán lẻ

**D17.** Dữ liệu khách hàng (tên, số điện thoại, địa chỉ, lịch sử mua hàng) hiện đang lưu ở đâu? Có thể tra cứu lịch sử mua của một khách hàng cụ thể không?

**D18.** Khiếu nại và đổi trả của khách lẻ được xử lý theo quy trình nào? Ai có thẩm quyền duyệt hoàn tiền?

**D19.** Có chương trình khách hàng thân thiết (loyalty program) không? Ví dụ: tích điểm, thẻ thành viên, voucher giảm giá cho khách quen? Chương trình này được quản lý trên nền tảng nào?

**D20.** Có cửa hàng vật lý cần hệ thống bán hàng tại quầy (POS) không? Nếu có, hiện đang dùng phần mềm POS nào? Có cần tích hợp với hệ thống kho và kế toán không?

---

# PHẦN E — KHO VẬN VÀ LOGISTICS

> Gửi cho: Quản lý kho, Thủ kho, Phụ trách logistics

## E.1 — Nhập kho và xuất kho

**E1.** Toàn tập đoàn có bao nhiêu kho vật lý? Mỗi kho ở địa chỉ nào, diện tích bao nhiêu, thuộc pháp nhân nào và dùng để làm gì (kho nguyên liệu, kho thành phẩm, kho phân phối, kho bán lẻ)?

**E2.** Phần mềm quản lý kho hiện đang dùng là gì? Hay đang quản lý bằng Excel hoặc thủ công?

**E3.** Quy trình nhập kho gồm những bước gì? Ai kiểm tra hàng, ai ký nhận, chứng từ nhập kho gồm những gì?

**E4.** Quy trình xuất kho gồm những bước gì? Căn cứ để xuất kho là lệnh từ ai?

**E5.** Có quản lý vị trí kho (kệ, tầng, ngăn) không? Đến mức chi tiết như thế nào?

**E6.** Sản phẩm có quản lý theo số lô và hạn sử dụng không? Áp dụng cho tất cả hay chỉ một số nhóm hàng? Phương pháp xuất kho là FIFO hay FEFO?

**E7.** Có sản phẩm nào yêu cầu điều kiện bảo quản đặc biệt không (nhiệt độ, tránh ánh sáng, tách biệt hóa chất)?

**E8.** Kiểm kê kho thực hiện tần suất nào? Quy trình gồm những bước gì? Chênh lệch sau kiểm kê xử lý ra sao?

**E9.** Có hàng hết hạn tồn kho không? Quy trình xử lý tiêu hủy như thế nào?

**E10.** Hiện tại có ai hoặc hệ thống nào **cảnh báo khi hàng sắp hết hạn** (trước 1–3 tháng) để ưu tiên xuất kho không? Quy trình xử lý hàng sắp hết hạn trước khi thực sự hết hạn là gì?

**E11.** Ai chịu trách nhiệm theo dõi tồn kho nguyên vật liệu so với mức tối thiểu? Khi xuống dưới mức an toàn, quy trình đặt hàng bổ sung (bao gồm duyệt đơn mua hàng khẩn) là gì?

## E.2 — Giao nhận và vận chuyển

**E12.** Có gửi hàng ở kho bên ngoài (third-party warehouse) không? Nếu có, theo dõi tồn kho bên ngoài như thế nào?

**E13.** Đơn vị vận chuyển nội địa đang hợp tác là những đơn vị nào? Chi phí tính theo cân nặng, thể tích hay theo chuyến cố định?

---

# PHẦN F — KẾ TOÁN TÀI CHÍNH

> Gửi cho: Kế toán trưởng, Phòng kế toán

## F.1 — Hệ thống hiện tại

**F1.** Phần mềm kế toán đang dùng là gì cho từng pháp nhân? Mỗi pháp nhân dùng riêng hay dùng chung?

**F2.** Có bao nhiêu nhân sự kế toán? Mỗi người phụ trách mảng nào (mua hàng, bán hàng, kho, công nợ, tổng hợp)?

**F3.** Việc đối chiếu 3 chiều giữa đơn mua hàng, phiếu nhập kho và hóa đơn nhà cung cấp hiện đang làm thủ công hay có hỗ trợ từ phần mềm?

**F4.** Hóa đơn VAT của nhà cung cấp đang lưu dưới dạng nào (giấy, hóa đơn điện tử, scan đính kèm)? Tìm lại khi cần bằng cách nào?

## F.2 — Công nợ và thanh toán

**F5.** Công nợ phải thu (từ đại lý, khách lẻ) đang theo dõi ở đâu? Ai phụ trách? Báo cáo tuổi nợ được lập tần suất nào?

**F6.** Công nợ phải trả nhà cung cấp đang theo dõi ở đâu? Có lịch nhắc thanh toán không?

**F7.** Hình thức thanh toán hiện dùng gồm những loại nào (chuyển khoản, tiền mặt, L/C)?

**F8.** Tạm ứng cho nhân viên được theo dõi và hoàn ứng như thế nào?

**F9.** Khi khách hàng vượt hạn mức công nợ, hệ thống có tự động chặn đơn hàng mới không?

## F.3 — Báo cáo

**F10.** Những báo cáo nào đang được lập hàng tháng (doanh thu, công nợ, tồn kho, dòng tiền)?

**F11.** Sau khi kết thúc tháng, cần bao nhiêu ngày để có đủ số liệu báo cáo?

**F12.** Ban lãnh đạo cần xem những chỉ số nào thường xuyên nhất? Hiện đang xem ở đâu?

## F.4 — Tài sản cố định

**F13.** Toàn tập đoàn hiện có bao nhiêu tài sản cố định (TSCĐ)? Gồm những loại nào (máy móc thiết bị, phương tiện vận tải, nhà xưởng, văn phòng phẩm)? TSCĐ được theo dõi ở đâu?

**F14.** Quy trình mua sắm TSCĐ mới gồm những bước gì? Ai đề xuất, ai duyệt? Khấu hao được tính theo chính sách nào?

**F15.** Khi thanh lý hoặc nhượng bán TSCĐ, quy trình gồm những bước gì? Ai quyết định?

## F.5 — Thuế

**F16.** Các loại thuế phải nộp hiện gồm những gì (thuế GTGT, thuế TNDN, thuế TNCN, thuế nhà thầu)? Mỗi công ty có phương pháp khấu trừ thuế GTGT riêng không?

**F17.** Hóa đơn đầu vào và đầu ra có được quản lý bằng hóa đơn điện tử không? Có sử dụng phần mềm hỗ trợ khai thuế không?

## F.6 — Dòng tiền và chi phí sản xuất

**F18.** Dòng tiền (cash flow) được theo dõi và dự báo như thế nào? Có báo cáo dòng tiền theo ngày/tuần/tháng không? Ai chịu trách nhiệm lập và xem báo cáo này?

**F19.** Chi phí sản xuất chung (overhead) gồm những gì? Ví dụ: điện, nước, khấu hao máy móc, chi phí bảo trì, chi phí môi trường. Các chi phí này được phân bổ vào giá thành sản phẩm như thế nào?

---

# PHẦN G — NHÂN SỰ VÀ TỔ CHỨC

> Gửi cho: Trưởng phòng Nhân sự, Ban lãnh đạo

## G.1 — Cơ cấu tổ chức và nhân sự

**G1.** Mỗi công ty trong tập đoàn có bao nhiêu phòng ban? Liệt kê tên các phòng ban hiện có. Có phòng ban nào chung giữa các công ty (ví dụ: nhân sự, kế toán, IT) không?

**G2.** Ai là người đại diện pháp lý (Tổng giám đốc / Giám đốc) của từng công ty? Họ có phải là người ký hợp đồng lao động và duyệt nhân sự không?

**G3.** Tổng số nhân viên toàn tập đoàn hiện là bao nhiêu? Phân bổ theo công ty và theo phòng ban như thế nào? Nhân viên có làm việc kiêm nhiệm giữa các công ty không?

**G4.** Nhân viên được quản lý hồ sơ ở đâu? Mỗi công ty quản lý nhân sự riêng hay có bộ phận nhân sự chung cho cả tập đoàn?

## G.2 — Hồ sơ nhân viên

**G5.** Thông tin bắt buộc trong hồ sơ nhân viên gồm những gì (CMND/CCCD, bằng cấp, hợp đồng lao động, quá trình công tác)? Hồ sơ được lưu ở đâu (hồ sơ giấy, file trên máy tính, phần mềm)?

**G6.** Có lưu trữ bản scan hợp đồng lao động, quyết định tuyển dụng, quyết định tăng lương, quyết định khen thưởng/kỷ luật không? Tìm lại khi cần như thế nào?

## G.3 — Hợp đồng lao động

**G7.** Các loại hợp đồng lao động đang sử dụng gồm những loại nào? Ví dụ: hợp đồng không xác định thời hạn, hợp đồng xác định thời hạn 12 tháng, hợp đồng thử việc, hợp đồng cộng tác viên.

**G8.** Quy trình ký hợp đồng lao động mới gồm những bước gì? Ai duyệt tuyển dụng, ai ký hợp đồng, hồ sơ gốc lưu ở đâu?

**G9.** Thời hạn hợp đồng được theo dõi như thế nào? Hiện có ai hoặc hệ thống nào nhắc trước khi hợp đồng hết hạn (ví dụ: 30 ngày trước) để kịp gia hạn hoặc chấm dứt không?

**G10.** Khi nhân viên nghỉ việc, quy trình gồm những bước gì? Ai duyệt nghỉ việc, tính thanh toán cuối cùng (lương, BHXH, các khoản phải trả), thu hồi tài sản (máy tính, thẻ từ)? Có quyết định chấm dứt hợp đồng bằng văn bản không?

## G.4 — Chấm công và tính lương

**G11.** Chấm công hiện đang thực hiện bằng hình thức nào (máy vân tay, thẻ từ, app điện thoại, ký sổ)? Mỗi công ty có cách chấm công riêng hay dùng chung?

**G12.** Quy định giờ làm việc có thống nhất không? Có ca sản xuất (ca đêm, ca 3) không? Cách xử lý đi muộn, về sớm như thế nào?

**G13.** Kỳ tính lương là gì (theo tháng dương lịch hay theo kỳ cố định)? Ngày chốt công là ngày nào? Ngày thanh toán lương là ngày nào? Lương được trả bằng chuyển khoản hay tiền mặt?

**G14.** Cơ cấu lương gồm những thành phần nào? Ví dụ: lương cơ bản, phụ cấp (xăng xe, điện thoại, nhà ở), KPI bonus, thưởng doanh số, thưởng hiệu suất. Có phụ cấp đặc thù cho nhà máy (độc hại, độ cao) không?

**G15.** Phần mềm tính lương hiện đang dùng là gì? Hay đang tính lương bằng Excel hoặc thủ công? Ai chịu trách nhiệm tính lương?

## G.5 — BHXH, BHYT, thuế TNCN

**G16.** BHXH, BHYT, BHTN được đóng ở đâu (cơ quan BHXH quận/huyện nào)? Mỗi công ty đóng riêng hay có cơ quan quản lý chung?

**G17.** Quy trình đăng ký BHXH, tăng/giảm nhân viên hiện thực hiện như thế nào? Ai chịu trách nhiệm làm thủ tục?

**G18.** Thuế thu nhập cá nhân (TNCN) được tính và khấu trừ như thế nào? Có người phụ thuộc không? Ai chịu trách nhiệm quyết toán TNCN cuối năm?

## G.6 — Tuyển dụng, đào tạo, khen thưởng, kỷ luật

**G19.** Quy trình tuyển dụng hiện gồm những bước gì? Tuyển dụng qua kênh nào (Zalo, LinkedIn, VietnamWork, giới thiệu)? Ai phỏng vấn và ai duyệt tuyển?

**G20.** Có chương trình đào tạo nhân viên mới (onboarding) không? Có đào tạo chuyên môn, an toàn lao động định kỳ không?

**G21.** Khen thưởng nhân viên được thực hiện theo tiêu chí nào (thành tích, doanh số, sáng kiến)? Ai đề xuất và ai quyết định?

**G22.** Kỷ luật lao động được áp dụng theo nội quy lao động nào? Các hình thức kỷ luật hiện có (khiển trách, cảnh cáo, sa thải)? Quy trình xử lý kỷ luật gồm những bước gì?

## G.7 — Phần mềm nhân sự

**G23.** Phần mềm quản lý nhân sự hiện đang dùng là gì? Hay đang quản lý bằng Excel, sổ sách? Nếu dùng phần mềm, đã dùng được bao lâu?

**G24.** Quy trình duyệt nghỉ phép, nghỉ bệnh hiện đang thực hiện qua kênh nào (email, app, giấy tờ)? Ai duyệt và ai theo dõi?

## G.8 — Phúc lợi, đi công tác và nội quy

**G25.** Nhân viên được hưởng những phúc lợi gì ngoài lương? Ví dụ: bảo hiểm sức khỏe (bảo hiểm cao cấp hơn BHXH), thưởng lễ tết, quà sinh nhật, thưởng nóng, team building, khám sức khỏe định kỳ. Các phúc lợi này áp dụng cho tất cả nhân viên hay chỉ cấp quản lý?

**G26.** Quy trình đi công tác (business trip) hiện như thế nào? Ai duyệt đơn xin đi công tác, có giới hạn chi phí (vé máy bay, khách sạn, tiền ăn) không? Quyết toán chi phí công tác sau khi về được thực hiện ra sao?

**G27.** Công ty có nội quy lao động bằng văn bản không? Nội quy có đã được đăng ký với Sở Lao động Thương binh và Xã hội chưa? Các nội quy đặc thù nào đang áp dụng (nội quy nhà máy, nội quy an toàn, nội quy bảo mật)?

**G28.** Có chương trình chăm sóc sức khỏe tinh thần hoặc phúc lợi khác cho nhân viên không? Ví dụ: hỗ trợ tâm lý (EAP), ngày nghỉ wellness, gói hỗ trợ gia đình?

## G.9 — Quản lý thông tin nhân sự trên hệ thống

**G29.** Danh bạ nhân viên nội bộ (số nội bộ, email công ty, chức vụ) hiện được quản lý ở đâu? Có cần tích hợp với hệ thống gọi nội bộ hoặc email công ty không?

**G30.** Khi cần tra cứu nhanh thông tin nhân sự của một nhân viên (hồ sơ, lương, thâm niên), quy trình hiện tại là gì? Có quyền truy cập hạn chế theo vai trò không?

---

# PHẦN L — MUA HÀNG VÀ QUẢN LÝ NHÀ CUNG CẤP

> Gửi cho: Quản lý mua hàng, Kế toán trưởng, Quản lý nhà máy

**L1.** Đơn mua hàng (PO) hiện được lập như thế nào và ai có quyền lập? Có form chuẩn hay tự do?

**L2.** Đơn mua hàng cần những thông tin bắt buộc nào? Ví dụ: tên nhà cung cấp, mã hàng, số lượng, đơn giá, ngày giao hàng dự kiến, người duyệt.

**L3.** Ai có thẩm quyền duyệt đơn mua hàng? Có phân quyền theo giá trị đơn hàng không (ví dụ: dưới 10 triệu duyệt một cấp, trên 50 triệu duyệt hai cấp)?

**L4.** Danh sách nhà cung cấp hiện được quản lý ở đâu (Excel, phần mềm, danh bạ cá nhân)? Có danh sách nhà cung cấp đã được phê duyệt (approved vendor list) không? Tiêu chí để trở thành nhà cung cấp được duyệt là gì?

**L5.** Nhà cung cấp được phân loại như thế nào? Ví dụ: nhà cung cấp nguyên liệu, bao bì, thiết bị, dịch vụ. Có phân cấp A/B/C theo mức độ quan trọng không?

**L6.** Khi nhận hàng, quy trình kiểm tra hàng mua gồm những bước gì? Ai kiểm tra số lượng, ai kiểm tra chất lượng? Hàng không đạt hoặc thiếu thì xử lý ra sao?

**L7.** Phiếu nhập kho mua hàng được lập mấy bản, lưu ở đâu? Có đối chiếu với đơn mua hàng và hóa đơn nhà cung cấp (đối chiếu 3 bên) không?

**L8.** Công nợ phải trả nhà cung cấp đang theo dõi ở đâu? Điều khoản thanh toán với từng nhà cung cấp là gì (trả trước, trả sau bao nhiêu ngày)? Có lịch thanh toán định kỳ không?

**L9.** Thanh toán cho nhà cung cấp được thực hiện qua hình thức nào (chuyển khoản, tiền mặt, L/C)? Ai có quyền duyệt chi tiền?

**L10.** Có tạm ứng tiền để mua hàng ngoài không? Quy trình tạm ứng và hoàn ứng hiện như thế nào?

**L11.** Khi mua hàng khẩn (ngoài kế hoạch), quy trình duyệt có khác gì so với mua hàng thông thường không?

**L12.** Có đánh giá nhà cung cấp định kỳ không? Tiêu chí đánh giá gồm những gì (chất lượng, giao hàng đúng hạn, giá cả)?

## L.2 — Hợp đồng cung ứng và quản lý rủi ro

**L13.** Có hợp đồng cung ứng dài hạn (hàng năm) với nhà cung cấp chiến lược không? Hợp đồng cung ứng gồm những nội dung chính nào (giá cố định, cam kết sản lượng, điều khoản phạt vi phạm)?

**L14.** Khi nhà cung cấp giao hàng không đúng hạn hoặc không đạt chất lượng, có điều khoản phạt (penalty) trong hợp đồng không? Quy trình áp dụng penalty hiện như thế nào?

**L15.** Có nhà cung cấp dự phòng (backup supplier) cho các nguyên vật liệu quan trọng không? Khi nhà cung cấp chính gặp sự cố, quy trình chuyển đổi sang nhà cung cấp dự phòng như thế nào?

---

# PHẦN H — R&D VÀ ĐĂNG KÝ SẢN PHẨM

> Gửi cho: Trưởng phòng R&D, Phụ trách đăng ký sản phẩm

## H.1 — Phát triển sản phẩm

**H1.** Quy trình phát triển sản phẩm mới từ ý tưởng đến sản phẩm thương mại gồm những giai đoạn nào?

**H2.** Tài liệu công thức sản phẩm (formula, specification) hiện đang lưu ở đâu? Ai có quyền truy cập và chỉnh sửa? Có kiểm soát phiên bản không?

**H3.** Khi phát triển sản phẩm mới, có quy trình thử nghiệm mẫu (trial sample, benchmark) trước khi sản xuất thương mại không? Mẫu thử nghiệm được gửi cho khách hàng hoặc đại lý như thế nào? Có lưu lại kết quả thử nghiệm không?

## H.2 — Đăng ký và pháp luật ngành

**H4.** Giấy phép lưu hành sản phẩm (thuốc BVTV, phân bón, mỹ phẩm) do ai quản lý? Danh sách lưu ở đâu? Có hệ thống nhắc khi sắp hết hạn không?

**H5.** Hồ sơ đăng ký sản phẩm gồm những tài liệu gì? Ai lập và ai lưu trữ?

**H6.** Khi thay đổi công thức hoặc đổi nhà cung cấp nguyên liệu, quy trình cập nhật đăng ký sản phẩm gồm những bước gì?

---

# PHẦN I — BÁN HÀNG VÀ QUẢN LÝ KHÁCH HÀNG

> Gửi cho: Quản lý kinh doanh, Trưởng nhóm bán hàng

## I.1 — Tổ chức đội ngũ kinh doanh

**I1.** Đội ngũ kinh doanh được tổ chức như thế nào? Chia theo khu vực địa lý, theo thương hiệu hay theo nhóm sản phẩm? Ai là quản lý trực tiếp của từng nhóm?

**I2.** Nhân viên kinh doanh đang lưu thông tin khách hàng ở đâu? Có dùng CRM không hay đang dùng Excel hoặc danh bạ cá nhân?

**I3.** Khi nhân viên kinh doanh nghỉ việc, dữ liệu khách hàng được chuyển giao như thế nào?

**I4.** Có chính sách hoa hồng bán hàng không? Tính theo doanh thu, lợi nhuận hay sản lượng? Ai xác nhận con số hoa hồng cuối tháng?

**I5.** Báo cáo doanh số nhân viên kinh doanh được lập tần suất nào và ai là người xem báo cáo này?

## I.2 — Cơ hội kinh doanh và pipeline

**I6.** Có theo dõi cơ hội kinh doanh (lead/pipeline) không? Khi một khách hàng tiềm năng liên hệ, quy trình tiếp nhận, phân分配 và theo dõi đến khi ký hợp đồng như thế nào?

**I7.** Khi nhiều nhân viên kinh doanh cùng tiếp cận một khách hàng tiềm năng, quy tắc xử lý tranh chấp khách hàng là gì? Khách hàng thuộc về công ty hay thuộc về nhân viên?

## I.3 — Hoạt động kinh doanh ngoài thị trường

**I8.** Nhân viên kinh doanh ngoài thị trường có lịch thăm khách (visit plan) không? Có báo cáo hoạt động hàng ngày/tuần không? Báo cáo này được gửi ở đâu?

---

# PHẦN K — KỸ THUẬT VÀ HƯỚNG PHÁT TRIỂN ERP

> Gửi cho: Người phụ trách IT, Người ra quyết định về hệ thống

## K.1 — Hạ tầng hiện tại

**K1.** Tập đoàn hiện có bộ phận IT không? Có bao nhiêu người? Họ đang phụ trách những hệ thống gì?

**K2.** Liệt kê các phần mềm đang dùng trong toàn tập đoàn: phần mềm kế toán, phần mềm kho, phần mềm bán hàng, phần mềm nhân sự, công cụ giao tiếp nội bộ.

**K3.** Dữ liệu hiện đang lưu ở đâu (máy tính cá nhân, máy chủ nội bộ, Google Drive, đám mây)? Có backup thường xuyên không?

**K4.** Đường truyền internet tại nhà máy và văn phòng có ổn định không? Có xảy ra mất kết nối thường xuyên không?

**K5.** Nhân viên ở bộ phận nào đang dùng điện thoại hoặc máy tính bảng cho công việc (kho, kinh doanh ngoài thị trường, nhà máy)?

## K.2 — Yêu cầu hệ thống ERP

**K6.** Module ERP nào là ưu tiên số 1 cần triển khai trước? Lý do?

**K7.** Cần tích hợp với hệ thống bên ngoài nào? Ví dụ: sàn TMĐT (Shopee, TikTok Shop), đơn vị vận chuyển (GHN, GHTK), cổng thanh toán (VNPAY, MoMo), phần mềm kế toán MISA.

**K8.** Dữ liệu lịch sử từ các phần mềm hiện tại có cần chuyển sang ERP mới không? Dữ liệu quan trọng nhất cần chuyển là gì (danh mục khách hàng, tồn kho đầu kỳ, công nợ hiện tại)?

**K9.** Thời gian dự kiến đưa hệ thống vào vận hành là khi nào? Có thời hạn cứng phải hoàn thành không?

## K.3 — Phân quyền và bảo mật

**K10.** Ai được phép xem dữ liệu của toàn bộ công ty thành viên? Ai chỉ xem được dữ liệu công ty mình?

**K11.** Có yêu cầu phân quyền theo thương hiệu không? Ví dụ: nhân viên Dr.Xanh không xem được dữ liệu của Bambom?

**K12.** Dữ liệu nào cần bảo mật cao nhất (giá mua nguyên liệu, công thức sản phẩm, lương nhân viên)?

**K13.** Có cần lưu lịch sử ai đã sửa gì, lúc nào (audit trail) không?

## K.4 — AI và tự động hóa

**K14.** Có quan tâm đến tự động hóa trong hệ thống không? Ví dụ: tự động cảnh báo khi tồn kho xuống dưới mức tối thiểu, tự động nhắc thanh toán khi đến hạn, tự động tổng hợp báo cáo cuối ngày.

**K15.** Trong tương lai có muốn tích hợp AI để dự báo nhu cầu hàng hóa (giảm tồn kho thừa, tránh thiếu hàng) không?

## K.5 — Vận hành hệ thống sau go-live

**K16.** Sau khi ERP đưa vào vận hành, ai là người quản trị hệ thống nội bộ? Người đó có nền tảng kỹ thuật không?

**K17.** Khi có sự cố hệ thống, kỳ vọng thời gian phản hồi từ đội hỗ trợ là bao lâu (trong giờ hành chính hay cần 24/7)?

**K18.** Có bộ phận nào cần hệ thống hoạt động được khi mất internet không? Ví dụ: nhập kho tại nhà máy ở khu vực sóng yếu.

**K19.** Dự kiến bao nhiêu người dùng sẽ đăng nhập hệ thống cùng lúc trong giờ cao điểm?

## K.6 — Hướng phát triển ERP (tầm nhìn dài hạn)

**K20.** Sau khi ERP cơ bản đi vào vận hành, doanh nghiệp có kế hoạch mở rộng thêm module nào không? Ví dụ: quản lý bán hàng tại cửa hàng (POS), quản lý nông trại/trang trại (nếu có mở rộng mảng nông nghiệp), quản lý dự án nội bộ?

**K21.** Tập đoàn có kế hoạch mở thêm công ty mới hoặc thêm chi nhánh/địa điểm kinh doanh trong 1–3 năm tới không? Hệ thống ERP có cần hỗ trợ mở rộng quy mô linh hoạt không?

**K22.** Có yêu cầu hệ thống ERP cần hoạt động trên **điện thoại di động** (app hoặc web mobile) cho những vị trí nào (nhân viên kinh doanh ngoài thị trường, quản lý kho, nhân viên giao hàng)?

**K23.** Ban lãnh đạo có muốn hệ thống ERP có **dashboard tổng quan** (trang tổng hợp) để xem nhanh các chỉ số quan trọng như doanh thu, tồn kho, công nợ, tình hình sản xuất — tất cả trên một màn hình, có thể xem từ xa (điện thoại) không?

**K24.** Có nhu cầu gửi **thông báo tự động** qua Zalo OA hoặc SMS cho khách hàng/đại lý không? Ví dụ: thông báo đơn hàng đã xác nhận, đơn hàng đang giao, thông báo công nợ đến hạn?

**K25.** Hệ thống ERP có cần **theo dõi chi phí vận chuyển theo từng đơn hàng** hoặc **tính giá thành theo lô sản xuất** không? Đây là hai nghiệp vụ phổ biến trong ngành hóa nông và phân bón.

**K26.** Doanh nghiệp có yêu cầu hệ thống phải **hỗ trợ đa ngôn ngữ** (tiếng Việt, tiếng Anh) không? Vì có thể có nhà cung cấp nước ngoài hoặc đối tác quốc tế cần truy cập.

**K27.** Phần mềm ERP dự kiến được triển khai theo mô hình nào: **trên nền tảng đám mây (cloud/SaaS)** hay **cài đặt tại máy chủ công ty (on-premise)**? Lý do lựa chọn là gì?

**K28.** Khi hệ thống ERP cần nâng cấp hoặc thêm tính năng mới, kỳ vọng quy trình thực hiện như thế nào? Có cần đội ngũ kỹ thuật hỗ trợ thường xuyên hay chỉ cần bảo trì định kỳ?

**K29.** Doanh nghiệp có đang theo dõi các chỉ số KPI nào cho từng phòng ban không? Ví dụ: tỷ lệ giao hàng đúng hạn (OTIF), tỷ lệ sản phẩm đạt QC, số ngày tồn kho bình quân (days inventory). Nếu có, báo cáo KPI ở đâu và ai xem?

**K30.** Doanh nghiệp có các chứng nhận chất lượng nào (ISO 9001, ISO 17025, GMP, VietGAP)? Có giấy phép môi trường (loại A/B/C) cho nhà máy chưa? ERP có cần hỗ trợ tuân thủ các tiêu chuẩn này không?

**K31.** Rủi ro pháp lý đặc thù nào của ngành hóa nông cần được quản lý trên hệ thống? Ví dụ: giấy phép lưu hành thuốc BVTV và phân bón, giấy phép phòng Lab, báo cáo tồn dư thuốc BVTV, giấy phép sản xuất phân bón theo Nghị định 84/2019.

**K32.** Ai là **quản trị dự án ERP (project owner)** phía doanh nghiệp? Người đó có thể dành bao nhiêu phần trăm thời gian cho dự án? Có nhân sự nào sẵn sàng đi sâu vào chi tiết nghiệp vụ để làm việc trực tiếp với đội triển khai không?

**K33.** Mức độ sẵn sàng thay đổi của từng bộ phận hiện như thế nào? Có bộ phận nào đang quen với cách làm cũ và có thể kháng cự triển khai ERP không?

---

# PHỤ LỤC — BẢNG TỔNG HỢP

| Phần | Chủ đề | Số câu | Gửi cho |
|---|---|---|---|
| A | Cấu trúc tập đoàn và các công ty | 8 | Ban lãnh đạo, Hành chính |
| B | Mảng gia công | 26 | Quản lý nhà máy, R&D, Lab |
| C | Mảng phân phối | 25 | Quản lý kinh doanh, XNK |
| D | Mảng bán lẻ | 20 | Quản lý thương hiệu, Bán hàng online |
| E | Kho vận & logistics | 13 | Quản lý kho |
| F | Kế toán tài chính | 19 | Kế toán trưởng |
| G | Nhân sự & tổ chức | 30 | Trưởng phòng Nhân sự, Ban lãnh đạo |
| H | R&D & đăng ký sản phẩm | 6 | Trưởng R&D |
| I | Bán hàng & quản lý khách hàng | 8 | Quản lý kinh doanh |
| K | Kỹ thuật & hướng phát triển ERP | 33 | IT, người ra quyết định |
| L | Mua hàng & quản lý nhà cung cấp | 15 | Quản lý mua hàng, Kế toán trưởng |
| **Tổng** | | **183 câu** | |

---

## Các câu đã loại qua các phiên bản và lý do

| Câu đã loại | Lý do |
|---|---|
| A9 (v1) — Kế hoạch thành lập công ty mới | Chiến lược, không ảnh hưởng đến thiết kế phần mềm hiện tại |
| A10 (v1) — Chuẩn VAS/IFRS | Quá chuyên sâu kế toán, không cần thiết ở giai đoạn khảo sát |
| B1 (v1) — Tỷ lệ % doanh thu nội/ngoại | Số kinh doanh, không cần để thiết kế luồng phần mềm |
| B26 (v1) — Chi phí nhân công thời vụ tính vào giá thành | Bài toán kế toán giá thành phức tạp, để giai đoạn sau |
| C14 (v1) — Ảnh hưởng mùa vụ tới kế hoạch chiến lược | Phân tích kinh doanh, không phải câu hỏi phần mềm |
| F11 (v1) — Báo cáo hợp nhất theo chuẩn nào | Quá phức tạp cho giai đoạn khảo sát ban đầu |
| I7 (v1) — Phân bổ chi phí khuyến nông | Chiến lược marketing, không phải nghiệp vụ phần mềm cốt lõi |
| J2, J3, J5 (v1) — Câu hỏi chiến lược Ban Giám đốc | Không liên quan đến thiết kế hệ thống |
| K9 (v1) — Ngân sách dự án ERP | Nhạy cảm, nên thảo luận riêng không đưa vào form khảo sát |
| K16–K20 (v1) — Các câu AI nâng cao | Rút gọn còn K14–K15, đủ để nắm định hướng |

---

## Lịch sử phiên bản

| Phiên bản | Thay đổi chính |
|---|---|
| v1 | Bộ câu hỏi ban đầu |
| v2 | Loại bỏ câu hỏi chiến lược, không cần thiết cho thiết kế phần mềm |
| v3 | Đổi từ ngữ phần A cho dễ hiểu; bổ sung 16 câu mới; cập nhật bảng tổng hợp |
| v4 | Xây dựng lại phần G (6 → 24 câu); thêm phần L mới (12 câu); bổ sung I, F, A; tổng 159 câu |
| v5 | Bổ sung chi tiết: G thêm 6 câu (G25–G30), B thêm 2 câu (B25–B26), F thêm 2 câu (F18–F19), H thêm 1 câu (H6), L thêm 3 câu (L13–L15), C thêm 3 câu (C23–C25), D thêm 2 câu (D19–D20); tổng 178 câu |
| v6 | Thêm K29–K33 (KPI, chứng nhận chất lượng, rủi ro pháp lý ngành hóa nông, project owner, sẵn sàng thay đổi); tách sub-section cho E và H cho nhất quán; cập nhật cấu trúc; tổng 183 câu |