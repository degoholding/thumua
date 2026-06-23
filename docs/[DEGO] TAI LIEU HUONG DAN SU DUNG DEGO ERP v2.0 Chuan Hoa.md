# TÀI LIỆU HƯỚNG DẪN SỬ DỤNG HỆ THỐNG DEGO ERP v2.0
**Hệ thống ERP:** [erp.degoholding.vn](https://erp.degoholding.vn)  
**Phiên bản tài liệu:** v2.0 (Chuẩn hóa)  
**Ngày cập nhật:** 16/06/2026  
**Đơn vị phát triển:** DX Team  
**Đối tượng sử dụng:** Bộ phận yêu cầu (BP/YC), Nhân sự thu mua (NSTM), Trưởng bộ phận (TBP), Thủ kho (KHO), Kế toán (KT)

---

## PHẦN I — TỔNG QUAN QUY TRÌNH & VAI TRÒ

### 1. Quy trình Thu mua Cốt lõi
Quy trình thu mua trên hệ thống DEGO ERP được chuẩn hóa qua 4 bước chính nhằm đảm bảo tính minh bạch, kiểm soát chi phí và tối ưu hóa thời gian:

```
Yêu Cầu Thu Mua (YCTM) ──> Khảo Sát Nhà Cung Cấp ──> Khảo Sát Sản Phẩm ──> Đơn Thu Mua (PO)
```

| Bước | Phân hệ / Nghiệp vụ | Ai thực hiện | Mục đích chính |
| :--- | :--- | :--- | :--- |
| **1** | **Yêu Cầu Thu Mua (YCTM)** | Bộ phận có nhu cầu (BP/YC) | Khai báo chi tiết nhu cầu mua vật tư, số lượng, thời gian và kho nhận hàng. |
| **2** | **Khảo Sát Nhà Cung Cấp (KS NCC)** | Nhân sự thu mua (NSTM) | Khảo sát năng lực, hồ sơ pháp lý, chính sách giao hàng và công nợ của NCC. |
| **3** | **Khảo Sát Sản Phẩm (KS SP)** | Nhân sự thu mua (NSTM) | So sánh giá cả, thông số kỹ thuật, chất lượng mẫu thử giữa các NCC để chọn NCC tối ưu. |
| **4** | **Đơn Thu Mua (PO)** | Nhân sự thu mua (NSTM) | Lập và gửi đơn đặt mua hàng chính thức tới nhà cung cấp đã được phê duyệt. |

---

### 2. Các Vai trò và Quyền hạn trên Hệ thống

| Vai trò | Mã viết tắt | Quyền hạn & Trách nhiệm chính trên ERP |
| :--- | :--- | :--- |
| **Người yêu cầu** | `BP/YC` | Tạo phiếu YCTM, theo dõi trạng thái phiếu cá nhân, xem các khảo sát liên quan. |
| **Nhân sự thu mua** | `NSTM` | Tiếp nhận YCTM đã duyệt, lập phiếu khảo sát NCC, khảo sát sản phẩm, tạo đơn mua hàng (PO). |
| **Trưởng bộ phận / Quản lý** | `TBP` | Phê duyệt YCTM, chỉ định NSTM phụ trách, phê duyệt kết quả khảo sát, duyệt đơn PO. |
| **Thủ kho** | `KHO` | Thực hiện nhận hàng, kiểm đếm số lượng, xác nhận phiếu nhập kho (Purchase Receipt). |
| **Kế toán** | `KT` | Kiểm tra hóa đơn nhà cung cấp, đối chiếu 3 bên (PO - Nhập kho - Hóa đơn), lập phiếu thanh toán. |
| **Quản trị hệ thống** | `Admin` | Quản lý danh mục dùng chung, phân quyền người dùng, cấu hình quy trình duyệt nâng cao. |

---

## PHẦN II — HƯỚNG DẪN THAO TÁC CHI TIẾT

### 1. Hướng dẫn Đăng nhập
1. Truy cập địa chỉ hệ thống: [https://erp.degoholding.vn/](https://erp.degoholding.vn/)
2. Nhập thông tin tài khoản demo tương ứng với vai trò nghiệp vụ của bạn:

| Vai trò | Tài khoản Đăng nhập | Mật khẩu |
| :--- | :--- | :--- |
| **Người yêu cầu (BP/YC)** | `nsyeucau@degoholding.vn` | `dego123` |
| **Nhân sự thu mua (NSTM)** | `nsthumua@degoholding.vn` | `dego123` |
| **Trưởng bộ phận (TBP)** | `qlthumua@degoholding.vn` | `dego123` |
| **Thủ kho (KHO)** | `qlkho@degoholding.vn` | `dego123` |
| **Kế toán (KT)** | `kettoan@degoholding.vn` | `dego123` |

> [!NOTE]  
> Sau khi đăng nhập thành công, click vào biểu tượng **Mua hàng (Buying)** trên màn hình trang chủ để bắt đầu sử dụng các chức năng thu mua.

---

### 2. Yêu Cầu Thu Mua (YCTM)
Phiếu Yêu cầu thu mua là khởi nguồn của toàn bộ hoạt động mua sắm, giúp ghi nhận chi tiết nhu cầu từ các phòng ban.
* **Đường dẫn chức năng:** `Buying` ──> `Procurement Request`

#### 2.1. Tạo mới Yêu cầu Thu mua (Dành cho BP/YC)
* **Bước 1:** Vào danh sách YCTM ──> Bấm nút **+ Thêm mới** (Add Procurement Request).
* **Bước 2:** Nhập đầy đủ thông tin Header của phiếu:
  * **Ngày:** Chọn ngày tạo phiếu (mặc định là ngày hiện tại).
  * **Phòng ban:** Chọn phòng ban yêu cầu (ví dụ: *Kinh Doanh - DGD*).
  * **Ngày cần hàng:** Hạn cuối cùng cần vật tư tại kho.
  * **Người yêu cầu:** Hệ thống tự động điền dựa trên tài khoản đang đăng nhập.
  * **Công ty nhận hóa đơn:** Pháp nhân chịu trách nhiệm nhận hóa đơn tài chính.
  * **Tiêu đề:** Tóm tắt ngắn gọn nhu cầu (ví dụ: *Mua 1 tấn Humic Acid phục vụ sản xuất*).
* **Bước 3:** Nhập thông tin chi tiết vật tư tại bảng **Mặt hàng (Items)**:
  * Bấm **Thêm dòng** hoặc **Thêm nhiều** để chọn vật tư.
  * Nhập các thông tin bắt buộc: **Tên vật tư**, **Số lượng**, **Đơn vị tính (ĐVT)**, **Kho nhận hàng**, **Giá đề xuất** (nếu có).
* **Bước 4 (Nếu có):** Kéo xuống phần **Tài liệu đính kèm** ──> Bấm **Attach** để tải lên báo giá tham khảo hoặc hình ảnh mẫu.
* **Bước 5:** Bấm **Lưu** (phiếu ở trạng thái *Bản nháp* - Draft). Kiểm tra lại toàn bộ thông tin ──> Bấm **Gửi yêu cầu (Submit)** để chuyển phiếu lên Quản lý duyệt.

> [!WARNING]  
> Sau khi bấm **Gửi yêu cầu (Submit)**, bạn sẽ không thể chỉnh sửa thông tin trên phiếu. Nếu phát hiện sai sót, bạn phải liên hệ Quản lý hoặc NSTM gửi trả lại phiếu (trạng thái *Returned*).

#### 2.2. Kiểm duyệt và Phân công YCTM (Dành cho TBP / Quản lý)
* **Bước 1:** Vào danh sách YCTM ──> Mở phiếu YCTM cần xử lý (ở trạng thái *Submitted*).
* **Bước 2:** Kiểm tra tính hợp lý của thông tin: Số lượng, quy cách mặt hàng, tính cấp thiết của ngày cần hàng.
* **Bước 3:** Điền trường **Nhân sự phụ trách** để chỉ định Nhân sự thu mua (NSTM) chịu trách nhiệm xử lý đơn này.
* **Bước 4:** Thực hiện một trong các hành động sau:
  * **Xác nhận / Duyệt (Submit to confirm):** Duyệt yêu cầu và chuyển tiếp thông tin sang NSTM để thực hiện khảo sát.
  * **Trả lại đơn:** Nhấp nút trả lại và ghi rõ lý do. Phiếu sẽ quay về trạng thái *Returned* để người yêu cầu sửa đổi.

---

### 3. Khảo Sát Nhà Cung Cấp (Supplier Survey)
Mục đích là đánh giá năng lực toàn diện của nhà cung cấp tiềm năng trước khi quyết định giao dịch lâu dài.
* **Đường dẫn chức năng:** `Buying` ──> `Supplier Survey`

#### 3.1. Các phương thức khởi tạo phiếu
* **Cách 1 (Tạo độc lập):** Vào tab **Khảo sát nhà cung cấp** ──> Bấm nút **+ Add Khảo sát nhà cung cấp**.
* **Cách 2 (Liên kết từ YCTM):** Mở phiếu YCTM đã được duyệt ──> Kéo xuống phần **Khảo sát NCC** ──> Bấm nút **Tạo mới Khảo sát nhà cung cấp**. Hệ thống sẽ tự động liên kết mã YCTM gốc sang phiếu khảo sát.

#### 3.2. Điền thông tin phiếu Khảo sát NCC
Nhân sự thu mua điền đầy đủ các thông tin khảo sát theo bảng sau:

| Tên trường thông tin | Ý nghĩa & Hướng dẫn nhập |
| :--- | :--- |
| **Yêu Cầu Thu Mua** | Mã phiếu YCTM liên quan (Tự động điền nếu tạo theo Cách 2). |
| **Ngày liên hệ NCC** | *Bắt buộc.* Ngày bắt đầu liên hệ làm việc với nhà cung cấp. |
| **Ngày dự kiến NCC phản hồi** | Hạn chót NCC cam kết gửi hồ sơ/báo giá. |
| **Tên viết tắt NCC** | Chọn từ danh mục nhà cung cấp có sẵn trên hệ thống (Supplier). Nếu là NCC mới hoàn toàn, bạn có thể nhập tay thông tin. |
| **Mã số thuế** | Nhập MST của nhà cung cấp để kiểm tra pháp lý. |
| **Link định vị kho** | Dán link Google Maps định vị kho của NCC để phục vụ bài toán logistics sau này. |
| **Thông tin liên hệ** | Điền tên nhân viên kinh doanh của NCC, Số điện thoại và Link báo giá online. |

**Đánh giá Năng lực NCC:**
* **Công nghệ sản xuất / Thời gian sản xuất:** Đánh giá năng lực sản xuất và thời gian hoàn thành đơn hàng.
* **Hóa đơn:** Chọn chứng từ thuế mà NCC cung cấp (*Có hóa đơn VAT*, *Không có*, *Khác*).
* **Chính sách công nợ & giao hàng:** Nhập chi tiết thời hạn thanh toán (ví dụ: trả sau 30 ngày) và chính sách vận chuyển.
* **Đính kèm File:** Tải lên Catalogue, Đăng ký kinh doanh hoặc Hồ sơ năng lực của nhà cung cấp.

> [!IMPORTANT]  
> Để gửi duyệt phiếu khảo sát nhà cung cấp, NSTM bắt buộc phải điền đầy đủ tất cả các trường thông tin theo quy định. Nếu thiếu, hệ thống sẽ báo lỗi và phiếu sẽ giữ nguyên ở trạng thái *Draft* (Nháp).

#### 3.3. Phê duyệt Khảo sát NCC (Dành cho Quản lý / TBP)
Cấp quản lý tiến hành mở phiếu khảo sát đã gửi duyệt:
* Chọn **Hoàn thành (Complete / Approve)** để đưa nhà cung cấp vào danh sách đạt yêu cầu. Phiếu sẽ bị khóa không cho chỉnh sửa.
* Chọn **Trả đơn (Reject / Return)** để yêu cầu NSTM bổ sung thông tin hoặc khảo sát lại đối tác khác.

---

### 4. Khảo Sát Sản Phẩm (Product Survey)
Mục đích là lập bảng so sánh chi tiết các chỉ tiêu chất lượng, giá cả từ 2-3 nhà cung cấp khác nhau cho cùng một mã sản phẩm/vật tư.
* **Đường dẫn chức năng:** `Buying` ──> `Product Survey`

#### 4.1. Khởi tạo phiếu
* **Cách 1:** Vào tab **Khảo sát sản phẩm** ──> Bấm nút **+ Add Khảo sát sản phẩm**.
* **Cách 2:** Mở phiếu YCTM tương ứng ──> Chọn nút **Create** ở góc phải ──> Chọn **Add Khảo sát sản phẩm**.

#### 4.2. Điền thông tin phiếu Khảo sát Sản phẩm
* **Thông tin chung:** Mã YCTM liên quan, Ngày liên hệ, Ngày dự kiến phản hồi, Nhân sự phụ trách (bắt buộc).
* **Phần sản phẩm nội bộ khảo sát:**
  * Chọn **Mã vật tư nội bộ** (nếu đã khai báo danh mục) và điền **Tên vật tư** cần khảo sát (ví dụ: *Hộp carton 3 lớp*).
  * Chọn **Phân loại** sản phẩm: *Bao bì, Nguyên liệu, Bán thành phẩm...*

#### 4.3. Bảng so sánh chi tiết các nhà cung cấp
Bấm **Thêm dòng** để nhập thông tin báo giá của từng nhà cung cấp. Click vào biểu tượng cây bút chì ở cuối dòng để nhập chi tiết:

| Nhóm thông tin | Tên trường | Hướng dẫn nhập chi tiết |
| :--- | :--- | :--- |
| **Thông tin NCC** | Tên viết tắt NCC / Tên sản phẩm theo NCC | Chọn NCC trong hệ thống và nhập tên sản phẩm theo đúng báo giá của họ. |
| **Quy cách & MOQ** | ĐVT / MOQ tối thiểu / Thông số kỹ thuật | Điền đơn vị tính của đối tác, số lượng tối thiểu họ nhận sản xuất và mô tả chi tiết kích thước, định lượng. |
| **Thành tiền & Quy đổi** | Đơn giá / ĐVT quy đổi / VAT | Nhập đơn giá chào. Ở cột *ĐVT quy đổi*, quy về ĐVT chuẩn của công ty để hệ thống tự quy đổi đơn giá tương ứng, giúp so sánh công bằng. |
| **Logistics** | Thời gian giao hàng / Địa điểm giao nhận | Cam kết số ngày giao hàng và địa điểm nhận hàng (ví dụ: Giao tại kho DEGO). |
| **Chất lượng** | Đánh giá chất lượng từ phòng LAB | Ghi nhận kết quả test mẫu thử nghiệm từ bộ phận Lab/QC (Đạt/Không đạt). |
| **Phê duyệt** | Duyệt (Dropdown) | Cấp quản lý sẽ chọn: *Chờ duyệt*, *Đã duyệt* (chọn NCC này) hoặc *Không duyệt*. |

#### 4.4. Duyệt Khảo sát Sản phẩm từ màn hình danh sách (List View)
* **Bước 1:** Vào menu **Khảo sát sản phẩm** từ menu bên trái.
* **Bước 2:** Chọn và mở phiếu khảo sát sản phẩm cần xem xét.
* **Bước 3:** Kéo xuống bảng so sánh ──> Click chọn trạng thái của từng dòng nhà cung cấp ──> Chuyển thành **Đã duyệt (Approved)** cho nhà cung cấp được chọn ──> Bấm **Lưu / Cập nhật**.

---

### 5. Hợp Đồng (Contract)
Hệ thống quản lý hợp đồng giúp lưu trữ, theo dõi thời hạn hiệu lực và các điều khoản cam kết với đối tác cung ứng.
* **Đường dẫn chức năng:** `Buying` ──> `Contract`

#### 5.1. Các cách tìm kiếm và truy cập chức năng
* **Cách 1:** Nhập từ khóa `Contract List` vào thanh công cụ tìm kiếm nhanh (Ctrl+K) ở trên cùng giao diện để truy cập trực tiếp.
* **Cách 2:** Vào màn hình chi tiết của một nhà cung cấp (Supplier) ──> Chọn tab **Connections** ──> Chọn **Contract**. Bạn có thể bấm nút **(+)** tại đây để tạo nhanh hợp đồng liên kết với nhà cung cấp đó.

#### 5.2. Tạo mới và Kích hoạt Hợp đồng
* **Bước 1:** Bấm **Tạo mới Hợp đồng** (Add Contract).
* **Bước 2:** Điền các thông tin bắt buộc: **Công ty** (pháp nhân ký), **Nhà cung cấp**, **Ngày bắt đầu** và **Ngày kết thúc** hợp đồng.
* **Bước 3:** Đính kèm file hợp đồng đã scan (hệ thống hỗ trợ đính kèm 1 file chính).
* **Bước 4:** Bấm **Lưu**. Hợp đồng lúc này ở trạng thái *Chưa ký*.
* **Bước 5:** Khi hợp đồng thực tế đã được các bên ký kết thành công, mở lại phiếu hợp đồng trên ERP ──> Tích chọn trạng thái **Signed (Đã ký)** ──> Bấm **Lưu** để kích hoạt hợp đồng trên hệ thống.

---

### 6. Đơn Thu Mua (Purchase Order - PO)
Đơn thu mua là văn bản thương mại chính thức gửi đến NCC để xác nhận các mặt hàng, số lượng và giá cả đã thỏa thuận.
* **Đường dẫn chức năng:** `Buying` ──> `Purchase Order`

#### 6.1. Phương thức khởi tạo đơn PO
* **Cách 1 (Tạo độc lập):** Vào tab **Đơn mua hàng** ──> Bấm nút **+ Add Đơn mua hàng**.
* **Cách 2 (Tạo từ phiếu khảo sát/YCTM):** Mở phiếu YCTM đã được phê duyệt ──> Chọn nút **Create** ở góc phải ──> Chọn **Add Đơn mua hàng**. Hệ thống tự động chuyển toàn bộ danh mục hàng hóa và số lượng được phê duyệt sang đơn PO.

#### 6.2. Hướng dẫn điền thông tin đơn PO
* **Thông tin Header:**
  * **Ngày giao dịch:** Mặc định là ngày hiện tại (bắt buộc).
  * **Công ty / Nhà cung cấp:** Chọn pháp nhân mua và nhà cung cấp được chọn (bắt buộc).
  * **Ngày giao hàng dự kiến:** Hạn chót nhà cung cấp cam kết giao hàng tới kho.
  * **Là gia công:** Tích chọn nếu đây là đơn thuê gia công nguyên vật liệu (không mua đứt thành phẩm).
  * **Tiền tệ & Bảng giá:** Lựa chọn loại ngoại tệ giao dịch (USD, VND...) và bảng giá áp dụng tương ứng.
* **Thông tin hàng hóa:**
  * Sử dụng tính năng **Quét mã vạch (Barcode Scanner)** để nhập nhanh vật tư hoặc chọn thủ công trong bảng chi tiết.
  * **Đặt kho đích:** Chọn kho nhận hàng mặc định cho toàn bộ đơn hàng.
* **Trạng thái phê duyệt:**
  * Sau khi điền đủ thông tin, bấm **Lưu** (Draft) ──> Bấm **Gửi (Submit)** để trình duyệt lên Quản lý/TBP phê duyệt đơn hàng.

#### 6.3. In ấn Đơn PO (Print Format)
Hệ thống hỗ trợ xuất và in đơn hàng theo biểu mẫu chuẩn của tập đoàn:
* **Bước 1:** Mở đơn PO đã phê duyệt ──> Click chọn biểu tượng **In (Print)** ở thanh công cụ góc trên bên phải.
* **Bước 2:** Trong màn hình xem trước bản in, click chọn mục **Mẫu in (Print Format)**.
* **Bước 3:** Nhập tìm kiếm chữ "Dego" ──> Chọn biểu mẫu **DEGO Purchase Order**.
* **Bước 4:** Bấm nút **In (Print Output)** trực tiếp hoặc chọn chế độ xem toàn trang (**Fullpage**) để tải xuống tệp PDF.

---

### 7. Hóa Đơn Mua Hàng (Purchase Invoice)
Dùng để ghi nhận nghĩa vụ tài chính phát sinh phải trả cho nhà cung cấp khi nhận được hóa đơn tài chính.
* **Đường dẫn chức năng:** `Buying / Accounts` ──> `Purchase Invoice`

#### 7.1. Tạo mới hóa đơn mua hàng
* **Bước 1:** Truy cập vào danh sách **Đơn mua hàng (PO)** ──> Chọn đơn hàng đang ở trạng thái *Chờ nhận hàng + lập hóa đơn*.
* **Bước 2:** Click chọn nút **Create** ──> Chọn **Hóa đơn mua hàng (Purchase Invoice)**. Hệ thống sẽ kế thừa toàn bộ thông tin từ PO sang hóa đơn.

#### 7.2. Giải thích các trường thông tin chính trên Hóa đơn

| Tên trường | Ý nghĩa & Hướng dẫn sử dụng |
| :--- | :--- |
| **Mã số** | Tự động sinh theo tiền tố đã thiết lập (ví dụ: `ACC-PINV-YYYY-#####`). |
| **Nhà cung cấp / Mã số thuế** | Tự động điền theo đơn PO liên quan. |
| **Tiêu đề** | Dùng để nhập hoặc đồng bộ mã số hóa đơn tương ứng trên phần mềm kế toán MISA. |
| **Ngày / Giờ hạch toán** | Ngày chính thức ghi nhận phát sinh công nợ vào Sổ cái. Để thay đổi ngày lùi/tiến, tích chọn *Đặt giờ hạch toán*. |
| **Hạn thanh toán** | Hạn cuối trả tiền cho NCC. Tự động tính dựa trên điều khoản thanh toán ký kết. |
| **Đã thanh toán (Hộp kiểm)** | Tích chọn nếu thanh toán ngay bằng tiền mặt/chuyển khoản lúc nhận hàng. Hệ thống sẽ mở thêm trường chọn tài khoản chi tiền. |
| **Số hóa đơn NCC / Ngày hóa đơn** | *Bắt buộc đối chiếu.* Nhập số hóa đơn đỏ/hóa đơn điện tử gốc nhận từ NCC và ngày xuất ghi trên hóa đơn đó. |
| **Cập nhật tồn kho** | Tích chọn nếu muốn hóa đơn này kiêm luôn phiếu Nhập kho (hệ thống tự động tăng tồn kho mà không cần làm phiếu Nhập kho riêng). |

#### 7.3. Xác nhận Hóa đơn và Quy trình tiếp theo
* Sau khi tạo, hóa đơn ở trạng thái *Draft* (Bản nháp). Kế toán viên có thẩm quyền kiểm tra lại thông tin và bấm **Xác nhận (Submit / Confirm)**.
* Khi hóa đơn được xác nhận, trạng thái sẽ chuyển thành **Chưa thanh toán (Unpaid)**.
* Từ màn hình hóa đơn này, người dùng có thể click **Create** để thực hiện các thao tác: *Yêu cầu thanh toán (Payment Request)*, *Phiếu thanh toán (Payment Entry)* hoặc *Ghi nợ*.

> [!NOTE]  
> Một hóa đơn mua hàng có thể liên kết với nhiều phiếu nhập kho khác nhau, và có thể được cấn trừ bởi nhiều phiếu thanh toán khác nhau (phù hợp cho các nghiệp vụ thanh toán nhiều lần hoặc thanh toán tạm ứng một phần).

---

### 8. Phiếu Thanh Toán (Payment Entry)
Chứng từ kế toán trung tâm dùng để ghi nhận các giao dịch thực tế phát sinh dòng tiền đi hoặc dòng tiền đến của công ty.
* **Đường dẫn chức năng:** `Accounts` ──> `Payment Entry`

#### 8.1. Các nghiệp vụ hỗ trợ chính
Hệ thống phân loại dòng tiền qua trường **Payment Type (Loại thanh toán)**:
* **Pay (Chi tiền):** Trả tiền cho Nhà cung cấp, thanh toán hóa đơn hoặc chi phí phát sinh.
* **Receive (Thu tiền):** Thu tiền từ khách hàng hoặc các khoản thu khác vào quỹ.
* **Internal Transfer (Chuyển khoản nội bộ):** Điều chuyển dòng tiền qua lại giữa các tài khoản ngân hàng hoặc quỹ tiền mặt nội bộ.

#### 8.2. Hướng dẫn nhập liệu chi tiết trên Phiếu thanh toán

| Tên trường trên hệ thống | Hướng dẫn nhập & Logic xử lý |
| :--- | :--- |
| **Payment Type** | Chọn hướng dòng tiền tương ứng: *Pay*, *Receive* hoặc *Internal Transfer*. |
| **Ngày hạch toán** | Ngày ghi nhận bút toán dòng tiền vào Sổ cái kế toán. |
| **Mode of Payment** | Chọn hình thức thanh toán thực tế: *Chuyển khoản ngân hàng*, *Tiền mặt*, *Thẻ tín dụng*... |
| **Party Type / Party** | Chọn loại đối tượng (*Supplier* / *Customer*...) và mã/tên đối tác cụ thể nhận/trả tiền. |
| **Tài khoản chi / Tài khoản nhận** | Định khoản tài khoản nguồn chi tiền (ví dụ: Tài khoản ngân hàng công ty) và tài khoản đích tiếp nhận tiền (ví dụ: Tài khoản công nợ của NCC). |
| **Số tiền đã trả / Số tiền nhận** | Nhập số tiền thực tế thực hiện giao dịch. |
| **Reference No / Date** | Nhập số giao dịch ngân hàng (Số UNC, mã giao dịch điện tử) và ngày thực hiện giao dịch (Bắt buộc nếu chọn thanh toán qua ngân hàng). |

**Tính năng Đối chiếu cấn trừ nợ:**
* Bấm nút **Get Outstanding Invoices** để hệ thống tự động quét và hiển thị danh sách các Hóa đơn mua hàng còn nợ của đối tác này ở bảng bên dưới. Kế toán điền số tiền phân bổ cho từng hóa đơn tại cột **Allocated**.
* Bấm nút **Get Outstanding Orders** để lấy danh sách các đơn PO chưa xuất hóa đơn nhằm thực hiện nghiệp vụ thanh toán tạm ứng trước.

#### 8.3. Xác nhận Phiếu thanh toán và Cập nhật trạng thái
Sau khi Kế toán trưởng hoặc người có thẩm quyền bấm **Xác nhận (Submit)** phiếu chi tiền:
* **Thanh toán đủ:** Trạng thái của hóa đơn mua hàng liên quan tự động chuyển sang màu xanh lá cây: **Đã trả (Paid)** (Số dư còn nợ bằng 0).
* **Thanh toán một phần:** Trạng thái hóa đơn chuyển sang màu vàng: **Thanh toán 1 phần (Partially Paid)** và ghi nhận rõ số tiền còn nợ lại.

---

### 9. Kế hoạch Dự Chi Nhà Cung Cấp (Payment Provision)
Đây là công cụ quản trị giúp bộ phận Thu mua và Kế toán phối hợp lên kế hoạch chi trả dòng tiền hợp lý theo tuần/tháng, đảm bảo uy tín thanh toán với nhà cung cấp.
* **Đường dẫn chức năng:** `Buying / Accounts` ──> `Payment Provision / Kế hoạch dự chi`

#### 9.1. Lập đề xuất dự chi thanh toán
* **Bước 1:** Vào chức năng **Kế hoạch dự chi nhà cung cấp** ──> Bấm **+ Thêm mới**.
* **Bước 2:** Lọc danh sách các chứng từ cần chi trả theo các tiêu chí:
  * Khoảng thời gian đến hạn thanh toán (Hạn thanh toán trên Hóa đơn mua hàng).
  * Lọc theo một Nhà cung cấp cụ thể hoặc theo nhóm dự án/pháp nhân công ty thành viên.
* **Bước 3:** Hệ thống tự động hiển thị danh sách các đơn PO đã phê duyệt cần đặt cọc, hoặc các Hóa đơn mua hàng (PINV) đang chờ thanh toán.
* **Bước 4:** Chọn nguồn quỹ dự kiến chi trả (ví dụ: chọn tài khoản ngân hàng của Công ty mẹ hoặc Công ty thành viên) ──> Nhập số tiền dự chi thực tế dự kiến phân bổ cho đợt này.
* **Bước 5:** Bấm **Lưu** và chuyển tiếp lên Ban Giám đốc hoặc Trưởng phòng Kế toán duyệt kế hoạch dòng tiền.

#### 9.2. Liên kết lập Phiếu thanh toán
Sau khi kế hoạch dự chi được duyệt:
* Kế toán dựa trên danh sách đã duyệt để bấm tạo nhanh **Phiếu thanh toán (Payment Entry)** tương ứng cho từng nhà cung cấp.
* Tránh tình trạng kế toán chi tiền ngoài kế hoạch hoặc vượt hạn mức dòng tiền cho phép trong tuần.
