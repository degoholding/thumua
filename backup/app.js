document.addEventListener('DOMContentLoaded', () => {
    const users = [
        {
            email: 'n2.kalodata@gmail.com',
            name: 'DX Lead',
            role: 'Admin',
            code: '',
            status: 'active'
        },
        {
            email: 'hau@example.com',
            name: 'Mr Hậu',
            role: 'NSTM',
            code: 'HAU',
            status: 'active'
        },
        {
            email: 'quyen@example.com',
            name: 'Ms Quyên',
            role: 'NSTM',
            code: 'QUYEN',
            status: 'active'
        },
        {
            email: 'tien@example.com',
            name: 'Mr Tiên',
            role: 'NSTM',
            code: 'TIEN',
            status: 'active'
        }
    ];

    const tbody = document.getElementById('user-table-body');

    function renderTable() {
        tbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${user.email}</td>
                <td>${user.name}</td>
                <td><span class="badge badge-role">${user.role}</span></td>
                <td>${user.code}</td>
                <td><span class="badge badge-status">${user.status}</span></td>
                <td class="text-right">
                    <div class="action-buttons">
                        <button class="btn-action">Sửa</button>
                        <button class="btn-action">Khoá</button>
                        <button class="btn-action delete">Xóa</button>
                    </div>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
    }

    renderTable();

    // Placeholder for Add User button
    document.getElementById('btn-add-user').addEventListener('click', () => {
        alert('Tính năng thêm Người dùng đang được phát triển!');
    });

    // --- API Settings ---
    const API_URL = 'https://script.google.com/macros/s/AKfycbxiJkHF9sek9uXralFTMFd_lI2Q02P5G3PrZ0wcpvKSzS18SdqqwcasBdoMDmauwAS8uw/exec';

    // --- Data Mock from 1. DATA CHUNG ---
    const mockDonVi = ["CÔNG TY TNHH DEGO HOLDING", "CÔNG TY CỔ PHẦN AGAMA", "CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI BAO BÌ CẨM HÙNG"];
    const mockBoPhan = ["Nhà máy Dego", "KD ABA", "KD ICARE", "KD DR XANH", "KD IDA", "Lab", "Xây dựng"];
    const mockNhanSu = ["Trần Viết Vỹ", "Thái Thị Thu Hiền", "Phan Thị Chúc Ly", "Võ Thanh Huyền", "Trần Quyên", "Đoàn Minh Khôi"];
    const mockTBP = ["Trần Chí Dững", "Đoàn Minh Khôi", "Ms Dung"];

    function populateDropdown(id, options) {
        const select = document.getElementById(id);
        if (!select) return;
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            select.appendChild(option);
        });
    }

    populateDropdown('pyc-donvi', mockDonVi);
    populateDropdown('pyc-bophan', mockBoPhan);
    populateDropdown('pyc-nhansu', mockNhanSu);
    populateDropdown('pyc-tbp', mockTBP);

    // --- Intake Logic ---
    let requests = [];
    const intakeTbody = document.getElementById('intake-table-body');

    async function loadRequests() {
        intakeTbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Đang tải dữ liệu từ Google Sheets...</td></tr>';
        
        let localReqs = [];
        try {
            const stored = localStorage.getItem('localRequests');
            if (stored) localReqs = JSON.parse(stored);
        } catch(e) {}

        try {
            const res = await fetch(API_URL + '?action=getRequests');
            const result = await res.json();
            if (result.status === 'success') {
                requests = [...localReqs, ...(result.data || [])];
                renderIntakeTable();
            } else {
                requests = localReqs;
                if (requests.length > 0) renderIntakeTable();
                else intakeTbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Lỗi tải dữ liệu</td></tr>';
            }
        } catch (err) {
            console.error(err);
            requests = localReqs;
            if (requests.length > 0) {
                renderIntakeTable();
            } else {
                intakeTbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Không thể kết nối đến Google Sheets</td></tr>';
            }
        }
    }

    function renderIntakeTable() {
        intakeTbody.innerHTML = '';
        if (requests.length === 0) {
            intakeTbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Chưa có yêu cầu nào</td></tr>';
            return;
        }

        requests.forEach((req, index) => {
            let statusBadgeClass = 'badge-admin'; // Default gray
            const status = req['Trạng thái'] || 'Chờ Duyệt';
            if (status === 'Đang Xử Lý') statusBadgeClass = 'badge-status';
            
            // Format money if it exists
            const tongTienStr = req['Tổng tiền dự kiến'] 
                ? Number(req['Tổng tiền dự kiến']).toLocaleString('vi-VN') + ' VNĐ'
                : '';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${req['Mã PYC'] || ''}</strong></td>
                <td>${req['Ngày tạo'] || ''}</td>
                <td>${req['Bộ phận YC'] || ''}</td>
                <td>${req['Mục đích'] || req['Nội dung yêu cầu'] || ''}</td>
                <td><strong>${tongTienStr}</strong></td>
                <td>${req['NSTM Phụ trách'] || ''}</td>
                <td><span class="badge ${statusBadgeClass}">${status}</span></td>
                <td class="text-right">
                    <div class="action-buttons">
                        <button class="btn-action btn-view" data-index="${index}">Xem</button>
                        <button class="btn-action btn-print" data-index="${index}">In</button>
                    </div>
                </td>
            `;
            intakeTbody.appendChild(tr);
        });

        // Add Print Listeners
        document.querySelectorAll('.btn-print').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reqIndex = e.currentTarget.getAttribute('data-index');
                printRequest(requests[reqIndex]);
            });
        });

        // Add View Listeners
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                alert('Tính năng Xem chi tiết trên Web đang được phát triển. Bạn có thể bấm nút [In] để xem trước toàn bộ nội dung Phiếu Yêu Cầu!');
            });
        });
    }

    // Load data when script starts
    loadRequests();

    // Intake Modal Logic
    const modalIntake = document.getElementById('modal-intake');
    const btnAddRequest = document.getElementById('btn-add-request');
    const btnCloseIntake = document.getElementById('btn-close-intake');
    const btnCancelIntake = document.getElementById('btn-cancel-intake');
    const formIntake = document.getElementById('form-intake');
    
    // Product Table Logic
    const tbodyProducts = document.getElementById('pyc-products-body');
    const btnAddProduct = document.getElementById('btn-add-product');
    
    const productEditForm = document.getElementById('product-edit-form');
    const pFormCode = document.getElementById('p-form-code');
    const pFormName = document.getElementById('p-form-name');
    const pFormUnit = document.getElementById('p-form-unit');
    const pFormQty = document.getElementById('p-form-qty');
    const pFormPrice = document.getElementById('p-form-price');
    const pFormAmount = document.getElementById('p-form-amount');
    const pFormNote = document.getElementById('p-form-note');
    const pFormIndex = document.getElementById('p-form-index');
    
    const btnSaveProduct = document.getElementById('btn-save-product');
    const btnCancelProduct = document.getElementById('btn-cancel-product');
    
    const subAmountEl = document.getElementById('pyc-sub-amount');
    const vatInputEl = document.getElementById('pyc-vat-amount');
    const totalAmountEl = document.getElementById('pyc-total-amount');

    let currentProducts = [];

    function calcFormAmount() {
        const qty = parseFloat(pFormQty.value) || 0;
        const price = parseFloat(pFormPrice.value) || 0;
        const amount = qty * price;
        pFormAmount.value = amount > 0 ? amount.toLocaleString('vi-VN') : '';
    }

    if (pFormQty) pFormQty.addEventListener('input', calcFormAmount);
    if (pFormPrice) pFormPrice.addEventListener('input', calcFormAmount);

    function renderProductTable() {
        tbodyProducts.innerHTML = '';
        let subTotal = 0;
        currentProducts.forEach((p, index) => {
            const amount = p.qty * p.price;
            subTotal += amount;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-align: center;">${index + 1}</td>
                <td style="text-align: center;">${p.code || ''}</td>
                <td>${p.name}</td>
                <td style="text-align: center;">${p.unit}</td>
                <td style="text-align: right;">${p.qty}</td>
                <td style="text-align: right;">${p.price > 0 ? p.price.toLocaleString('vi-VN') : ''}</td>
                <td style="text-align: right;">${amount > 0 ? amount.toLocaleString('vi-VN') : ''}</td>
                <td>${p.note || ''}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn-action edit-prod" data-index="${index}" style="margin-right: 5px;" title="Sửa">✏️</button>
                    <button type="button" class="btn-remove-row" data-index="${index}" title="Xóa" style="padding: 2px 5px;">🗑️</button>
                </td>
            `;
            tbodyProducts.appendChild(tr);
        });

        // Event listeners for edit/delete
        document.querySelectorAll('.edit-prod').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                openProductForm(idx);
            });
        });
        document.querySelectorAll('.btn-remove-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                currentProducts.splice(idx, 1);
                renderProductTable();
            });
        });

        if (subAmountEl) subAmountEl.innerText = subTotal.toLocaleString('vi-VN');
        calcTotalAmount(subTotal);
    }

    function calcTotalAmount(subTotal) {
        if(subTotal === undefined) {
            subTotal = currentProducts.reduce((acc, p) => acc + (p.qty * p.price), 0);
        }
        const vat = parseFloat(vatInputEl ? vatInputEl.value : 0) || 0;
        const total = subTotal + vat;
        if (totalAmountEl) totalAmountEl.innerText = total.toLocaleString('vi-VN');
    }

    if (vatInputEl) {
        vatInputEl.addEventListener('input', () => calcTotalAmount());
    }

    function openProductForm(index = -1) {
        pFormIndex.value = index;
        if (index >= 0) {
            const p = currentProducts[index];
            pFormCode.value = p.code || '';
            pFormName.value = p.name || '';
            pFormUnit.value = p.unit || '';
            pFormQty.value = p.qty || '';
            pFormPrice.value = p.price || '';
            pFormNote.value = p.note || '';
        } else {
            pFormCode.value = '';
            pFormName.value = '';
            pFormUnit.value = '';
            pFormQty.value = '';
            pFormPrice.value = '';
            pFormNote.value = '';
        }
        calcFormAmount();
        productEditForm.style.display = 'block';
    }

    if(btnAddProduct) {
        btnAddProduct.addEventListener('click', () => openProductForm(-1));
    }

    if(btnCancelProduct) {
        btnCancelProduct.addEventListener('click', () => {
            productEditForm.style.display = 'none';
        });
    }

    if(btnSaveProduct) {
        btnSaveProduct.addEventListener('click', () => {
            if (!pFormName.value || !pFormUnit.value || !pFormQty.value) {
                alert('Vui lòng nhập Tên sản phẩm, ĐVT và Số lượng!');
                return;
            }
            const prod = {
                code: pFormCode.value,
                name: pFormName.value,
                unit: pFormUnit.value,
                qty: parseFloat(pFormQty.value) || 0,
                price: parseFloat(pFormPrice.value) || 0,
                amount: (parseFloat(pFormQty.value) || 0) * (parseFloat(pFormPrice.value) || 0),
                note: pFormNote.value
            };
            const idx = parseInt(pFormIndex.value);
            if (idx >= 0) {
                currentProducts[idx] = prod;
            } else {
                currentProducts.push(prod);
            }
            productEditForm.style.display = 'none';
            renderProductTable();
        });
    }

    if(btnAddRequest) {
        btnAddRequest.addEventListener('click', () => {
            currentProducts = [];
            if (vatInputEl) vatInputEl.value = '';
            renderProductTable();
            modalIntake.style.display = 'flex';
        });
    }

    const closeModal = () => {
        modalIntake.style.display = 'none';
        formIntake.reset();
        if (productEditForm) productEditForm.style.display = 'none';
    };

    btnCloseIntake.addEventListener('click', closeModal);
    btnCancelIntake.addEventListener('click', closeModal);

    formIntake.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('btn-submit-intake');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Đang lưu...';

        // Lấy thông tin form
        const donVi = document.getElementById('pyc-donvi').value;
        const boPhan = document.getElementById('pyc-bophan').value;
        const nhanSu = document.getElementById('pyc-nhansu').value;
        const chucVu = document.getElementById('pyc-chucvu').value;
        const tbp = document.getElementById('pyc-tbp').value;
        const ngayTn = document.getElementById('pyc-ngaytn').value;
        const ngayTraKq = document.getElementById('pyc-ngaytrakq').value;
        const mucDich = document.getElementById('pyc-mucdich').value;
        const ncc = document.getElementById('pyc-ncc').value;
        const nccMst = document.getElementById('pyc-ncc-mst').value;
        const nccLienHe = document.getElementById('pyc-ncc-lienhe').value;
        const nstmSelect = document.getElementById('pyc-nstm');
        const nstm = nstmSelect.options[nstmSelect.selectedIndex].text;
        const vat = parseFloat(vatInputEl ? vatInputEl.value : 0) || 0;
        
        // Auto-generate Mã PYC (PYC.NM.ddmmyy.STT)
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yy = String(today.getFullYear()).slice(-2);
        const randomStt = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0'); // Demo STT
        const code = `PYC.NM.${dd}${mm}${yy}.${randomStt}`;

        const createdDate = `${dd}/${mm}/20${yy}`;

        let totalAmount = currentProducts.reduce((acc, p) => acc + (p.qty * p.price), 0);
        totalAmount += vat;

        const newRequest = {
            'Mã PYC': code,
            'Ngày tạo': createdDate,
            'Đơn vị': donVi,
            'Bộ phận YC': boPhan,
            'Nhân sự YC': nhanSu,
            'Chức vụ': chucVu,
            'TBP': tbp,
            'Ngày tiếp nhận': ngayTn,
            'Ngày YC trả Kết quả': ngayTraKq,
            'Mục đích': mucDich,
            'Nhà cung cấp': ncc,
            'MST NCC': nccMst,
            'Liên hệ NCC': nccLienHe,
            'NSTM Phụ trách': nstm === '-- Chọn NSTM --' ? 'Chưa phân công' : nstm,
            'Trạng thái': 'Chờ Duyệt',
            'Tổng tiền dự kiến': totalAmount,
            'VAT': vat,
            'Sản phẩm': JSON.stringify(currentProducts)
        };

        try {
            // MOCK: Chúng ta push trực tiếp vào mảng requests cho UI local trước vì API thật chưa map đủ trường
            // Trong thực tế sẽ fetch post lên API nếu API được cập nhật
            requests.unshift(newRequest); 
            
            let localReqs = [];
            try {
                const stored = localStorage.getItem('localRequests');
                if (stored) localReqs = JSON.parse(stored);
            } catch(e) {}
            localReqs.unshift(newRequest);
            localStorage.setItem('localRequests', JSON.stringify(localReqs));
            
            // await fetch(API_URL, ... ) // Temporarily disabled real post to avoid error with new unmatched schema

            alert('Tạo Yêu cầu Thu mua thành công!');
            closeModal();
            renderIntakeTable();
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi lưu!');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Lưu & Gửi Duyệt';
        }
    });

    // --- Print Function ---
    function printRequest(req) {
        const updateDateEl = document.getElementById('print-update-date');
        if (updateDateEl) updateDateEl.innerText = req['Ngày tạo'] || '';
        
        const codeEl = document.getElementById('print-code');
        if (codeEl) codeEl.innerText = req['Mã PYC'] || '';
        
        const codeSubEl = document.getElementById('print-code-sub');
        if (codeSubEl) codeSubEl.innerText = req['Mã PYC'] || '';
        
        // Handle Print Date (Ngày ... tháng ... năm ...)
        const reqDateStr = req['Ngày tạo'] || '';
        if (reqDateStr.includes('/')) {
            const parts = reqDateStr.split('/');
            document.getElementById('print-day').innerText = parts[0];
            document.getElementById('print-month').innerText = parts[1];
            document.getElementById('print-year').innerText = parts[2];
        } else {
            const dateObj = new Date();
            document.getElementById('print-day').innerText = String(dateObj.getDate()).padStart(2, '0');
            document.getElementById('print-month').innerText = String(dateObj.getMonth() + 1).padStart(2, '0');
            document.getElementById('print-year').innerText = dateObj.getFullYear();
        }
        
        document.getElementById('print-company-name').innerText = (req['Đơn vị'] || 'CÔNG TY TNHH DEGO HOLDING').toUpperCase();
        
        document.getElementById('print-requester').innerText = req['Nhân sự YC'] || '';
        document.getElementById('print-role').innerText = req['Chức vụ'] || '';
        document.getElementById('print-dept').innerText = req['Bộ phận YC'] || '';
        document.getElementById('print-manager').innerText = req['TBP'] || '';
        
        document.getElementById('print-purpose').innerText = req['Mục đích'] || req['Nội dung yêu cầu'] || '';
        document.getElementById('print-deadline').innerText = req['Ngày YC trả Kết quả'] || '';
        
        // Chi tiết
        document.getElementById('print-content').innerText = req['Mục đích'] || req['Nội dung yêu cầu'] || '';

        // NCC
        const nccSection = document.getElementById('print-ncc-section');
        nccSection.style.display = 'block';
        document.getElementById('print-ncc').innerText = req['Nhà cung cấp'] || '';
        document.getElementById('print-ncc-mst').innerText = req['MST NCC'] || '';
        document.getElementById('print-ncc-lienhe').innerText = req['Liên hệ NCC'] || '';
        
        // Creator Name
        const printCreatorEl = document.getElementById('print-creator-name');
        if (printCreatorEl) printCreatorEl.innerText = req['Nhân sự YC'] || '';

        // Products
        const printItemsBody = document.getElementById('print-items-body');
        printItemsBody.innerHTML = '';
        let subTotal = 0;
        let products = [];
        try {
            if (req['Sản phẩm']) products = JSON.parse(req['Sản phẩm']);
        } catch(e) {}

        if (products.length > 0) {
            products.forEach((p, index) => {
                const amount = p.qty * p.price;
                const priceStr = p.price > 0 ? Number(p.price).toLocaleString('vi-VN') : '';
                const amountStr = amount > 0 ? Number(amount).toLocaleString('vi-VN') : '';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="text-align: center;">${index + 1}</td>
                    <td>${p.name}</td>
                    <td style="text-align: center;">${p.code || ''}</td>
                    <td style="text-align: center;">${p.unit || ''}</td>
                    <td style="text-align: center;">${p.qty || ''}</td>
                    <td style="text-align: right;">${priceStr}</td>
                    <td style="text-align: right;">${amountStr}</td>
                    <td>${p.note || ''}</td>
                `;
                printItemsBody.appendChild(tr);
                subTotal += amount;
            });
        }
        
        document.getElementById('print-sub-total').innerText = subTotal > 0 ? Number(subTotal).toLocaleString('vi-VN') : '';
        
        const vat = req['VAT'] || 0;
        document.getElementById('print-vat').innerText = vat > 0 ? Number(vat).toLocaleString('vi-VN') : '-';
        
        const total = subTotal + vat;
        document.getElementById('print-total').innerText = total > 0 ? Number(total).toLocaleString('vi-VN') : '';

        // Trigger Browser Print
        window.print();
    }

    // --- Survey Logic ---
    const surveys = [
        {
            code: 'PYC-002',
            item: 'Cồn y tế 90 độ',
            qty: '10 Lít',
            nstm: 'Mr Hậu',
            nccCount: 2,
            lab: 'Chờ kết quả'
        },
        {
            code: 'PYC-005',
            item: 'Bao bì hộp giấy Kraft 300gsm',
            qty: '2000 Hộp',
            nstm: 'Ms Quyên',
            nccCount: 0,
            lab: 'Không yêu cầu'
        }
    ];

    const surveyTbody = document.getElementById('survey-table-body');

    function renderSurveyTable() {
        surveyTbody.innerHTML = '';
        surveys.forEach(sur => {
            let nccBadgeClass = sur.nccCount >= 2 ? 'badge-status' : 'badge-admin';
            let labBadgeStyle = sur.lab === 'Chờ kết quả' ? 'background: #fef08a; color: #854d0e;' : '';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${sur.code}</strong></td>
                <td>${sur.item}</td>
                <td>${sur.qty}</td>
                <td>${sur.nstm}</td>
                <td><span class="badge ${nccBadgeClass}">${sur.nccCount} NCC</span></td>
                <td><span class="badge badge-admin" style="${labBadgeStyle}">${sur.lab}</span></td>
                <td class="text-right">
                    <div class="action-buttons">
                        <button class="btn-action btn-open-survey">Khảo sát</button>
                    </div>
                </td>
            `;
            surveyTbody.appendChild(tr);
        });

        // Add event listeners for the new buttons
        document.querySelectorAll('.btn-open-survey').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('modal-survey').style.display = 'flex';
            });
        });
    }

    renderSurveyTable();

    // Survey Modal Logic
    const modalSurvey = document.getElementById('modal-survey');
    const btnCloseSurvey = document.getElementById('btn-close-survey');
    const btnCancelSurvey = document.getElementById('btn-cancel-survey');

    const closeSurveyModal = () => {
        modalSurvey.style.display = 'none';
    };

    btnCloseSurvey.addEventListener('click', closeSurveyModal);
    btnCancelSurvey.addEventListener('click', closeSurveyModal);

    document.getElementById('btn-submit-survey').addEventListener('click', () => {
        alert('Đã trình QLTM duyệt báo giá!');
        closeSurveyModal();
    });

    // --- Suppliers Logic (MASTER_NCC) ---
    let suppliers = [];
    const supplierTbody = document.getElementById('supplier-table-body');

    async function loadSuppliers() {
        if (!supplierTbody) return;
        supplierTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Đang tải dữ liệu từ Google Sheets...</td></tr>';
        try {
            const res = await fetch(API_URL + '?action=getSuppliers');
            const result = await res.json();
            if (result.status === 'success') {
                suppliers = result.data || [];
                renderSupplierTable();
            } else {
                supplierTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Lỗi tải dữ liệu</td></tr>';
            }
        } catch (err) {
            console.error(err);
            supplierTbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Không thể kết nối đến Google Sheets</td></tr>';
        }
    }

    function renderSupplierTable() {
        supplierTbody.innerHTML = '';
        if (suppliers.length === 0) {
            supplierTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Chưa có Nhà cung cấp nào</td></tr>';
            return;
        }

        suppliers.forEach(sup => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${sup['Mã NCC'] || ''}</strong></td>
                <td>${sup['Tên NCC'] || ''}</td>
                <td><span class="badge badge-admin">${sup['Nhóm Hàng'] || ''}</span></td>
                <td>${sup['SĐT'] || ''}</td>
                <td>${sup['Email'] || ''}</td>
                <td class="text-right">
                    <div class="action-buttons">
                        <button class="btn-action">Sửa</button>
                    </div>
                </td>
            `;
            supplierTbody.appendChild(tr);
        });
    }

    // Load suppliers when script starts
    loadSuppliers();

    // Supplier Modal Logic
    const modalSupplier = document.getElementById('modal-supplier');
    const btnAddSupplier = document.getElementById('btn-add-supplier');
    const btnCloseSupplier = document.getElementById('btn-close-supplier');
    const btnCancelSupplier = document.getElementById('btn-cancel-supplier');
    const formSupplier = document.getElementById('form-supplier');

    if (btnAddSupplier) {
        btnAddSupplier.addEventListener('click', () => {
            modalSupplier.style.display = 'flex';
        });
    }

    const closeSupplierModal = () => {
        modalSupplier.style.display = 'none';
        formSupplier.reset();
    };

    if (btnCloseSupplier) btnCloseSupplier.addEventListener('click', closeSupplierModal);
    if (btnCancelSupplier) btnCancelSupplier.addEventListener('click', closeSupplierModal);

    if (formSupplier) {
        formSupplier.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('btn-submit-supplier');
            submitBtn.disabled = true;
            submitBtn.innerText = 'Đang lưu...';

            const inputs = formSupplier.querySelectorAll('input, select');
            const nccName = inputs[0].value;
            const phone = inputs[1].value;
            const email = inputs[2].value;
            const category = inputs[3].value;
            
            // Auto-generate Mã NCC
            const nccCode = 'NCC-' + Math.floor(Date.now() / 1000).toString().slice(-4);

            const newSupplier = {
                nccCode: nccCode,
                nccName: nccName,
                phone: phone,
                email: email,
                category: category
            };

            try {
                await fetch(API_URL, {
                    method: 'POST',
                    body: JSON.stringify({
                        action: 'createSupplier',
                        data: newSupplier
                    }),
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
                });

                alert('Tạo Nhà cung cấp thành công!');
                closeSupplierModal();
                loadSuppliers();
            } catch (err) {
                console.error(err);
                alert('Có lỗi xảy ra khi lưu lên Google Sheets!');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Lưu Nhà cung cấp';
            }
        });
    }

    // --- Tab Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pages = document.querySelectorAll('.page-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetPage = item.getAttribute('data-page');
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            // Hide all pages
            pages.forEach(page => page.style.display = 'none');
            // Show target page
            const pageEl = document.getElementById(targetPage);
            if (pageEl) {
                pageEl.style.display = 'block';
            }
        });
    });

    // --- Sidebar Resizer & Toggle Logic ---
    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('sidebar-resizer');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const root = document.documentElement;
    
    // Load saved width from localStorage
    const savedWidth = localStorage.getItem('thu_mua_sidebar_width');
    if (savedWidth) {
        root.style.setProperty('--sidebar-width', `${savedWidth}px`);
    }
    
    let isResizing = false;
    
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        resizer.classList.add('is-resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none'; // Prevent text selection
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        let newWidth = e.clientX;
        // Set min and max width bounds
        if (newWidth < 200) newWidth = 200;
        if (newWidth > 600) newWidth = 600;
        
        root.style.setProperty('--sidebar-width', `${newWidth}px`);
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove('is-resizing');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            
            // Save to localStorage
            const currentWidth = getComputedStyle(root).getPropertyValue('--sidebar-width').replace('px', '');
            localStorage.setItem('thu_mua_sidebar_width', currentWidth);
        }
    });

    // Toggle Sidebar
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
        });
    }
});
