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

    // --- Intake Logic ---
    let requests = [];
    const intakeTbody = document.getElementById('intake-table-body');

    async function loadRequests() {
        intakeTbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Đang tải dữ liệu từ Google Sheets...</td></tr>';
        try {
            const res = await fetch(API_URL + '?action=getRequests');
            const result = await res.json();
            if (result.status === 'success') {
                requests = result.data || [];
                renderIntakeTable();
            } else {
                intakeTbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Lỗi tải dữ liệu</td></tr>';
            }
        } catch (err) {
            console.error(err);
            intakeTbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Không thể kết nối đến Google Sheets</td></tr>';
        }
    }

    function renderIntakeTable() {
        intakeTbody.innerHTML = '';
        if (requests.length === 0) {
            intakeTbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Chưa có yêu cầu nào</td></tr>';
            return;
        }

        requests.forEach(req => {
            let statusBadgeClass = 'badge-admin'; // Default gray
            // Cột trả về từ Sheet sẽ map với tiêu đề: req['Trạng thái'], req['Mã PYC'],...
            const status = req['Trạng thái'] || 'Chờ Duyệt';
            if (status === 'Đang Xử Lý') statusBadgeClass = 'badge-status';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${req['Mã PYC'] || ''}</strong></td>
                <td>${req['Ngày tạo'] || ''}</td>
                <td>${req['Bộ phận YC'] || ''}</td>
                <td>${req['Nội dung yêu cầu'] || ''}</td>
                <td>${req['Số lượng'] || ''}</td>
                <td>${req['NSTM Phụ trách'] || ''}</td>
                <td><span class="badge ${statusBadgeClass}">${status}</span></td>
                <td class="text-right">
                    <div class="action-buttons">
                        <button class="btn-action">Xem</button>
                    </div>
                </td>
            `;
            intakeTbody.appendChild(tr);
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

    btnAddRequest.addEventListener('click', () => {
        modalIntake.style.display = 'flex';
    });

    const closeModal = () => {
        modalIntake.style.display = 'none';
        formIntake.reset();
    };

    btnCloseIntake.addEventListener('click', closeModal);
    btnCancelIntake.addEventListener('click', closeModal);

    formIntake.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button during submit
        const submitBtn = document.getElementById('btn-submit-intake');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Đang lưu...';

        // Lấy dữ liệu từ form
        const inputs = formIntake.querySelectorAll('input, select, textarea');
        const dept = inputs[0].value;
        const content = inputs[1].value;
        const qty = inputs[2].value + ' ' + inputs[3].value; // Số lượng + Đơn vị
        const dateStr = inputs[4].value; // Ngày cần
        const nstm = inputs[6].options[inputs[6].selectedIndex].text; // Tên NSTM
        
        // Auto-generate Mã PYC (PYC- + Timestamp)
        const code = 'PYC-' + Math.floor(Date.now() / 1000).toString().slice(-4);
        
        // Ngày tạo
        const today = new Date();
        const createdDate = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

        const newRequest = {
            code: code,
            date: createdDate,
            dept: dept,
            content: content,
            qty: qty,
            nstm: nstm === '-- Chọn NSTM --' ? 'Chưa phân công' : nstm,
            status: 'Chờ Duyệt'
        };

        try {
            // Post data to Google Apps Script
            await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'createRequest',
                    data: newRequest
                }),
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8' // Bypasses complex CORS preflight
                }
            });

            alert('Tạo Yêu cầu Thu mua thành công!');
            closeModal();
            // Tải lại danh sách từ Sheet
            loadRequests();
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi lưu lên Google Sheets!');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Lưu & Gửi Duyệt';
        }
    });

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
