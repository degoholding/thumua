document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Logic (Google Sign-In) ---
    const loginOverlay = document.getElementById('login-overlay');
    const appLayout = document.getElementById('app-layout');
    const btnLogoutGoogle = document.getElementById('btn-logout-google');
    const userNameDisplay = document.getElementById('user-name-display');
    const userAvatar = document.getElementById('user-avatar');

    let currentUser = JSON.parse(localStorage.getItem('thu_mua_currentUser'));
    let nhanSuData = JSON.parse(localStorage.getItem('nhanSuData')) || [];

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    window.handleCredentialResponse = (response) => {
        const payload = parseJwt(response.credential);
        if (payload && payload.email) {
            checkAndLogin(payload.email, payload.name, payload.picture);
        }
    };

    function checkAndLogin(email, name, picture, isInternal = false) {
        // Internal Admin Login logic
        if (isInternal) {
            if (email === 'administrator') {
                currentUser = {
                    email: 'administrator',
                    name: 'Quản trị viên',
                    picture: '',
                    dept: 'Admin',
                    manager: 'Admin',
                    phone: '',
                    role: 'ROLE_ADMIN'
                };
                localStorage.setItem('thu_mua_currentUser', JSON.stringify(currentUser));
                showApp();
                return;
            }
        }

        // Google Login logic
        const nhanSu = nhanSuData.find(ns => ns.email && ns.email.toLowerCase() === email.toLowerCase());
        
        let role = 'ROLE_USER';
        let matchedName = name;
        let matchedDept = '';
        let matchedManager = '';
        let matchedPhone = '';

        if (email.toLowerCase() === 'pltgiang.degoholding@gmail.com') {
            role = 'ROLE_ADMIN';
        } else if (email.toLowerCase() === 'pkngan.idagroup@gmail.com') {
            role = 'ROLE_PROCUREMENT_APPROVER';
        } else if (nhanSuData.some(ns => ns.manager === (nhanSu ? nhanSu.name : name))) {
            role = 'ROLE_DEPT_APPROVER';
        }

        if (nhanSu) {
            matchedName = nhanSu.name;
            matchedDept = nhanSu.dept;
            matchedManager = nhanSu.manager;
            matchedPhone = nhanSu.phone;
        } else {
            // For admin accounts that might not be in nhanSuData
            if (role === 'ROLE_USER') {
                alert(`Email ${email} chưa được cấp quyền (Không tìm thấy trong bảng Nhân sự). Vui lòng liên hệ Admin.`);
                return;
            }
        }

        currentUser = {
            email: email,
            name: matchedName,
            picture: picture,
            dept: matchedDept,
            manager: matchedManager,
            phone: matchedPhone,
            role: role
        };
        localStorage.setItem('thu_mua_currentUser', JSON.stringify(currentUser));
        showApp();
    }

    // Internal Login Event
    const btnInternalLogin = document.getElementById('btn-internal-login');
    if (btnInternalLogin) {
        btnInternalLogin.addEventListener('click', () => {
            const userVal = document.getElementById('internal-username').value.trim().toLowerCase();
            const passVal = document.getElementById('internal-password').value;
            if (userVal === 'administrator' && passVal === 'dego@123') {
                checkAndLogin(userVal, 'Quản trị viên', '', true);
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        });
    }

    function showApp() {
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (appLayout) appLayout.style.display = 'flex';
        
        if (userNameDisplay) userNameDisplay.innerText = currentUser.name;
        if (userAvatar && currentUser.picture) {
            userAvatar.src = currentUser.picture;
            userAvatar.style.display = 'block';
        }

        // Apply RBAC UI Rules
        const navSurvey = document.getElementById('nav-survey');
        const navApprove = document.getElementById('nav-approve');
        const navAdmin = document.getElementById('nav-group-admin');
        const navMuahang = document.getElementById('nav-group-muahang');

        // Reset visibility
        if(navSurvey) navSurvey.style.display = 'none';
        if(navApprove) navApprove.style.display = 'none';
        if(navAdmin) navAdmin.style.display = 'none';
        if(navMuahang) navMuahang.style.display = 'none';

        if (currentUser.role === 'ROLE_ADMIN') {
            if(navSurvey) navSurvey.style.display = 'flex';
            if(navApprove) navApprove.style.display = 'flex';
            if(navAdmin) navAdmin.style.display = 'block';
            if(navMuahang) navMuahang.style.display = 'block';
        } else if (currentUser.role === 'ROLE_PROCUREMENT_APPROVER') {
            if(navSurvey) navSurvey.style.display = 'flex';
            if(navApprove) navApprove.style.display = 'flex';
        } else if (currentUser.role === 'ROLE_DEPT_APPROVER') {
            if(navApprove) navApprove.style.display = 'flex';
        }
    }

    if (currentUser) {
        showApp();
    } else {
        // Render Google Login Button
        const CLIENT_ID = '692103387453-062rkmq1cinfhqerd9hn6bj3omfq18h8.apps.googleusercontent.com';
        
        if (window.google) {
            google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: handleCredentialResponse
            });
            google.accounts.id.renderButton(
                document.getElementById("google-login-button"),
                { theme: "outline", size: "large", width: "250" }
            );
        }
    }

    if (btnLogoutGoogle) {
        btnLogoutGoogle.addEventListener('click', () => {
            localStorage.removeItem('thu_mua_currentUser');
            location.reload();
        });
    }

    // Deleted users array logic.

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
        
        let filteredRequests = requests;
        if (currentUser.role === 'ROLE_USER') {
            filteredRequests = requests.filter(req => req['Người yêu cầu'] === currentUser.name);
        } else if (currentUser.role === 'ROLE_DEPT_APPROVER') {
            // Lấy danh sách các phòng ban mà người này làm Trưởng bộ phận
            const managedDepts = nhanSuData.filter(ns => ns.manager === currentUser.name).map(ns => ns.dept);
            filteredRequests = requests.filter(req => req['Người yêu cầu'] === currentUser.name || managedDepts.includes(req['Bộ phận YC']));
        }
        
        if (filteredRequests.length === 0) {
            intakeTbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Chưa có yêu cầu nào</td></tr>';
            return;
        }

        filteredRequests.forEach((req) => {
            const index = requests.indexOf(req);
            let statusBadgeClass = 'badge-admin'; // Default gray
            const status = req['Trạng thái'] || 'Chờ Duyệt';
            if (status === 'Đang Xử Lý') statusBadgeClass = 'badge-status';
            else if (status === 'TBP Đã Duyệt') statusBadgeClass = 'badge-status'; // green

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
                <td><span class="badge ${statusBadgeClass}">${status}</span></td>
                <td class="text-right">
                    <div class="action-buttons" style="display: flex; gap: 5px; justify-content: flex-end;">
                        <button class="btn-action btn-view" data-index="${index}" style="color: #0d6efd; background: rgba(13,110,253,0.1); border: 1px solid #0d6efd; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-weight: 500;">Xem</button>
                        <button class="btn-action btn-print" data-index="${index}" style="color: #495057; background: rgba(73,80,87,0.1); border: 1px solid #495057; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-weight: 500;">In</button>
                    </div>
                </td>
            `;
            intakeTbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-print').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reqIndex = e.currentTarget.getAttribute('data-index');
                printRequest(requests[reqIndex]);
            });
        });

        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reqIndex = e.currentTarget.getAttribute('data-index');
                const req = requests[reqIndex];
                
                document.getElementById('intake-index').value = reqIndex;
                populateIntakeOptions();
                
                document.getElementById('pyc-code').value = req['Mã PYC'] || '';
                if(document.getElementById('pyc-show-code')) document.getElementById('pyc-show-code').checked = req['Hiển thị Mã'] !== false;
                
                document.getElementById('pyc-donvi').value = req['Đơn vị'] || '';
                $('#pyc-donvi').trigger('change');
                document.getElementById('pyc-nhansu').value = req['Nhân sự YC'] || '';
                $('#pyc-nhansu').trigger('change');
                document.getElementById('pyc-nhansu').disabled = true; // Giữ thông tin nhân sự YC (Khóa không cho sửa)
                
                setTimeout(() => {
                    document.getElementById('pyc-chucvu').value = req['Chức vụ'] || '';
                }, 100);
                
                document.getElementById('pyc-ngaytn').value = req['Ngày tiếp nhận'] || '';
                document.getElementById('pyc-ngaytrakq').value = req['Ngày YC trả Kết quả'] || '';
                document.getElementById('pyc-mucdich').value = req['Mục đích'] || '';
                if(document.getElementById('pyc-noidung')) document.getElementById('pyc-noidung').value = req['Nội dung mua hàng'] || '';
                
                document.getElementById('pyc-ncc').value = req['Nhà cung cấp'] || '';
                $('#pyc-ncc').trigger('change');
                document.getElementById('pyc-ncc-mst').value = req['MST NCC'] || '';
                document.getElementById('pyc-ncc-lienhe').value = req['Liên hệ NCC'] || '';
                
                currentProducts = req['Sản phẩm'] ? JSON.parse(req['Sản phẩm']) : [];
                renderProductTable();
                
                const status = req['Trạng thái'] || 'Chờ Duyệt';
                const isApproved = status !== 'Chờ Duyệt';
                document.getElementById('btn-submit-intake').style.display = isApproved ? 'none' : 'block';
                
                const canApprove = (currentUser.role === 'ROLE_DEPT_APPROVER' || currentUser.role === 'ROLE_ADMIN') && status === 'Chờ Duyệt';
                if(document.getElementById('modal-intake-approve-actions')) {
                    document.getElementById('modal-intake-approve-actions').style.display = canApprove ? 'flex' : 'none';
                }
                
                modalIntake.style.display = 'flex';
                document.body.style.overflow = 'hidden';
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
                <td style="text-align: center; white-space: nowrap; min-width: 100px;">
                    <button type="button" class="btn-remove-row clone-prod" data-index="${index}" style="margin-right: 5px; color: var(--primary-color); border-color: var(--primary-color);" title="Nhân bản">📄</button>
                    <button type="button" class="btn-remove-row edit-prod" data-index="${index}" style="margin-right: 5px; color: var(--primary-color); border-color: var(--primary-color);" title="Sửa">✏️</button>
                    <button type="button" class="btn-remove-row del-prod" data-index="${index}" title="Xóa">🗑️</button>
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
        document.querySelectorAll('.clone-prod').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                const p = currentProducts[idx];
                currentProducts.push({ ...p });
                renderProductTable();
            });
        });
        document.querySelectorAll('.del-prod').forEach(btn => {
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

    function populateIntakeOptions() {
        const donViSelect = document.getElementById('pyc-donvi');
        if (donViSelect) {
            donViSelect.innerHTML = '<option value="">-- Chọn Công ty --</option>';
            donViData.forEach(d => { donViSelect.innerHTML += `<option value="${d.shortName}">${d.fullName}</option>`; });
        }

        const nhanSuSelect = document.getElementById('pyc-nhansu');
        if (nhanSuSelect) {
            nhanSuSelect.innerHTML = '<option value="">-- Chọn Nhân sự --</option>';
            nhanSuData.forEach(n => { nhanSuSelect.innerHTML += `<option value="${n.name}">${n.name}</option>`; });
        }

        const nccSelect = document.getElementById('pyc-ncc');
        if (nccSelect) {
            nccSelect.innerHTML = '<option value="">-- Chọn hoặc nhập tên NCC --</option>';
            nccData.forEach(n => { nccSelect.innerHTML += `<option value="${n.name}">${n.name}</option>`; });
        }
        
        try {
            $('#modal-intake select.form-control').not('#pyc-ncc').select2('destroy');
            if ($('#pyc-ncc').length) $('#pyc-ncc').select2('destroy');
        } catch(e) {}
        
        $('#modal-intake select.form-control').not('#pyc-ncc').select2({ width: '100%', dropdownParent: $('#modal-intake') });
        if ($('#pyc-ncc').length) {
            $('#pyc-ncc').select2({ width: '100%', dropdownParent: $('#modal-intake'), tags: true });
        }
    }

    if(btnAddRequest) {
        btnAddRequest.addEventListener('click', () => {
            formIntake.reset();
            document.getElementById('intake-index').value = "-1";
            document.getElementById('btn-submit-intake').style.display = 'block';
            currentProducts = [];
            if (vatInputEl) vatInputEl.value = '';
            
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yy = String(today.getFullYear()).slice(-2);
            const randomStt = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
            document.getElementById('pyc-code').value = `PYC.NM.${dd}${mm}${yy}.${randomStt}`;
            
            const dateStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            document.getElementById('pyc-ngaytn').value = dateStr;
            
            // Populate select options
            populateIntakeOptions();
            
            renderProductTable();
            modalIntake.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // --- AUTO FILL NHÂN SỰ ---
            if (currentUser && currentUser.name) {
                $('#pyc-nhansu').val(currentUser.name).trigger('change');
                document.getElementById('pyc-nhansu').disabled = true; // Khóa trường chọn
            }
        });

        $('#pyc-nhansu').on('change', (e) => {
            const selectedName = e.target.value;
            const ns = nhanSuData.find(x => x.name === selectedName);
            if (ns) {
                document.getElementById('pyc-bophan').value = ns.dept || '';
                document.getElementById('pyc-tbp').value = ns.manager || '';
            } else {
                document.getElementById('pyc-bophan').value = '';
                document.getElementById('pyc-tbp').value = '';
            }
        });
    }

    const closeModal = () => {
        modalIntake.style.display = 'none';
        document.body.style.overflow = 'auto';
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
        const nstm = nstmSelect.options[nstmSelect.selectedIndex] ? nstmSelect.options[nstmSelect.selectedIndex].text : '';
        const vat = parseFloat(vatInputEl ? vatInputEl.value : 0) || 0;
        
        const codeInput = document.getElementById('pyc-code').value;
        const showCode = document.getElementById('pyc-show-code') ? document.getElementById('pyc-show-code').checked : true;

        // Auto-generate Mã PYC (PYC.NM.ddmmyy.STT)
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yy = String(today.getFullYear()).slice(-2);
        const randomStt = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0'); // Demo STT
        const code = codeInput ? codeInput : `PYC.NM.${dd}${mm}${yy}.${randomStt}`;

        const createdDate = `${dd}/${mm}/20${yy}`;

        const donViObj = donViData.find(d => d.shortName === donVi);
        const fullDonViName = donViObj ? donViObj.fullName : donVi;

        let totalAmount = currentProducts.reduce((acc, p) => acc + (p.qty * p.price), 0);
        totalAmount += vat;

        const attachmentFiles = document.getElementById('pyc-attachment').files;
        const hasAttachment = attachmentFiles && attachmentFiles.length > 0;

        const editIdx = parseInt(document.getElementById('intake-index').value, 10);
        const oldStatus = editIdx > -1 ? requests[editIdx]['Trạng thái'] : 'Chờ Duyệt';

        const newRequest = {
            'Mã PYC': code,
            'Hiển thị Mã': showCode,
            'Ngày tạo': createdDate,
            'Đơn vị': donVi,
            'Tên Đầy Đủ CTY': fullDonViName,
            'Bộ phận YC': boPhan,
            'Nhân sự YC': nhanSu,
            'Chức vụ': chucVu,
            'TBP': tbp,
            'Ngày tiếp nhận': ngayTn,
            'Ngày YC trả Kết quả': ngayTraKq,
            'Mục đích': mucDich,
            'Nội dung mua hàng': document.getElementById('pyc-noidung') ? document.getElementById('pyc-noidung').value : '',
            'Có đính kèm': hasAttachment,
            'Nhà cung cấp': ncc,
            'MST NCC': nccMst,
            'Liên hệ NCC': nccLienHe,
            'NSTM Phụ trách': nstm === '-- Chọn NSTM --' || !nstm ? 'Chưa phân công' : nstm,
            'Trạng thái': oldStatus,
            'Tổng tiền dự kiến': totalAmount,
            'VAT': vat,
            'Sản phẩm': JSON.stringify(currentProducts)
        };

        try {
            if (editIdx > -1) {
                // Update
                const oldReq = requests[editIdx];
                Object.assign(oldReq, newRequest);
                
                let localReqs = [];
                const stored = localStorage.getItem('localRequests');
                if (stored) localReqs = JSON.parse(stored);
                const localIdx = localReqs.findIndex(r => r['Mã PYC'] === oldReq['Mã PYC']);
                if (localIdx > -1) {
                    Object.assign(localReqs[localIdx], newRequest);
                } else {
                    localReqs.unshift(oldReq);
                }
                localStorage.setItem('localRequests', JSON.stringify(localReqs));
                alert('Cập nhật Yêu cầu Thu mua thành công!');
            } else {
                // Create
                requests.unshift(newRequest); 
                
                let localReqs = [];
                try {
                    const stored = localStorage.getItem('localRequests');
                    if (stored) localReqs = JSON.parse(stored);
                } catch(e) {}
                localReqs.unshift(newRequest);
                localStorage.setItem('localRequests', JSON.stringify(localReqs));
                alert('Tạo Yêu cầu Thu mua thành công!');
            }
            
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
    
    // Modal action listeners for Approve/Reject
    const btnModalApprove = document.getElementById('btn-modal-approve');
    const btnModalReject = document.getElementById('btn-modal-reject');

    if (btnModalApprove) {
        btnModalApprove.addEventListener('click', () => {
            if(!confirm('Bạn có chắc chắn phê duyệt yêu cầu này?')) return;
            const reqIndex = parseInt(document.getElementById('intake-index').value, 10);
            if(reqIndex > -1) {
                requests[reqIndex]['Trạng thái'] = 'TBP Đã Duyệt';
                let localReqs = [];
                const stored = localStorage.getItem('localRequests');
                if (stored) localReqs = JSON.parse(stored);
                const localIdx = localReqs.findIndex(r => r['Mã PYC'] === requests[reqIndex]['Mã PYC']);
                if (localIdx > -1) {
                    localReqs[localIdx]['Trạng thái'] = 'TBP Đã Duyệt';
                    localStorage.setItem('localRequests', JSON.stringify(localReqs));
                }
                renderIntakeTable();
                closeModal();
                alert('Đã phê duyệt yêu cầu!');
            }
        });
    }

    if (btnModalReject) {
        btnModalReject.addEventListener('click', () => {
            if(!confirm('Bạn có chắc chắn muốn hủy yêu cầu này?')) return;
            const reqIndex = parseInt(document.getElementById('intake-index').value, 10);
            if(reqIndex > -1) {
                requests[reqIndex]['Trạng thái'] = 'Đã Hủy';
                let localReqs = [];
                const stored = localStorage.getItem('localRequests');
                if (stored) localReqs = JSON.parse(stored);
                const localIdx = localReqs.findIndex(r => r['Mã PYC'] === requests[reqIndex]['Mã PYC']);
                if (localIdx > -1) {
                    localReqs[localIdx]['Trạng thái'] = 'Đã Hủy';
                    localStorage.setItem('localRequests', JSON.stringify(localReqs));
                }
                renderIntakeTable();
                closeModal();
                alert('Đã hủy yêu cầu!');
            }
        });
    }

    // --- DATA CHUNG (Cấu hình) ---
    let donViData = JSON.parse(localStorage.getItem('donViData')) || [];
    if (donViData.length <= 1) {
        donViData = [
            { shortName: 'DEGO HOLDING', fullName: 'CÔNG TY TNHH DEGO HOLDING', address: 'B19 đường dẫn cầu Cần Thơ, QL1A, Khu dân cư Trung tâm văn hóa Tây Đô, Phường Cái Răng, Thành phố Cần Thơ, Việt Nam.', mst: '1801722464' },
            { shortName: 'IDA GLOBAL', fullName: 'CÔNG TY TNHH XUẤT NHẬP KHẨU IDA GLOBAL', address: '68 Nguyễn Huệ, Phường Sài Gòn, Thành phố Hồ Chí Minh, Việt Nam', mst: '0314562909' },
            { shortName: 'HÓA CHẤT ABA', fullName: 'CÔNG TY TNHH SẢN XUẤT HÓA CHẤT ABA', address: '108 Trần Đình Xu, Phường Cầu Ông Lãnh, Thành phố Hồ Chí Minh, Việt Nam', mst: '0316342296' },
            { shortName: 'DƯỢC PHẨM ICARE', fullName: 'CÔNG TY TNHH DƯỢC PHẨM ICARE', address: '108 Trần Đình Xu, Phường Cầu Ông Lãnh, Thành phố Hồ Chí Minh, Việt Nam', mst: '0315593265' },
            { shortName: 'NPP DR XANH', fullName: 'NHÀ PHÂN PHỐI DR XANH', address: 'Số 124, Đường Võ Văn Kiệt, khu vực Bình Trung, Phường Long Hòa, Quận Bình Thủy, TP.Cần Thơ', mst: '57B8010406' },
            { shortName: 'HKD DR XANH', fullName: 'HỘ KINH DOANH DR XANH', address: 'Ấp Qui Lân 1, Xã Thạnh Quới, Huyện Vĩnh Thạnh, TP Cần Thơ, Việt Nam', mst: '57H8005750' },
            { shortName: 'BAMBOO VIỆT NAM', fullName: 'CÔNG TY TNHH XUẤT NHẬP KHẨU SẢN XUẤT THƯƠNG MẠI BAMBOO VIỆT NAM', address: 'Tầng 18, Tòa nhà ROX Tower, 180-192 Nguyễn Công Trứ, Phường Bến Thành, Thành phó Hồ Chí Minh, Việt Nam.', mst: '0318629897' },
            { shortName: 'N2SBIO VIỆT NAM', fullName: 'CÔNG TY TNHH N2SBIO VIỆT NAM', address: '108 Trần Đình Xu, Phường Nguyễn Cư Trinh, Quận 1, TP Hồ Chí Minh', mst: '0318776965' },
            { shortName: 'HCNN DEGO', fullName: 'CÔNG TY TNHH SẢN XUẤT VÀ XUẤT NHẬP KHẨU HOÁ CHẤT NÔNG NGHIỆP DEGO', address: 'Tầng 9, tòa nhà K&M Tower, 33 Ung Văn Khiêm, Phường Thạnh Mỹ Tây, TP Hồ Chí Minh, Việt Nam', mst: '0318430011' },
            { shortName: 'HCNN ABA', fullName: 'CÔNG TY TNHH HÓA CHẤT NÔNG NGHIỆP ABA', address: 'B18 đường dẫn cầu Cần Thơ, QL1A, Khu dân cư Trung tâm văn hóa Tây Đô, Phường Cái Răng, Thành phố Cần Thơ, Việt Nam.', mst: '1801818328' }
        ];
        localStorage.setItem('donViData', JSON.stringify(donViData));
        // nhanSuData was hoisted.
    }
    nhanSuData = JSON.parse(localStorage.getItem('nhanSuData')) || [];
    
    let departmentsData = JSON.parse(localStorage.getItem('departmentsData'));
    if (!departmentsData || departmentsData.length === 0) {
        let deptsMap = {};
        nhanSuData.forEach(ns => {
            if (ns.dept) {
                const key = ns.dept + "_" + ns.manager;
                if (!deptsMap[key]) {
                    const managerObj = nhanSuData.find(m => m.name === ns.manager);
                    deptsMap[key] = { dept: ns.dept, manager: ns.manager, email: managerObj ? managerObj.email : '' };
                }
            }
        });
        departmentsData = Object.values(deptsMap);
        localStorage.setItem('departmentsData', JSON.stringify(departmentsData));
    }

    // Tự động focus vào ô tìm kiếm khi mở Select2
    $(document).on('select2:open', () => {
        setTimeout(() => {
            const searchField = document.querySelector('.select2-search__field');
            if (searchField) searchField.focus();
        }, 50);
    });

    let nccData = JSON.parse(localStorage.getItem('nccData'));
    if (!nccData || nccData.length === 0) {
        nccData = [
        {
                "name": "CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI BAO BÌ CẨM HÙNG",
                "address": "số 37, đường B11, KDC 91B, Phường Tân An, Thành phố Cần Thơ, Việt Nam",
                "mst": "1801778241"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT BAO BÌ ĐÔNG TÂY",
                "address": "0827/3 Đường Võ Thị Thừa, Khu phố 3, Phường An Phú Đông, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0316254811"
        },
        {
                "name": "CÔNG TY TNHH QUẢNG CÁO MỘC ẤN",
                "address": "368/12 Đường TTH21, Khu phố 3, Phường Tân Thới Hiệp, Quận 12, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0312214688"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT- THƯƠNG MẠI- DỊCH VỤ TÂN ĐỨC",
                "address": "108/8 Đường số 11, Khu phố 5, Phường Linh Xuân, Thành phố Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0301909568"
        },
        {
                "name": "CÔNG TY TRÁCH NHIỆM HỮU HẠN MỘT THÀNH VIÊN HỢP TRÍ THÀNH CÔNG",
                "address": "98, đường 3/2, Phường Xuân Khánh, Quận Ninh Kiều, Thành phố Cần Thơ, Việt Nam",
                "mst": "1801356017"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT - THƯƠNG MẠI AN TÍN",
                "address": "247/16 Đường Bình Tiên, Phường 08, Quận 6, Thành Phố Hồ Chí Minh, Việt Nam",
                "mst": "0315259038"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI NHỰA CƯỜNG PHÁT LONG AN",
                "address": "Ấp Hóc Thơm 1, Xã Hòa Khánh, Tỉnh Tây Ninh, Việt Nam",
                "mst": "1101721810"
        },
        {
                "name": "CÔNG TY TNHH BAO BÌ HNS",
                "address": "084 QL1, KV2, Ba Láng, Cái Răng, Cần Thơ",
                "mst": "1801399719"
        },
        {
                "name": "CÔNG TY TNHH MTV SẢN XUẤT THƯƠNG MẠI NHỰA HỒ GIA",
                "address": "100/7B khu phố 1, Bùi Dương Lịch, Phường Bình Hưng Hòa B, Quận Bình Tân, Thành phố Hồ Chí Minh",
                "mst": "0315743256"
        },
        {
                "name": "CÔNG TY TNHH BAO BÌ MINH NGỌC",
                "address": "Lô D2.1 - D2.2 Đường số 4, KCN Nhị Xuân, Xã Xuân Thới Sơn, Huyện Hóc Môn, Tp. HCM",
                "mst": "0313694927"
        },
        {
                "name": "CÔNG TY TNHH SX TM DV QUỐC TẾ QUANG ĐẠT",
                "address": "43D, Ao Đôi, P. Bình Trị Đông A, Q. Bình Tân, TP. HCM",
                "mst": "0317703989"
        },
        {
                "name": "CÔNG TY CỔ PHẦN BAO BÌ NHỰA THÀNH PHÁT",
                "address": "F01-1, đường số 1, KCN Hạnh Phúc, ấp 5 Đức Hoà Đông, ĐH, LA",
                "mst": "0302299160"
        },
        {
                "name": "CÔNG TY TNHH BAO BÌ NHỰA PHƯƠNG NAM",
                "address": "384A, Tổ 3, Ấp 1, Xã Mỹ Hạnh, Tỉnh Tây Ninh, Việt Nam",
                "mst": "0301515210"
        },
        {
                "name": "CÔNG TY CỔ PHẦN PHL",
                "address": "Lô MB1-1, Lô MB1-1a, khu công nghiệp Đức Hòa 1, Đường số 5, Ấp 5, Xã Đức Hòa Đông, Huyện Đức Hoà, Tỉnh Long An, Việt Nam",
                "mst": "1101392309"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT BAO BÌ VINACO",
                "address": "Lô B10, Đường số 1, KCN Hải Sơn (GĐ 3+4), Xã Đức Hòa Hạ, Huyện Đức Hòa, tỉnh Long An",
                "mst": "1101950715"
        },
        {
                "name": "CÔNG TY TNHH SX TM DV HẢI BÌNH",
                "address": "30 Võ Hoành, Phường Phú Thọ Hoà, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0302202299"
        },
        {
                "name": "CÔNG TY CP HÓA CHẤT MIỀN NAM",
                "address": "137B -137C, Trần Hưng Đạo, Phường An Phú, Quận Ninh Kiều, Thành phố Cần Thơ",
                "mst": "1800662621"
        },
        {
                "name": "CÔNG TY CP QUÔC TẾ TM GROW",
                "address": "Trung tâm dịch vụ khu công nghiệp Amata, đường Amata, KCN Amata, Phường Long Bình, Thành phố Biên Hoà, Tỉnh Đồng Nai",
                "mst": "3600630513"
        },
        {
                "name": "CÔNG TY CP ĐẮC KHANG",
                "address": "482/10/28A1 Nơ Trang Long, Phường 13, Quận Bình Thạnh, Thành phố Hồ Chí Minh",
                "mst": "0304714687"
        },
        {
                "name": "CÔNG TY TNHH SX TM DV PHÁT ĐẠI LỘC",
                "address": "Số 24 Đường Hiệp Thành 48, Phường Hiệp Thành, Quận 12, Thành phố Hồ Chí Minh",
                "mst": "0317409056"
        },
        {
                "name": "CÔNG TY TNHH THƯƠNG MẠI HIỀN PHAN",
                "address": "Số 64 Lê Lăng, Phường Phú Thọ Hoà, Quận Tân Phú, Thành phố Hồ Chí Minh",
                "mst": "0305877109"
        },
        {
                "name": "CÔNG TY TNHH XNK HÓA CHẤT VẠN AN",
                "address": "208C Nguyễn Ngọc Nhựt, Phường Tân Quý, Quận Tân Phú, Thành phố Hồ Chí Minh",
                "mst": "0314845752"
        },
        {
                "name": "CÔNG TY TNHH VĨNH NAM ANH",
                "address": "65/1 Ấp 1, Bùi Công Trừng, Xã Nhị Bình, Huyện Hóc Môn, Thành phố Hồ Chí Minh",
                "mst": "0304973949"
        },
        {
                "name": "CÔNG TY TNHH KỸ THUẬT AN TOÀN MÔI TRƯỜNG HÒA PHÁT",
                "address": "173/53 Thoại Ngọc Hầu, Phường Phú Thạnh, Quận Tân Phú, Thành phố Hồ Chí Minh",
                "mst": "0312483507"
        },
        {
                "name": "CÔNG TY TNHH NGUYÊN LIỆU NÔNG NGHIỆP MEKONG",
                "address": "Lô Officetel L4-20, tầng 20, Block Lucky, Tòa nhà Richmond City, 207C Nguyễn Xí, Phường Bình Thạnh, TP. Hồ Chí Minh",
                "mst": "0313587019"
        },
        {
                "name": "CÔNG TY TNHH SX VÀ TM AN GIA PHÚ",
                "address": "40/17/9 Đường số 7, Khu phố 12, Phường Bình Hưng Hòa, Quận Bình Tân, Thành phố Hồ Chí Minh",
                "mst": "0313155900"
        },
        {
                "name": "CÔNG TY TNHH XNK NGÀN HƯƠNG",
                "address": "133K, Trần Hưng Đạo, Phường An Phú, Quận Ninh Kiều, Thành phố Cần Thơ",
                "mst": "1800385992"
        },
        {
                "name": "CÔNG TY CỔ PHẦN MẠNH ĐAN",
                "address": "43 Đường số 5, Cư xá Chu Văn An, Phường 26, Quận Bình Thạnh, Thành phố Hồ Chí Minh",
                "mst": "0311118396"
        },
        {
                "name": "CÔNG TY TNHH VẬT TƯ NÔNG NGHIỆP TRUNG PHONG",
                "address": "36/7 Lam Sơn , Phường 6, Quận Bình Thạnh, Thành phố Hồ Chí Minh",
                "mst": "0314509888"
        },
        {
                "name": "CÔNG TY TNHH SOLUTION JD",
                "address": "43 đường số 5, cư xá Chu Văn An , Phường 26, Quận Bình Thạnh, Thành phố Hồ Chí Minh",
                "mst": "0314465052"
        },
        {
                "name": "CÔNG TY TNHH KING ELONG",
                "address": "Lô Officetel L5-20, Tầng 20, Block Lucky, Tòa nhà Richmond City, 207C Nguyễn Xí, Phường 26, Quận Bình Thạnh, TP Hồ Chí Minh, Việt Nam",
                "mst": "0317197235"
        },
        {
                "name": "CÔNG TY TNHH HOÁ SINH NTK",
                "address": "Lô B113, đường số 5, KCN Thái Hoà, Xã Đức Lập Hạ, Huyện Đức Hoà, Tỉnh Long An",
                "mst": "1102004566"
        },
        {
                "name": "CÔNG TY TNHH CÂY XANH MỘC LAN",
                "address": "Số 112/8/2 Tổ 8, khu phố Tân Cang, phường Phước Tân, TP Biên Hòa, tỉnh Đồng Nai",
                "mst": "3603725410"
        },
        {
                "name": "CÔNG TY TNHH THƯƠNG MẠI HÓA CHẤT NAM BÌNH",
                "address": "4/107, Ấp Nhị Tân 2, Xã Tân Thới Nhì, Huyện Hóc Môn, Thành phố Hồ Chí Minh",
                "mst": "0309910935"
        },
        {
                "name": "CÔNG TY TNHH XNK KẾT NÔNG",
                "address": "119/83 Nguyễn Thị Tần, Phường 2, Quận 8, TP HCM",
                "mst": "0315006943"
        },
        {
                "name": "CÔNG TY TNHH HÓA CHẤT MÊ KÔNG",
                "address": "74A Đường số 18, Phường 8, Quận Gò Vấp, TP.HCM, Việt Nam",
                "mst": "0304920055"
        },
        {
                "name": "CÔNG TY CỔ PHẦN THIẾT BỊ ĐỆ NHẤT",
                "address": "Tầng 3, Phòng 3.07, khu I, Tòa nhà The Prince Residence, số 19-21 Nguyễn Văn Trỗi, Phường 11, Quận Phú Nhuận, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0310937272"
        },
        {
                "name": "CÔNG TY TNHH SVC CHEMICAL",
                "address": "Số nhà C17, đường số 4, KDC Trần Anh, Ấp Mới 2, Xã Mỹ Hạnh Nam, Huyện Đức Hòa, Tình Long An",
                "mst": "1101987225"
        },
        {
                "name": "CÔNG TY TNHH KHẢ DOANH",
                "address": "9/27 Phạm Văn Hai, Phường 1, Quận Tân Bình, TP Hồ Chí Minh",
                "mst": "0303557142"
        },
        {
                "name": "CÔNG TY TNHH BASEL THỤY SĨ",
                "address": "Lô H2A đường số 4, KCN Hải Sơn (GĐ 3+4), ấp Bình Tiền 2, Xã Đức Hòa Hạ, Huyện Đức Hoà, Tỉnh Long An",
                "mst": "1101742391"
        },
        {
                "name": "CÔNG TY TNHH DƯỢC LIỆU THIÊN NHIÊN XANH",
                "address": "85A Ỷ Lan, Phường Hiệp Tân, Quận Tân Phú, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0314051566"
        },
        {
                "name": "CÔNG TY TNHH THỊNH PHÁT VI NA",
                "address": "110 Đường số 30, Phường An Lạc, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0303702463"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI NGUYỄN BÁ",
                "address": "10-12 Trung Lang, Phường Bảy Hiền, TP Hồ Chí Minh, Việt Nam",
                "mst": "0308923441"
        },
        {
                "name": "CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU THƯƠNG MẠI SẢN XUẤT HÓA CHẤT THUẬN DUYÊN",
                "address": "49/6G Bà Điểm 11, Ấp Đông Lân, Xã Bà Điểm, TP Hồ Chí Minh, Việt Nam",
                "mst": "0311269934"
        },
        {
                "name": "CÔNG TY CỔ PHẦN VIỆT MỸ CẦN THƠ",
                "address": "M40- đường 3A- KDC Hưng Phú 1- Quận Cái Răng- TP.Cần Thơ",
                "mst": "1801548985"
        },
        {
                "name": "CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU CHÂU NGÂN",
                "address": "71 Đường Số 27, KDC Tân Quy Đông, Phường Tân Hưng, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0309818111"
        },
        {
                "name": "CÔNG TY TNHH THIẾT BỊ - HÓA CHẤT KHOA HỌC KỸ THUẬT AN KHÁNH",
                "address": "43, đường 14, Khu tái định cư Thới Nhựt, Phường Tân An, TP Cần Thơ, Việt Nam",
                "mst": "1800702458"
        },
        {
                "name": "CÔNG TY TNHH NUTIFER VN",
                "address": "Lô D01A, CCN Đức Thuận, KCN Đức Hoà 3, Ấp Tràm Lạc, Xã Đức Lập, Tỉnh Tây Ninh, Việt Nam",
                "mst": "1101793371"
        },
        {
                "name": "CÔNG TY TNHH TM HIỀN PHAN LONG AN",
                "address": "Lô A5.1, Đường số 1, KCN Đức Hòa III - Tập Đoàn Tân Á Đại Thành, Ấp Đức Hạnh 2, Xã Đức Lập, Tỉnh Tây Ninh, Việt Nam",
                "mst": "1102007045"
        },
        {
                "name": "CÔNG TY CỔ PHẦN CVGREEN",
                "address": "14/4 Thạnh Xuân 18, Phường Thới An, Thành Phố Hồ Chí Minh, Việt Nam",
                "mst": "0316184314"
        },
        {
                "name": "CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ NAMSIANG VIỆT NAM",
                "address": "180/21 Lý Thánh Tông, Phường Phú Thạnh, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0310194210"
        },
        {
                "name": "CÔNG TY TNHH NAM HÀ",
                "address": "103 Lý Tự Trọng, Phường Ninh Kiều, Thành phố Cần Thơ",
                "mst": "1800567865"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI DƯỢC LIỆU KỲ ANH",
                "address": "Ấp Mỹ Hòa 1, Xã Tháp Mười, Tỉnh Đồng Tháp, Việt Nam",
                "mst": "1402129830"
        },
        {
                "name": "CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ IN ẤN TRƯƠNG GIA PHƯỚC",
                "address": "Số 311 Nguyễn Văn Cừ, Phường Cái Khế, Thành phố Cần Thơ, Việt Nam",
                "mst": "1801514778"
        },
        {
                "name": "DOANH NGHIỆP TƯ NHÂN NHƯ CƯƠNG",
                "address": "78, đường 30/4, phường Ninh Kiều, TP Cần Thơ",
                "mst": "1800525914"
        },
        {
                "name": "CÔNG TY TNHH IN ẤN KỸ THUẬT MỚI TÂN HOA MAI",
                "address": "96/5A Đặng Thùy Trâm, Phường Bình Lợi Trung, Thành Phố Hồ Chí Minh, Việt Nam",
                "mst": "0311275254"
        },
        {
                "name": "HỢP TÁC XÃ SẢN XUẤT THƯƠNG MẠI NÔNG, THỦY SẢN CÁNH BUỒM VÀNG",
                "address": "B14/257 Ấp 2, xã Tân Nhựt, huyện Bình Chánh, TP. Hồ Chí Minh",
                "mst": "0315907352"
        },
        {
                "name": "CÔNG TY TNHH TMDV LADYBUG VIỆT NAM",
                "address": "32/36/27 Ông Ích Khiêm, Phường 14, Quận 11, TP Hồ Chí Minh",
                "mst": "0317370225"
        },
        {
                "name": "CÔNG TY TNHH CEMACO VIỆT NAM",
                "address": "87B1 Ung Văn Khiêm, P. Cái Khế, Q. Ninh Kiều, Thành phố Cần Thơ, Việt Nam",
                "mst": "0108075628-005"
        },
        {
                "name": "CÔNG TY CP CÔNG NGHỆ AQUADELTA",
                "address": "55 đường 3/2, phường Hưng lợi, quận Ninh Kiều, TPCT",
                "mst": "1801666202"
        },
        {
                "name": "CÔNG TY TNHH HÓA CHẤT PHÂN BÓN, THUỐC BVTV DUBAI",
                "address": "Lô B115, Đường số 5, KCN Thái Hòa, Ấp Tân Hòa, Xã Đức Lập Hạ, Huyện Đức Hòa, Tỉnh Long An",
                "mst": "1101798524"
        },
        {
                "name": "CÔNG TY CỔ PHẦN GEMACHEM VIỆT NAM",
                "address": "46 Ngồ Quyền, P Hàng Bài, Quận Hoàn Kiếm, TP Hà Nội",
                "mst": "0102135197"
        },
        {
                "name": "CÔNG TY TNHHH THƯƠNG MẠI GEMSKY",
                "address": "507 Lũy Bán Bích, Phường Phú Thạnh, TP HCM",
                "mst": "0316840661"
        },
        {
                "name": "CÔNG TY CỔ PHẦN THIẾT BỊ KIỂM ĐỊNH AN PHÁT",
                "address": "Km số 9, đường 72, xã Cộng Hòa, huyện Quốc Oai, thành phố Hà Nội.",
                "mst": "0108673258"
        },
        {
                "name": "Cửa Hàng Phương Lâm",
                "address": "Ngõ 2 đội 3 Võng La - Đông Anh - Hà Nội",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH KHAI NHẬT",
                "address": "Tầng 15, P.1508 Tòa nhà Vincom Center, Số 72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0317473485"
        },
        {
                "name": "CÔNG TY CP SAM CHEM QUẢ CẦU",
                "address": "Lầu 7, Số 82 Trần Huy Liệu - Phường 15 - Quận Phú Nhuận - TP HCM",
                "mst": "0304750798"
        },
        {
                "name": "CÔNG TY CP ĐẦU TƯ PHÁT TRIỂN THƯƠNG MẠI VÀ DỊCH VỤ THÙY ANH",
                "address": "Thửa đất số 1, khu đất dịch vụ thôn Yên Vĩnh, xã Kim Chung, huyện Hoài Đức, TP Hà Nội33/4F",
                "mst": "0109206922"
        },
        {
                "name": "CÔNG TY TNHH THIẾT BỊ KHOA HỌC CÔNG NGHỆ HKM",
                "address": "52/4T Đường Xuân Thới 3, Ấp Xuân Thới Đông 2, Xã Xuân Thới Đông, Huyện Hóc Môn, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0312965740"
        },
        {
                "name": "CÔNG TY TNHH CÔNG NGHIỆP MỸ KỲ",
                "address": "87/1 Đường TL 41, Phường An Phú Đông, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0313245382"
        },
        {
                "name": "CÔNG TY TNHH ĐẦU TƯ THƯƠNG MẠI SÀI GÒN NGUYỄN",
                "address": "30/12/18 Đường 49, Phường Hiệp Bình, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0314511301"
        },
        {
                "name": "CÔNG TY TNHH INTRIE",
                "address": "56/16 Nguyễn Văn Săng, Phường Tân Sơn Nhì, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0317214025"
        },
        {
                "name": "CÔNG TY TNHH MỘT THÀNH VIÊN TM AN KHÁNH",
                "address": "623 Tên Lửa, Phường An Lạc, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0316113105"
        },
        {
                "name": "CÔNG TY TNHH WAF BRANDS",
                "address": "72/1 Nguyễn Trãi, Phường Ninh Kiều, Thành phố Cần Thơ, Việt Nam",
                "mst": "1801773973"
        },
        {
                "name": "CÔNG TY TNHH IN BAO BÌ TRÍ TÍN",
                "address": "168/59A Đường Bình Trị Đông, Phường Bình Trị Đông, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0311841439"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT BAO BÌ NHỰA SÁNG TÂM",
                "address": "841 Quốc Lộ 1A, Phường Bình Hưng Hòa, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0317140831"
        },
        {
                "name": "CÔNG TY TRÁCH NHIỆM HỮU HẠN SẢN XUẤT THƯƠNG MẠI THIÊN AN PHÚ",
                "address": "1A140 Vĩnh Lộc, Xã Phạm Văn Hai, Huyện Bình Chánh, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0314862758"
        },
        {
                "name": "CÔNG TY TNHH MỸ THUẬT ỨNG DỤNG MASTER",
                "address": "240/32 Nguyễn Văn Luông, Phường Bình Phú, TP Hồ Chí Minh, Việt Nam",
                "mst": "0317050521"
        },
        {
                "name": "CÔNG TY TNHH XNK HIỆP PHÁT CHEM",
                "address": "Lô Q17A-18 đường số 11, KCN Hải Sơn mở rộng (GĐ 3+4), Xã Đức Hòa , Tỉnh Tây Ninh, Việt Nam",
                "mst": "1101925116"
        },
        {
                "name": "CÔNG TY TNHH THƯƠNG MẠI VÀ DỊCH VỤ AMG GROUP",
                "address": "Số 63 Vũ Ngọc Phan, phường Láng Hạ, quận Đống Đa, Hà Nội",
                "mst": "0108764547"
        },
        {
                "name": "CÔNG TY CỔ PHẦN THƯƠNG MẠI XUẤT NHẬP KHẨU VNT",
                "address": "Xóm 3, Thôn Hải Bối, Xã Vĩnh Thanh, Thành phố Hà Nội, Việt Nam",
                "mst": "0104188003"
        },
        {
                "name": "CÔNG TY TNHH SHORT HILLS VIỆT NAM",
                "address": "Tầng 6, Toà nhà Intan, số 97 Nguyễn Văn Trỗi, Phường Phú Nhuận, TP Hồ Chí Minh, Việt Nam",
                "mst": "0318537734"
        },
        {
                "name": "CÔNG TY CỔ PHẦN XNK HÓA CHẤT HẢI ĐĂNG",
                "address": "Tổ 41, Khu 4, Hà Khẩu, Tp Hạ Long, Tỉnh Quảng Ninh",
                "mst": "5702087191"
        },
        {
                "name": "CÔNG TY TNHH PHÂN BÓN HÓA CHẤT HÀ LINH",
                "address": "Thửa đất số 861, tờ bản đồ số 9, tổ 10, ấp Mỹ Hưng 2, Phường Cái Vồn, Tỉnh Vĩnh Long, Việt Nam",
                "mst": "1501146107"
        },
        {
                "name": "CÔNG TY CỔ PHẦN LA HÁN HOÀNG PHÁT",
                "address": "Số nhà 83D, Ngõ 165 Dương Quảng Hàm, Phường Quan Hoa, Quận Cầu Giấy, TP Hà Nội",
                "mst": "0108529582"
        },
        {
                "name": "CÔNG TY TNHH PHÁT THIÊN PHÚ",
                "address": "Số 38-40-42, đường N18, khu Phố Vinh Thạnh, Phường Trấn Biên, Tỉnh Đồng Nai, Việt Nam",
                "mst": "3600889932"
        },
        {
                "name": "CÔNG TY CỔ PHẦN ALLEY 70",
                "address": "70/17D Đinh Bộ Lĩnh, Phường 26, Quận Bình Thạnh, Thành phố Hồ Chí Minh",
                "mst": "0317962278"
        },
        {
                "name": "CÔNG TY TNHH SX TM QUANG TRUNG",
                "address": "Thửa 290 tờ bản đồ số 28, KCN Xuyên Á, Đức Hòa, Long An",
                "mst": "0317065768"
        },
        {
                "name": "CÔNG TY TNHH KỸ THUẬT HOÁ PHẨM AP",
                "address": "Tầng 3, Tòa nhà An Phú Plaza, 117-119 Lý Chính Thắng, Phường Xuân Hòa, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0319161467"
        },
        {
                "name": "CÔNG TY TNHH SX TM BAO BÌ NGỌC MINH",
                "address": "B4 ẤP MỸ HOÀ 4, XUÂN THỚI ĐÔNG, HÓC MÔN, TP.HCM",
                "mst": "0313635470"
        },
        {
                "name": "CÔNG TY TNHH MỘT THÀNH VIÊN LƯU XUÂN GIANG",
                "address": "56A Phạm Ngũ Lão, Phường Cái Khế, TP. Cần Thơ",
                "mst": "1800690555"
        },
        {
                "name": "CÔNG TY CỔ PHẦN IN TỔNG HỢP CẦN THƠ",
                "address": "Số 500 đường 30/4, Phường Tân An, TP. Cần Thơ",
                "mst": "1800157925"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI G28",
                "address": "ô LE5, Đường Số 2, KCN Xuyên Á, Xã Đức Lập, Tỉnh Tây Ninh, Việt Nam",
                "mst": "1101926825"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT BAO BÌ ĐÔNG BẮC",
                "address": "Số 11 Đường 406 Ấp 2, Xã Củ Chi, TP Hồ Chí Minh, Việt Nam",
                "mst": "0318450547"
        },
        {
                "name": "Công ty TNHH SX & TM Duy Nhật",
                "address": "Lô O, KCN An Nghiệp, Xã An Nghiệp, Tỉnh Vĩnh Long",
                "mst": "2200717750"
        },
        {
                "name": "CTY TNHH SX TM DV TH DAO CARTON",
                "address": "Số 83, Đường B13, KDC 91B, Phường Tân An, Thành phố Cần Thơ, Việt Nam",
                "mst": "1801699046"
        },
        {
                "name": "CÔNG TY TNHH BAO BÌ GIẤY AN TÍN",
                "address": "Số 23 Đường 23, Khu phố 2, Phường Tam Bình, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0315839173"
        },
        {
                "name": "CÔNG TY CỔ PHẦN BAO BÌ TRỌNG TÍN",
                "address": "Số 112/7 Đường Lê Thị Hà, Tổ 11, Ấp Chánh 1, Xã Hóc Môn, TP Hồ Chí Minh, Việt Nam",
                "mst": "0313183129"
        },
        {
                "name": "CÔNG TY TNHH GIẤY YUEN FOONG YU (VN)",
                "address": "Lô E3, E4, E5, E6 khu công nghiệp Đức Hòa 1, Ấp 5, Xã Mỹ Hạnh, Tỉnh Tây Ninh, Việt Nam",
                "mst": "1100635534"
        },
        {
                "name": "HEBEI VEYONG BIO-CHEMICAL CO., LTD.",
                "address": "NO.6, MIDDLE HUAGONG ROAD, CIRCULATION CHEMICAL INDUSTRY PARK, SHIJIAZHUANG CITY, HEBEI, CHINA",
                "mst": ""
        },
        {
                "name": "TIEN YUAN CHEMICAL (PTE) LTD.",
                "address": "NO. 18 CHIN BEE ROAD, JURONG TOWN, SINGAPORE 619827",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH HOA VIỆT CHEMGROUP",
                "address": "A2/11Y, tổ 3, ấp 1, xã Vĩnh Lộc A, huyện Bình Chánh, TP.HCM",
                "mst": "0317598043"
        },
        {
                "name": "CÔNG TY TNHH ĐẦU TƯ NÔNG NGHIỆP THÔNG MINH",
                "address": "33 Đường 2, Phường Phước Long, Thành phố Hồ Chí Minh, Việt Nam;",
                "mst": "0312170342"
        },
        {
                "name": "CÔNG TY TNHH XUẤT NHẬP KHẨU TRẦN TIẾN",
                "address": "911-913-915-917 Nguyễn Trãi, Phường Chợ Lớn, Tp. Hồ Chí Minh",
                "mst": "0312284043"
        },
        {
                "name": "CÔNG TY CỔ PHẦN XUẤT NHẬP KHẨU HÓA CHẤT VIỆT MỸ",
                "address": "9 Đường số 5, Bình Hưng, Bình Chánh, TP.HCM",
                "mst": "0312669004"
        },
        {
                "name": "CÔNG TY TRÁCH NHIỆM HỮU HẠN AK VINA AK VINA CO., LTD",
                "address": "Số 02, KCN Gò Dầu, Xã Phước Thái, Huyện Long Thành, Tỉnh Đồng Nai, Việt Nam",
                "mst": "3600649634"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI AMIGOS",
                "address": "60/15 Huỳnh Văn Nghệ, Phường Tân Sơn, TP Hồ Chí Minh, Việt Nam",
                "mst": "0311360340"
        },
        {
                "name": "CÔNG TY TNHH VẬT TƯ NÔNG NGHIỆP MIA",
                "address": "12/29 Nguyễn Tuân, Phường Hạnh Thông, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": "0315662254"
        },
        {
                "name": "CÔNG TY CỔ PHẦN AGAMA",
                "address": "Lô 2, Đường số 2, Cụm Công nghiệp Đức Thuận, Ấp Tràm Lạc, Xã Mỹ Hạnh Bắc, Huyện Đức Hoà, Tỉnh Long An, Việt Nam",
                "mst": ""
        },
        {
                "name": "CÔNG TY CỔ PHẦN HÓA CHẤT NÔNG NGHIỆP HÀ LONG",
                "address": "Lô A 204, Khu công nghiệp Thái Hòa , Xã Đức Lập Hạ, Huyện Đức Hoà, Tỉnh Long An, Việt Nam",
                "mst": ""
        },
        {
                "name": "CÔNG TY CỔ PHẦN PHÂN BÓN QUỐC TẾ ÂU VIỆT (CÔNG TY CP EVF)",
                "address": "Quốc lộ 1A, Ấp Long An B, Thị Trấn Cái Tắc, Huyện Châu Thành A, Tỉnh Hậu Giang, Việt Nam",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH BASEL THỤY SĨ",
                "address": "Lô H2A đường số 4, KCN Hải Sơn (GĐ 3+4), ấp Bình Tiền 2, Xã Đức Hòa Hạ, Huyện Đức Hoà, Tỉnh Long An",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH DEGO HOLDING",
                "address": "B19 đường cầu dẫn cầu Cần Thơ, QL 1A, Khu Dân cư Trung tâm văn hóa Tây Đô, phường Cái Răng, Thành phố Cần Thơ.",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH PHÂN BÓN NIỀM TIN VIỆT",
                "address": "Ấp 2A, Xã Hưng Thạnh, H.Tháp Mười, Đồng Tháp",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH PRIMA - PHÁP - CHÂU ÂU",
                "address": "Lô B101 đường B. KCN Thái Hoà, Xã Đức Lập Hạ, Huyện Đức Hoà, Tỉnh Long An",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH SÀN GIAO DỊCH THUỐC BẢO VỆ THỰC VẬT VIỆT NAM",
                "address": "Tầng 1, B19 đường dẫn cầu Cần Thơ, Quốc lộ 1A, KDC TTVH Tây Đô, Phường Hưng Thạnh, Quận Cái Răng, Thành phố Cần Thơ, Việt Nam",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH SX TM YAMATO VN",
                "address": "Lô A20A Đường số 6, KCN Hải Sơn (GĐ 3+4), Xã Đức Hòa Hạ, Huyện Đức Hoà, Tỉnh Long An",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH XUẤT NHẬP KHẨU HÓA CHẤT ATC",
                "address": "Số 87, Đường Lý Bôn, Phường Bình Đức, Tỉnh An Giang, Việt Nam",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH AGRIFUTURE",
                "address": "Phòng A4.04, Khu Phức Hợp Căn Hộ Nhật Hoa, 33 Nguyễn Hữu Thọ, Phường Tân Hưng, Thành phố Hồ Chí Minh, Việt Nam",
                "mst": ""
        },
        {
                "name": "Cty TNHH SX TM DV Thu Loan",
                "address": "699 tổ 34 Khóm Đông Thuận , Phường Đông Thành , Bình Minh, Vĩnh Long",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH THƯƠNG MẠI THÁI NÔNG",
                "address": "73 Lạc Long Quân, Phường 1, Quận 11, Thành phố Hồ Chí Minh",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH TẬP ĐOÀN AN NÔNG (AN GROUP)",
                "address": "464 Đường số 7, khu phố 8, Phường Tân Tạo, Quận Bình Tân, TP Hồ Chí Minh",
                "mst": ""
        },
        {
                "name": "KHO DR XANH",
                "address": "Số 124 Võ Văn Kiệt, KV Bình Trung, P.Long Hòa, Q. Bình Thủy, Cần Thơ",
                "mst": ""
        },
        {
                "name": "KHO B18",
                "address": "B18 đường dẫn cầu Cần Thơ, Quốc lộ 1A, KDC TTVH Tây Đô, Phường Cái Răng, Thành phố Cần Thơ",
                "mst": ""
        },
        {
                "name": "Kho C1-2",
                "address": "Kho C1-2",
                "mst": ""
        },
        {
                "name": "KHO F49 - ICARE",
                "address": "nhà F49 (chạy qua trường lái Chiến Thắng) đường số 7, KDC Long Thịnh, Phường Phú Thứ, Cái Răng, Cần Thơ",
                "mst": ""
        },
        {
                "name": "KHO LAB DEGO",
                "address": "B19 đường dẫn cầu Cần Thơ, Quốc lộ 1A, KDC TTVH Tây Đô, Phường Cái Răng, Thành phố Cần Thơ",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ BAO BÌ LỘC PHÁT",
                "address": "229 Nguyễn Thị Minh Khai, Ninh Kiều, Cần Thơ",
                "mst": "1801722746"
        },
        {
                "name": "CÔNG TY TNHH CHẤN HƯNG NÔNG",
                "address": "Ấp Trường Thọ, Xã Trường Xuân, TP Cần Thơ, Việt Nam.",
                "mst": "1801800440"
        },
        {
                "name": "BAO BÌ CHÂU DUY",
                "address": "26-28 Ngô Sĩ Liên KDC MeTro,Tân An, Cần Thơ",
                "mst": ""
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT BAO BÌ ĐÔNG BẮC",
                "address": "Số 11 Đường 406 Ấp 2, Xã Củ Chi, TP Hồ Chí Minh, Việt Nam",
                "mst": "0318450547"
        },
        {
                "name": "CÔNG TY TNHH MÁY VÀ HÓA CHẤT TOÀN CẦU",
                "address": "Tầng 6, tòa nhà CDS, Số 33,Ngõ 61 Lạc Trung, Phường Vĩnh Tuy, Hà Nội",
                "mst": "0105111638"
        },
        {
                "name": "CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI CAO VẠN THỊNH",
                "address": "1004/12 Hương lộ 2, khu phố 6, Phường Bình Trị Đông, TP Hồ Chí Minh, Việt Nam",
                "mst": "0311953982"
        },
        {
                "name": "CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ NGỌC HÂN XUYÊN Á",
                "address": "Số 134 đường Giồng Lớn, ấp Giồng Lớn, Xã Mỹ Hạnh, Tỉnh Tây Ninh, Việt Nam",
                "mst": "1102106818"
        },
        {
                "name": "LÊ HỮU THÔNG",
                "address": "252 Ấp 17, xã Hiệp Phước, Thành phố Hồ Chí Minh",
                "mst": "079082006587"
        },
        {
                "name": "Công Ty TNHH TM Nông Xanh",
                "address": "168 Đường 16, KDC Đông Tăng Long ,P long phước,TP.HCM",
                "mst": "0310187076"
        },
        {
                "name": "AZDIGI",
                "address": "768 Nguyễn Thị Định, Phường Thạnh Mỹ Lợi, TP Thủ Đức, Thành phố Hồ Chí Minh",
                "mst": "0313977593"
        },
        {
                "name": "MẮT BÃO",
                "address": "Tầng 3 Anna Building, Công Viên Phần Mềm Quang Trung, Q.12, TP.HCM",
                "mst": "0302805908"
        },
        {
                "name": "NHÂN HÒA",
                "address": "270 Cao Thắng (nối dài), Phường 12, Quận 10, TP.HCM",
                "mst": "0101235184"
        }
];
        localStorage.setItem('nccData', JSON.stringify(nccData));
    }
    if (nhanSuData.length <= 1) {
        nhanSuData = [
            { name: "Trần Viết Vỹ", dept: "Xây dựng", manager: "Trần Chí Dững", email: "tvvy.idagroup@gmail.com" },
            { name: "Thái Thị Thu Hiền", dept: "Xây dựng", manager: "Trần Chí Dững", email: "ttthien.idagroup@gmail.com" },
            { name: "Trần Hoàng Diệu", dept: "Xây dựng", manager: "Trần Chí Dững", email: "thdieu.idagroup@gmail.com" },
            { name: "Đoàn Minh Khôi", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "dmkhoi.degoholding@gmail.com" },
            { name: "Võ Thanh Huyền", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "vthuyen.idagroup@gmail.com" },
            { name: "Nguyễn Minh Cảnh", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "nmcanh.idaglobal@gmail.com" },
            { name: "Phan Thị Chúc Ly", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "ptcly.degoholding@gmail.com" },
            { name: "Nguyễn Đình Chương", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "ndchuong.degoholding@gmail.com" },
            { name: "Lê Phú Ngoan", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "ngoanle789123@gmail.com" },
            { name: "Nguyễn Lương Nhật Anh", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "nlnanh.degoholding@gmail.com" },
            { name: "Trần Diễm Phương", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "tphuong.degoholding@gmail.com" },
            { name: "Nguyễn Văn Hiếu", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "" },
            { name: "Nguyễn Thanh Phương", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "ntphuong.degoholding@gmail.com" },
            { name: "Nguyễn Quốc Phòng", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "" },
            { name: "Nguyễn Thị Kiều Trang", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "ntktrang.idagroup@gmail.com" },
            { name: "Nguyễn Trung Lượng", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "" },
            { name: "Hồ Văn Phúc", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "" },
            { name: "Trần Văn Nhí", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "tranvannhi17121998@gmail.com" },
            { name: "Nguyễn Văn Điền", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "nvdien.degoholding@gmail.com" },
            { name: "Nguyễn Lê Vĩnh Khang", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "nlvkhang.degoholding@gmail.com" },
            { name: "Mai Văn Lãm", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "" },
            { name: "Trương Duy Khánh", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "tdkhanh.degoholding@gmail.com" },
            { name: "Trần Văn Hòn", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "tvhon.degoholding@gmail.com" },
            { name: "Phạm Vũ Phong", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "ks.phong12a2@gmail.com" },
            { name: "Đặng Phong Phú", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "dphu9377@gmail.com" },
            { name: "Nguyễn Hoàng Minh Ngân", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "nhmngan.degoholding@gmail.com" },
            { name: "Đặng Tuyết Ngân", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "ngan100107@gmail.com" },
            { name: "Trần Thị Thuý Hằng", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "thuyhang1978.hg@gmail.com" },
            { name: "Dương Văn Quyền", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "dvquyen.degoholding@gmail.com" },
            { name: "Nguyễn Anh Đức", dept: "Dego Organic", manager: "Đoàn Minh Khôi", email: "nguyenanhduc69cm@gmail.com" },
            { name: "Lê Hữu Hãi", dept: "Dego Lab", manager: "Lê Hữu Hãi", email: "lhhai.degoholding@gmail.com" },
            { name: "Dương Ngọc Lam", dept: "Dego Lab", manager: "Lê Hữu Hãi", email: "dnlam.degoholding@gmail.com" },
            { name: "Trần Hoàng Bảo", dept: "Dego Lab", manager: "Lê Hữu Hãi", email: "thbao.degoholding@gmail.com" },
            { name: "Trần Cao Huỳnh Như", dept: "Dego Lab", manager: "Lê Hữu Hãi", email: "tchnhu.degoholding@gmail.com" },
            { name: "Nguyễn Thị Tường Vân", dept: "Dego Lab", manager: "Lê Hữu Hãi", email: "nttvan.degoholding@gmail.com" },
            { name: "Hồng Văn Sơn", dept: "Dego Lab", manager: "Lê Hữu Hãi", email: "hvson.degoholding@gmail.com" },
            { name: "Đỗ Thị Hà Thanh", dept: "Dego Lab", manager: "Lê Hữu Hãi", email: "dththanh.idagroup@gmail.com" },
            { name: "Trần Thị Cẩm Thu", dept: "Dego Lab", manager: "Lê Hữu Hãi", email: "ttcthu.idagroup@gmail.com" },
            { name: "Trần Quang Phú", dept: "N2SBIO", manager: "Trần Quang Phú", email: "phutq.n2sbiovn@gmail.com" },
            { name: "Nguyễn Hiếu Khương", dept: "N2SBIO", manager: "Trần Quang Phú", email: "nhkhuong.idagroup@gmail.com" },
            { name: "Nguyễn Trung Đức", dept: "N2SBIO", manager: "Trần Quang Phú", email: "ducnt.n2sbiovn@gmail.com" },
            { name: "Nguyễn Thị Hường", dept: "N2SBIO", manager: "Trần Quang Phú", email: "huongnt.n2sbiovn@gmail.com" },
            { name: "Phạm Văn Chương", dept: "N2SBIO", manager: "Trần Quang Phú", email: "" },
            { name: "Nguyễn Trường Duy", dept: "N2SBIO", manager: "Trần Quang Phú", email: "duynt.n2sbiovn@gmail.com" },
            { name: "Nguyễn Trường Giang", dept: "N2SBIO", manager: "Trần Quang Phú", email: "giangnt.n2sbiovn@gmail.com" },
            { name: "Đàm Tử Hồng", dept: "N2SBIO", manager: "Trần Quang Phú", email: "hongdt.n2sbiovn@gmail.com" },
            { name: "Nguyễn Thị Hoàng Lộc", dept: "N2SBIO", manager: "Trần Quang Phú", email: "locnt1.n2sbiovn@gmail.com" },
            { name: "Võ Minh Quang", dept: "N2SBIO", manager: "Trần Quang Phú", email: "" },
            { name: "Ngũ Thị Như Ý", dept: "N2SBIO", manager: "Trần Quang Phú", email: "" },
            { name: "Đỗ Kim Hiền", dept: "N2SBIO", manager: "Trần Quang Phú", email: "" },
            { name: "Phan Tấn Đạt", dept: "N2SBIO", manager: "Trần Quang Phú", email: "" },
            { name: "Nguyễn Thị Thuỳ Trang", dept: "N2SBIO", manager: "Trần Quang Phú", email: "ntttrang.degoholding@gmail.com" },
            { name: "Lê Huy Tân", dept: "N2SBIO", manager: "Trần Quang Phú", email: "" },
            { name: "Trần Thị Hương Tuyền", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "tthtuyen.idagroup@gmail.com" },
            { name: "Bùi Huỳnh Trường Thành", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "bhtthanh.idaglobal@gmail.com" },
            { name: "Lê Vỹ Khang", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "lvkhang.idagroup@gmail.com" },
            { name: "Trần Quốc Thái", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "tqthai.idagroup@gmail.com" },
            { name: "Đào Quốc Triệu", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "dqtrieu.idagroup@gmail.com" },
            { name: "Lê Tấn Nhựt", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "ltnhut.idagroup@gmail.com" },
            { name: "Trần Quang Huy", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "tqhuy.idagroup@gmail.com" },
            { name: "Lê Lâm Tùng", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "lltung.idagroup@gmail.com" },
            { name: "Lê Minh Thông", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "lmthong.degoholding@gmail.com" },
            { name: "Trần Minh Sang", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "tmsang.degoholding@gmail.com" },
            { name: "Lưu Nhựt Minh", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "lnminh.degoholding@gmail.com" },
            { name: "Huỳnh Quang Tín", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "hqtin.degoholding@gmail.com" },
            { name: "Nguyễn Xuân Khánh", dept: "Điều phối", manager: "Trần Thị Hương Tuyền", email: "" },
            { name: "Chim Cẩm Chi", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "ccchi.idagroup@gmail.com" },
            { name: "Trần Ngọc Trâm", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "tntram.aba@gmail.com" },
            { name: "Châu Thị Như Ý", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "ctny.aba@gmail.com" },
            { name: "Đặng Trúc Phi", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "dtphi.aba@gmail.com" },
            { name: "Trần Thị Mỹ Duyên", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "" },
            { name: "Nguyễn Hoàng Thoại", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "" },
            { name: "Lê Thị Thanh Nhàn", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "lttnhan.idagroup@gmail.com" },
            { name: "Trần Thị Bé Hai", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "ttbhai.aba@gmail.com" },
            { name: "Nguyễn Thị Mỹ Linh", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "ntmlinh.aba@gmail.com" },
            { name: "Phạm Từ Phương Trinh", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "ptptrinh.aba@gmail.com" },
            { name: "Nguyễn Hoàng Đạt", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "nhdat.aba@gmail.com" },
            { name: "Nguyễn Khôi Nguyên", dept: "ABA Chemical", manager: "Chim Cẩm Chi", email: "nknguyen.aba@gmail.com" },
            { name: "Lâm Hữu Thịnh", dept: "Thiết kế", manager: "Lâm Hữu Thịnh", email: "lhthinh.agc@gmail.com" },
            { name: "Phạm Hồ Minh Minh", dept: "Thiết kế", manager: "Lâm Hữu Thịnh", email: "phmminh.idagroup@gmail.com" },
            { name: "Lý Gia Nguyên", dept: "Thiết kế", manager: "Lâm Hữu Thịnh", email: "lgnguyen.idagroup@gmail.com" },
            { name: "Nguyễn Xuân Vinh", dept: "Thiết kế", manager: "Lâm Hữu Thịnh", email: "nxvinh.degoholding@gmail.com" },
            { name: "Lê Phước Hữu", dept: "Icare", manager: "Lê Phước Hữu", email: "lphuu.idagroup@gmail.com" },
            { name: "Lê Tuyết Mai", dept: "Icare", manager: "Lê Phước Hữu", email: "ltmai.idagroup@gmail.com" },
            { name: "Trần Lê Tường Vy", dept: "Icare", manager: "Lê Phước Hữu", email: "tltvy.icare@gmail.com" },
            { name: "Lê Tuấn Kiệt", dept: "Icare", manager: "Lê Phước Hữu", email: "ltkiet.icare@gmail.com" },
            { name: "Huỳnh Quốc Bảo", dept: "Icare", manager: "Lê Phước Hữu", email: "hqbao.icare@gmail.com" },
            { name: "Danh Hoàng Nguyên", dept: "Icare", manager: "Lê Phước Hữu", email: "dhnguyen.icare@gmail.com" },
            { name: "Âu Kim Thương", dept: "Icare", manager: "Lê Phước Hữu", email: "akthuong.icare@gmail.com" },
            { name: "Quách Nguyễn Hoàng Huy", dept: "Icare", manager: "Lê Phước Hữu", email: "qnhhuy.icare@gmail.com" },
            { name: "Trà Lê Nhựt Lam", dept: "Icare", manager: "Lê Phước Hữu", email: "tlnlam.icare@gmail.com" },
            { name: "Ngô Thị Tuyết Khang", dept: "Icare", manager: "Lê Phước Hữu", email: "nttkhang.icare@gmail.com" },
            { name: "Nguyễn Cẫm Thu", dept: "Icare", manager: "Lê Phước Hữu", email: "ncthu.icare@gmail.com" },
            { name: "Huỳnh Văn Kavin", dept: "Icare", manager: "Lê Phước Hữu", email: "hvkavin.icare@gmail.com" },
            { name: "Nguyễn Hồng Nhung", dept: "Icare", manager: "Lê Phước Hữu", email: "nhnhung.icare@gmail.com" },
            { name: "Trịnh Thanh Ngân", dept: "Icare", manager: "Lê Phước Hữu", email: "ttngan.icare@gmail.com" },
            { name: "Đặng Thị Mỹ Dung", dept: "Icare", manager: "Lê Phước Hữu", email: "dtmdung.icare@gmail.com" },
            { name: "Nguyễn Thị Thanh Duyên", dept: "Icare", manager: "Lê Phước Hữu", email: "nttduyen.icare@gmail.com" },
            { name: "Nguyễn Thị Kim Thuyền", dept: "Icare", manager: "Lê Phước Hữu", email: "ntkthuyen.icare@gmail.com" },
            { name: "Nguyễn Thanh Trúc", dept: "Icare", manager: "Lê Phước Hữu", email: "nttruc.icare@gmail.com" },
            { name: "Vương Hoàng Thân", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "vhthan.idagroup@gmail.com" },
            { name: "Đặng Văn Tỏa", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "" },
            { name: "Lưu Trần Bảo Ngọc", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ltbaongoc.idagroup@gmail.com" },
            { name: "Nguyễn Huỳnh Đức", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "nhduc.idagroup@gmail.com" },
            { name: "Nguyễn Quốc Việt", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "nqviet.idaglobal@gmail.com" },
            { name: "Phan Đỗ Gia Huy", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "pdghuy.idaglobal@gmail.com" },
            { name: "Phạm Xuân Hài", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "pxhai.idaglobal@gmail.com" },
            { name: "Nguyễn Hồng Phát", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "nhphat.idaglobal@gmail.com" },
            { name: "Mai Thị Ngọc Phương", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "mtnphuong.idaglobal@gmail.com" },
            { name: "Nguyễn Thanh Bi", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ntbi.idaglobal@gmail.com" },
            { name: "Lê Nguyễn Tuyết Vi", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "" },
            { name: "Trần Văn Hiếu", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "tvhieu.idaglobal@gmail.com" },
            { name: "Lê Đăng Khoa", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ldkhoa.idagroup@gmail.com" },
            { name: "Lê Trọng Nhân", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ltrongnhan.idaglobal@gmail.com" },
            { name: "Trần Hữu Nghĩa", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "thnghia1.idaglobal@gmail.com" },
            { name: "Đoàn Ngọc Trang", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "dntrang.idaglobal@gmail.com" },
            { name: "Nguyễn Hùng Tính", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "" },
            { name: "Phạm Văn Phúc", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "pvphuc.idaglobal@gmail.com" },
            { name: "Đàm Văn Nhật", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "dvnhat.idaglobal@gmail.com" },
            { name: "Nguyễn Thị Thu Quyên", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "nttquyen.idagroup@gmail.com" },
            { name: "Kiều Quốc Tiến", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "kqtien.idaglobal@gmail.com" },
            { name: "Nguyễn Văn Tường Huy", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "nvthuy.idaglobal@gmail.com" },
            { name: "Võ Trọng Nghĩa", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "vtnghia.idaglobal@gmail.com" },
            { name: "Võ Anh Kiệt", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "vakiet.idaglobal@gmail.com" },
            { name: "Nguyễn Đức Duy", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ndduy.idaglobal@gmail.com" },
            { name: "Lê Tuấn Thịnh", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ltthinhidaglobal@gmail.com" },
            { name: "Huỳnh Văn Hạnh Em", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "hvhem.idaglobal@gmail.com" },
            { name: "Trần Văn Liêm", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "tvliem.idaglobal@gmail.com" },
            { name: "Trần Huỳnh Phát", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "thphat.idaglobal@gmail.com" },
            { name: "Nguyễn Cao Kỳ", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ncky.idaglobal@gmail.com" },
            { name: "Mai Phúc Thạnh", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "mpthanh.idaglobal@gmail.com" },
            { name: "Nguyễn Nhật Minh", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "nnminh.idaglobal@gmail.com" },
            { name: "Nguyễn Ngọc Pha", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "nnpha.idaglobal@gmail.com" },
            { name: "Trương Minh Hiển", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "tmhien.idaglobal@gmail.com" },
            { name: "Võ Thanh Thảo", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "vtthao.idaglobal@gmail.com" },
            { name: "Phùng Thanh Bình", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ptbinh.idaglobal@gmail.com" },
            { name: "Lê Nguyễn Hoàng Huy", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "lnhhuy.idaglobal@gmail.com" },
            { name: "Phan Thanh Tân", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "pttan.idaglobal@gmail.com" },
            { name: "Nguyễn Thị Kim Ngọc", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ntkngoc.idaglobal@gmail.com" },
            { name: "Lê Thị Ngọc Mi", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ltnmi.idagroup@gmail.com" },
            { name: "Phan Kiều Ngọc Duyên Sang", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "pkndsang.idagroup@gmail.com" },
            { name: "Huỳnh Lâm Kim Loan", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "hlkloan.idagroup@gmail.com" },
            { name: "Lê Thị Ngọc Hân", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ltnhan.idaglobal@gmail.com" },
            { name: "Huỳnh Thị Thanh Nguyên", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "httnguyen.idaglobal@gmail.com" },
            { name: "Nguyễn Thị Anh Thư", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "" },
            { name: "Lương Thị Như Ý", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "ltnhuy.idaglobal@gmail.com" },
            { name: "Nguyễn Dương Bình", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "" },
            { name: "Nguyễn Hoàng Nhựt", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "" },
            { name: "Đặng Bảo Trân", dept: "IDA Global", manager: "Vương Hoàng Thân", email: "dbtran.idaglobal@gmail.com" },
            { name: "Nguyễn Duy Linh", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "ndlinh.idagroup@gmail.com" },
            { name: "Mai Thi Hiểu", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "" },
            { name: "Trần Thị Bích Trâm", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "ttbtram.idagroup@gmail.com" },
            { name: "Nguyễn Thị Ngọc Hân", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "ntnhan.idaglobal@gmail.com" },
            { name: "Trần Thị An An", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "ttaan.idaglobal@gmail.com" },
            { name: "Nguyễn Huỳnh Thiên An", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "" },
            { name: "Lê Thị Như Ý", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "ltny.idagroup@gmail.com" },
            { name: "Nguyễn Châu Bảo Trân", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "ncbtran.idaglobal@gmail.com" },
            { name: "Trương Thị Kim Ngân", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "ttkngan.bamboo@gmail.com" },
            { name: "Phạm Thành Nhân", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "" },
            { name: "Lê Vi", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "" },
            { name: "Hồ Trúc Quỳnh", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "" },
            { name: "Nguyễn Thị Yến Vân", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "" },
            { name: "Kiều Thị Thảo Ngân", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "kttngan.bamboo@gmail.com" },
            { name: "Thái Thị Yến Nhi", dept: "Bamboo", manager: "Nguyễn Duy Linh", email: "ttynhi.icare@gmail.com" },
            { name: "Trương Thùy Linh", dept: "Dr.Xanh", manager: "Trương Thùy Linh", email: "ttlinh.degoholding@gmail.com" },
            { name: "Nguyễn Thị Thuý Phương", dept: "Dr.Xanh", manager: "Trương Thùy Linh", email: "nttphuong.degoholding@gmail.com" },
            { name: "Dương Hồng Ngọc", dept: "Dr.Xanh", manager: "Trương Thùy Linh", email: "dhngoc.degoholding@gmail.com" },
            { name: "Ngô Trọng Nguyên", dept: "Dr.Xanh", manager: "Trương Thùy Linh", email: "ntnguyen.degoholding@gmail.com" },
            { name: "Lê Thị Cẩm Hường", dept: "Dr.Xanh", manager: "Trương Thùy Linh", email: "ltchuong.degoholding@gmail.com" },
            { name: "Nguyễn Minh Toàn", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "nmtoan.idagroup@gmail.com" },
            { name: "Hồ Ngọc Quế Anh", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "hnqanh.idagroup@gmail.com" },
            { name: "Lê Mỹ Duyên", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "lmduyen.idagroup@gmail.com" },
            { name: "Nguyễn Thị Ngọc Hân", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "ntnhan.idaglobal@gmail.com" },
            { name: "Lý Minh Nguyệt", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "lmnguyet.idagroup@gmail.com" },
            { name: "Huỳnh Hoàng Phúc", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "hhphuc.idagroup@gmail.com" },
            { name: "Danh Nhật Hào", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "" },
            { name: "Phạm Hửu My", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "" },
            { name: "Nguyễn Thị Kiều Trang", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "ntktrang.idagroup@gmail.com" },
            { name: "Đỗ Quốc Toàn", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "doquoctoan2004cm@gmail.com" },
            { name: "Vương Mỹ Ngân", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "vuongmyngan204@gmail.com" },
            { name: "Phạm Duy Tính", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "phamduytinh15072004@gmail.com" },
            { name: "Nguyễn Thị Ngọc Thảo", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "ntnthao.bamboo@gmail.com" },
            { name: "Võ Trình Kim Vy", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "vtkvy.idagroup@gmail.com" },
            { name: "Võ Thị Kiều Loan", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "vtkloan.idagroup@gmail.com" },
            { name: "Nguyễn Thị Yến Giang", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "nty.giang.idagroup@gmail.com" },
            { name: "Đặng Bá Tiếp", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "dangbatiep246@gmail.com" },
            { name: "La Tường Vi", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "ltvi.degoholding@gmail.com" },
            { name: "Trần Ngọc Thảo Ly", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "thaolynt1707@gmail.com" },
            { name: "Võ Thị Kim Hoa", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "vtkhoa.idagroup@gmail.com" },
            { name: "Nguyễn Hoàng Dủ", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "nhdu.idagroup@gmail.com" },
            { name: "Nguyễn Thị Thu Thủy", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "nttthuy15102025@gmail.com" },
            { name: "Phạm Huỳnh Bảo Trang", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "phbtrang.idagroup@gmail.com" },
            { name: "Lê Thị Thu Ba", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "lttba.degoholding@gmail.com" },
            { name: "Nguyễn Minh Hiếu", dept: "Kế toán", manager: "Nguyễn Minh Toàn", email: "hieuminh8486@gmail.com" },
            { name: "Trần Thị Ánh Hường", dept: "Nhân sự", manager: "Trần Thị Ánh Hường", email: "amytran.hr@gmail.com" },
            { name: "Trịnh Thùy Giang", dept: "Nhân sự", manager: "Trần Thị Ánh Hường", email: "ttgiang.idagroup@gmail.com" },
            { name: "Hoàng Thị Diệu", dept: "Nhân sự", manager: "Trần Thị Ánh Hường", email: "htdieu.degoholding@gmail.com" },
            { name: "Phạm Lê Triết Giang", dept: "Lập trình & IT nội bộ", manager: "Trần Thị Ánh Hường", email: "pltgiang.degoholding@gmail.com" },
            { name: "Võ Nguyễn Thư Sinh", dept: "Nhân sự", manager: "Trần Thị Ánh Hường", email: "vntsinh.idagroup@gmail.com" },
            { name: "Nguyễn Thị Mỹ Duyên", dept: "Nhân sự", manager: "Trần Thị Ánh Hường", email: "duyenntm88@gmail.com" },
            { name: "Võ Thanh Ngân", dept: "Nhân sự", manager: "Trần Thị Ánh Hường", email: "vtngan.degoholding@gmail.com" },
            { name: "Nguyễn Đỗ Quyên", dept: "Kiểm soát kế hoạch", manager: "Nguyễn Đỗ Quyên", email: "ndquyen.idagroup@gmail.com" },
            { name: "Dương Hải Yến", dept: "Hành chính", manager: "Nguyễn Đỗ Quyên", email: "duonghaiyen.idagroup@gmail.com" },
            { name: "Huỳnh Cẩm Tiên", dept: "Hành chính", manager: "Nguyễn Đỗ Quyên", email: "hctien.degoholding@gmail.com" },
            { name: "Đào Trúc Nhi", dept: "Hành chính", manager: "Nguyễn Đỗ Quyên", email: "dtnhi.degoholding@gmail.com" },
            { name: "Hồ Thị Thiên Trang", dept: "Kiểm soát kế hoạch", manager: "Nguyễn Đỗ Quyên", email: "htttrang.degoholding@gmail.com" },
            { name: "Nguyễn Mạnh Cường", dept: "Lập trình & IT nội bộ", manager: "Trần Thị Ánh Hường", email: "nmcuong.degoholding@gmail.com" },
            { name: "Huỳnh Gia Bảo", dept: "Lập trình & IT nội bộ", manager: "Trần Thị Ánh Hường", email: "" },
            { name: "Trần Ngọc Huỳnh", dept: "Sản xuất -Thu mua", manager: "Trần Ngọc Huỳnh", email: "tnhuynh.idagroup@gmail.com" },
            { name: "Võ Trọng Tín", dept: "Sản xuất -Thu mua", manager: "Trần Ngọc Huỳnh", email: "vttin.aba@gmail.com" },
            { name: "Hồ Thị Diệu Liên", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "htdlien.degoholding@gmail.com" },
            { name: "Trần Phước Hoàng Khang", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "" },
            { name: "Lê Thị Trúc Thơ", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "" },
            { name: "Phạm Khánh Ngân", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "pkngan.idagroup@gmail.com" },
            { name: "Nguyễn Thị Phương Thảo", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "npthao2777@gmail.com" },
            { name: "Mai Thị Yến Ly", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "mtyly.idagroup@gmail.com" },
            { name: "Huỳnh Thị Kim Hương", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "htkhuong.idagroup@gmail.com" },
            { name: "Trần Minh Kha", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "" },
            { name: "Trương Thị Hồng Mai", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "" },
            { name: "Nguyễn Ngọc Bảo Thi", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "" },
            { name: "Trần Nguyễn Phương Quyên", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "tnpquyen.degoholding@gmail.com" },
            { name: "Nguyễn Thanh Tiên", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "nttien.idagroup@gmail.com" },
            { name: "Lâm Bích Dư", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "" },
            { name: "Đào Thị Thuý Oanh", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "" },
            { name: "Bùi Thị Diễm Tiên", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "" },
            { name: "Lê Mỹ Ngọc", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "lmngoc.degoholding@gmail.com" },
            { name: "Triệu Nam Lộc", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "" },
            { name: "Nguyễn Thị Trúc Linh", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "" },
            { name: "Nguyễn Thị Thu Hồng", dept: "Sản xuất -Thu mua", manager: "Phạm Khánh Ngân", email: "ntthong.degoholding@gmail.com" }
        ];
        localStorage.setItem('nhanSuData', JSON.stringify(nhanSuData));
    }

    // --- Print Function ---
    function printRequest(req) {
        const updateDateEl = document.getElementById('print-update-date');
        if (updateDateEl) updateDateEl.innerText = req['Ngày tạo'] || '';
        
        const codeEl = document.getElementById('print-code');
        if (codeEl) codeEl.innerText = req['Mã PYC'] || '';
        
        const codeSubEl = document.getElementById('print-code-sub');
        if (codeSubEl) codeSubEl.innerText = req['Hiển thị Mã'] === false ? '.....' : (req['Mã PYC'] || '');
        
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
        
        document.getElementById('print-company-name').innerText = (req['Tên Đầy Đủ CTY'] || req['Đơn vị'] || 'CÔNG TY TNHH DEGO HOLDING').toUpperCase();
        
        document.getElementById('print-requester').innerText = req['Nhân sự YC'] || '';
        document.getElementById('print-role').innerText = req['Chức vụ'] || '';
        document.getElementById('print-dept').innerText = req['Bộ phận YC'] || '';
        document.getElementById('print-manager').innerText = req['TBP'] || '';
        
        document.getElementById('print-purpose').innerText = req['Mục đích'] || req['Nội dung yêu cầu'] || '';
        document.getElementById('print-deadline').innerText = req['Ngày YC trả Kết quả'] || '';
        
        // Chi tiết
        document.getElementById('print-content').innerText = req['Nội dung mua hàng'] || '';

        // NCC
        const nccSection = document.getElementById('print-ncc-section');
        nccSection.style.display = 'block';
        document.getElementById('print-ncc').innerText = req['Nhà cung cấp'] || '';
        document.getElementById('print-ncc-mst').innerText = req['MST NCC'] || '';
        document.getElementById('print-ncc-lienhe').innerText = req['Liên hệ NCC'] || '';
        
        const hasAttach = req['Có đính kèm'] || false;
        document.getElementById('print-baogia-co').innerText = hasAttach ? '✔' : '';
        document.getElementById('print-baogia-khong').innerText = !hasAttach ? '✔' : '';
        
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
    const supplierTbody = document.getElementById('supplier-table-body');

    async function loadSuppliers() {
        if (!supplierTbody) return;
        suppliers = JSON.parse(localStorage.getItem('nccData')) || [];
        renderSupplierTable();
    }

    function renderSupplierTable() {
        supplierTbody.innerHTML = '';
        if (suppliers.length === 0) {
            supplierTbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Chưa có Nhà cung cấp nào</td></tr>';
            return;
        }

        suppliers.forEach((sup, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${sup.mst || ''}</strong></td>
                <td>${sup.name || ''}</td>
                <td><span class="badge badge-admin">Chung</span></td>
                <td>${sup.address || ''}</td>
                <td></td>
                <td class="text-right">
                    <div class="action-buttons">
                        <button class="btn-action edit-supplier" data-index="${index}">Sửa</button>
                    </div>
                </td>
            `;
            supplierTbody.appendChild(tr);
        });

        document.querySelectorAll('.edit-supplier').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.getAttribute('data-index');
                const data = suppliers[idx];
                document.getElementById('ncc-index').value = idx;
                document.getElementById('ncc-name').value = data.name;
                document.getElementById('ncc-address').value = data.address || '';
                document.getElementById('ncc-mst').value = data.mst || '';
                document.getElementById('modal-ncc-title').innerText = 'Sửa Nhà cung cấp';
                document.getElementById('modal-ncc').style.display = 'flex';
            });
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
            document.getElementById('ncc-index').value = '-1';
            document.getElementById('form-ncc').reset();
            document.getElementById('modal-ncc-title').innerText = 'Thêm Nhà cung cấp';
            document.getElementById('modal-ncc').style.display = 'flex';
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
            const currentWidth = parseFloat(getComputedStyle(root).getPropertyValue('--sidebar-width'));
            localStorage.setItem('thu_mua_sidebar_width', currentWidth);
        }
    });

    // --- DATA CHUNG (Cấu hình) Logic ---
    function renderDonViTable() {
        const tbody = document.getElementById('donvi-table-body');
        if(!tbody) return;
        tbody.innerHTML = '';
        donViData.forEach((d, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${d.shortName}</strong></td>
                <td>${d.fullName}</td>
                <td>${d.address || ''}</td>
                <td>${d.mst || ''}</td>
                <td class="text-right" style="white-space: nowrap; min-width: 80px;">
                    <button type="button" class="btn-remove-row edit-donvi" onclick="window.editDonVi(${index})" style="margin-right: 5px; color: var(--primary-color); border-color: var(--primary-color);">✏️</button>
                    <button type="button" class="btn-remove-row del-donvi" onclick="window.delDonVi(${index})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        window.delDonVi = function(idx) {
            if(confirm('Bạn có chắc muốn xoá?')) {
                donViData.splice(idx, 1);
                localStorage.setItem('donViData', JSON.stringify(donViData));
                renderDonViTable();
            }
        };

        window.editDonVi = function(idx) {
            const d = donViData[idx];
            document.getElementById('donvi-index').value = idx;
            document.getElementById('donvi-short').value = d.shortName;
            document.getElementById('donvi-full').value = d.fullName;
            document.getElementById('donvi-address').value = d.address || '';
            document.getElementById('donvi-mst').value = d.mst || '';
            document.getElementById('modal-donvi-title').innerText = 'Sửa Đơn vị';
            document.getElementById('modal-donvi').style.display = 'flex';
        };
    }

    function renderNhanSuTable() {
        const tbody = document.getElementById('nhansu-table-body');
        if(!tbody) return;
        tbody.innerHTML = '';
        nhanSuData.forEach((ns, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${ns.name}</strong></td>
                <td>${ns.dept || ''}</td>
                <td>${ns.role || 'Nhân sự'}</td>
                <td>${ns.manager || ''}</td>
                <td>${ns.phone || ''}</td>
                <td>${ns.email || ''}</td>
                <td class="text-right" style="white-space: nowrap; min-width: 80px;">
                    <button type="button" class="btn-remove-row edit-nhansu" onclick="window.editNhanSu(${index})" style="margin-right: 5px; color: var(--primary-color); border-color: var(--primary-color);">✏️</button>
                    <button type="button" class="btn-remove-row del-nhansu" onclick="window.delNhanSu(${index})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        window.delNhanSu = function(idx) {
            if(confirm('Bạn có chắc muốn xoá?')) {
                nhanSuData.splice(idx, 1);
                localStorage.setItem('nhanSuData', JSON.stringify(nhanSuData));
                renderNhanSuTable();
            }
        };

        window.editNhanSu = function(idx) {
            const ns = nhanSuData[idx];
            document.getElementById('nhansu-index').value = idx;
            document.getElementById('ns-name').value = ns.name;
            document.getElementById('ns-dept').value = ns.dept || '';
            document.getElementById('ns-role').value = ns.role || 'Nhân sự';
            document.getElementById('ns-manager').value = ns.manager || '';
            document.getElementById('ns-phone').value = ns.phone || '';
            document.getElementById('ns-email').value = ns.email || '';
            document.getElementById('modal-nhansu-title').innerText = 'Sửa Nhân sự';
            document.getElementById('modal-nhansu').style.display = 'flex';
        };
    }

    function renderDepartmentsTable() {
        const tbody = document.getElementById('departments-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        departmentsData.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.dept || ''}</td>
                <td>${item.manager || ''}</td>
                <td>${item.email || ''}</td>
                <td class="text-right" style="white-space: nowrap; min-width: 80px;">
                    <button type="button" class="btn-remove-row edit-dept" onclick="window.editDept(${index})" style="margin-right: 5px; color: var(--primary-color); border-color: var(--primary-color);">✏️</button>
                    <button type="button" class="btn-remove-row delete-dept" onclick="window.delDept(${index})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        window.editDept = function(idx) {
            const d = departmentsData[idx];
            document.getElementById('departments-index').value = idx;
            document.getElementById('dept-name').value = d.dept;
            document.getElementById('dept-manager').value = d.manager || '';
            document.getElementById('dept-email').value = d.email || '';
            document.getElementById('modal-departments-title').innerText = 'Sửa Phòng ban';
            document.getElementById('modal-departments').style.display = 'flex';
        };

        window.delDept = function(idx) {
            if (confirm('Xóa Phòng ban này?')) {
                departmentsData.splice(idx, 1);
                localStorage.setItem('departmentsData', JSON.stringify(departmentsData));
                renderDepartmentsTable();
                populateNsDeptDropdown();
            }
        };
    }

    const modalDepartments = document.getElementById('modal-departments');
    if (modalDepartments) {
        document.getElementById('btn-add-departments').addEventListener('click', () => {
            document.getElementById('form-departments').reset();
            document.getElementById('departments-index').value = '-1';
            document.getElementById('modal-departments-title').innerText = 'Thêm Phòng ban';
            modalDepartments.style.display = 'flex';
        });
        document.getElementById('btn-close-departments').addEventListener('click', () => modalDepartments.style.display = 'none');
        document.getElementById('btn-cancel-departments').addEventListener('click', () => modalDepartments.style.display = 'none');
        document.getElementById('form-departments').addEventListener('submit', (e) => {
            e.preventDefault();
            const idx = parseInt(document.getElementById('departments-index').value);
            const data = {
                dept: document.getElementById('dept-name').value,
                manager: document.getElementById('dept-manager').value,
                email: document.getElementById('dept-email').value
            };
            if (idx >= 0) { departmentsData[idx] = data; } else { departmentsData.push(data); }
            localStorage.setItem('departmentsData', JSON.stringify(departmentsData));
            renderDepartmentsTable();
            populateNsDeptDropdown();
            modalDepartments.style.display = 'none';
        });
    }

    function populateNsDeptDropdown() {
        const select = document.getElementById('ns-dept');
        if (!select) return;
        const oldVal = select.value;
        select.innerHTML = '<option value="">-- Chọn Phòng ban --</option>';
        departmentsData.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.dept;
            opt.textContent = d.dept;
            select.appendChild(opt);
        });
        select.value = oldVal;
    }
    
    const nsDept = document.getElementById('ns-dept');
    if (nsDept) {
        nsDept.addEventListener('change', (e) => {
            const val = e.target.value;
            const deptObj = departmentsData.find(d => d.dept === val);
            const nsManager = document.getElementById('ns-manager');
            if (deptObj) {
                nsManager.value = deptObj.manager;
            } else {
                nsManager.value = '';
            }
        });
    }

    // Modal DonVi Events
    const modalDonVi = document.getElementById('modal-donvi');
    if (modalDonVi) {
        document.getElementById('btn-add-donvi').addEventListener('click', () => {
            document.getElementById('form-donvi').reset();
            document.getElementById('donvi-index').value = '-1';
            document.getElementById('modal-donvi-title').innerText = 'Thêm Đơn vị';
            modalDonVi.style.display = 'flex';
        });
        document.getElementById('btn-close-donvi').addEventListener('click', () => modalDonVi.style.display = 'none');
        document.getElementById('btn-cancel-donvi').addEventListener('click', () => modalDonVi.style.display = 'none');
        document.getElementById('form-donvi').addEventListener('submit', (e) => {
            e.preventDefault();
            const idx = parseInt(document.getElementById('donvi-index').value);
            const data = {
                shortName: document.getElementById('donvi-short').value,
                fullName: document.getElementById('donvi-full').value,
                address: document.getElementById('donvi-address').value,
                mst: document.getElementById('donvi-mst').value
            };
            if (idx >= 0) { donViData[idx] = data; } else { donViData.push(data); }
            localStorage.setItem('donViData', JSON.stringify(donViData));
            renderDonViTable();
            modalDonVi.style.display = 'none';
        });
    }

    // Modal NhanSu Events
    const modalNhanSu = document.getElementById('modal-nhansu');
    if (modalNhanSu) {
        document.getElementById('btn-add-nhansu').addEventListener('click', () => {
            document.getElementById('form-nhansu').reset();
            document.getElementById('nhansu-index').value = '-1';
            document.getElementById('modal-nhansu-title').innerText = 'Thêm Nhân sự & Phân bổ';
            modalNhanSu.style.display = 'flex';
        });
        document.getElementById('btn-close-nhansu').addEventListener('click', () => modalNhanSu.style.display = 'none');
        document.getElementById('btn-cancel-nhansu').addEventListener('click', () => modalNhanSu.style.display = 'none');
        document.getElementById('form-nhansu').addEventListener('submit', (e) => {
            e.preventDefault();
            const idx = parseInt(document.getElementById('nhansu-index').value);
            const data = {
                name: document.getElementById('ns-name').value,
                dept: document.getElementById('ns-dept').value,
                role: document.getElementById('ns-role').value,
                manager: document.getElementById('ns-manager').value,
                phone: document.getElementById('ns-phone').value,
                email: document.getElementById('ns-email').value
            };
            if (idx >= 0) { nhanSuData[idx] = data; } else { nhanSuData.push(data); }
            localStorage.setItem('nhanSuData', JSON.stringify(nhanSuData));
            renderNhanSuTable();
            modalNhanSu.style.display = 'none';
        });
    }

    renderDonViTable();
    renderNhanSuTable();
    renderNccTable();
    renderDepartmentsTable();
    populateNsDeptDropdown();

    
    function renderNccTable() {
        const tbody = document.getElementById('ncc-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        nccData.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name || ''}</td>
                <td>${item.address || ''}</td>
                <td>${item.mst || ''}</td>
                <td class="text-right" style="white-space: nowrap; min-width: 80px;">
                    <button type="button" class="btn-remove-row edit-ncc" onclick="window.editNcc(${index})" style="margin-right: 5px; color: var(--primary-color); border-color: var(--primary-color);">✏️</button>
                    <button type="button" class="btn-remove-row delete-ncc" onclick="window.delNcc(${index})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Moved window.editNcc to global scope

        window.delNcc = function(idx) {
            if (confirm('Xóa NCC này?')) {
                nccData.splice(idx, 1);
                localStorage.setItem('nccData', JSON.stringify(nccData));
                renderNccTable();
                populateNccDatalist();
            }
        };
    }

    // Modal NCC Events
    const modalNcc = document.getElementById('modal-ncc');
    if (modalNcc) {
        // Replaced by global listener
        document.getElementById('btn-close-ncc').addEventListener('click', () => modalNcc.style.display = 'none');
        document.getElementById('btn-cancel-ncc').addEventListener('click', () => modalNcc.style.display = 'none');
        document.getElementById('form-ncc').addEventListener('submit', (e) => {
            e.preventDefault();
            const idx = parseInt(document.getElementById('ncc-index').value);
            const dataObj = {
                name: document.getElementById('ncc-name').value,
                address: document.getElementById('ncc-address').value,
                mst: document.getElementById('ncc-mst').value
            };
            if (idx >= 0) { nccData[idx] = dataObj; } else { nccData.push(dataObj); }
            localStorage.setItem('nccData', JSON.stringify(nccData));
            renderNccTable();
            if (typeof loadSuppliers === 'function') loadSuppliers();
            populateNccDatalist();
            modalNcc.style.display = 'none';
        });
    }

    function populateNccDatalist() {
        const datalist = document.getElementById('ncc-datalist');
        if (!datalist) return;
        datalist.innerHTML = '';
        nccData.forEach(item => {
            const option = document.createElement('option');
            option.value = item.name;
            datalist.appendChild(option);
        });
    }

    const nccInput = document.getElementById('pyc-ncc');
    if (nccInput) {
        $('#pyc-ncc').on('change', (e) => {
            const val = e.target.value;
            const nccObj = nccData.find(d => d.name === val);
            if (nccObj) {
                document.getElementById('pyc-ncc-mst').value = nccObj.mst || '';
                const lienhe = document.getElementById('pyc-ncc-lienhe');
                if (!lienhe.value && nccObj.address) {
                    lienhe.value = nccObj.address;
                }
            }
        });
    }

    // Toggle Sidebar
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
        });
    }

    // --- CSV Import / Export Utilities ---
    function downloadCSV(csv, filename) {
        let csvFile = new Blob(["\uFEFF"+csv], {type: "text/csv;charset=utf-8;"});
        let downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    function exportToCSV(dataArray, keyMap, filename) {
        if (!dataArray || dataArray.length === 0) {
            alert("Không có dữ liệu để Export!");
            return;
        }
        const headers = Object.keys(keyMap);
        let csv = headers.join(",") + "\n";
        dataArray.forEach(row => {
            let values = headers.map(header => {
                let val = row[keyMap[header]] || "";
                return '"' + String(val).replace(/"/g, '""') + '"';
            });
            csv += values.join(",") + "\n";
        });
        downloadCSV(csv, filename);
    }

    function importFromCSV(file, keyMapReversed, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
            if (lines.length < 2) { alert("File CSV rỗng hoặc không hợp lệ!"); return; }
            
            const headers = lines[0].split(",").map(h => h.replace(/(^"|"$)/g, '').trim());
            const result = [];
            for (let i = 1; i < lines.length; i++) {
                // Basic CSV regex split ignoring commas inside quotes
                const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/(^"|"$)/g, '').trim());
                let obj = {};
                headers.forEach((h, index) => {
                    const internalKey = keyMapReversed[h];
                    if (internalKey) {
                        obj[internalKey] = currentline[index] || "";
                    }
                });
                result.push(obj);
            }
            callback(result);
        };
        reader.readAsText(file);
    }

    // --- Bind CSV Events ---
    // NCC
    const btnExportNcc = document.getElementById('btn-export-ncc');
    if (btnExportNcc) {
        btnExportNcc.addEventListener('click', () => {
            const map = {"Tên Nhà Cung Cấp": "name", "Địa chỉ": "address", "MST": "mst"};
            exportToCSV(nccData, map, "Danh_Sach_NCC.csv");
        });
    }
    const importNccFile = document.getElementById('import-ncc-file');
    if (importNccFile) {
        importNccFile.addEventListener('change', (e) => {
            if (!e.target.files[0]) return;
            const map = {"Tên Nhà Cung Cấp": "name", "Địa chỉ": "address", "MST": "mst"};
            importFromCSV(e.target.files[0], map, (res) => {
                if(res.length > 0) {
                    nccData = nccData.concat(res);
                    localStorage.setItem('nccData', JSON.stringify(nccData));
                    renderNccTable();
                    alert(`Đã import thành công ${res.length} nhà cung cấp!`);
                }
            });
            e.target.value = '';
        });
    }

    // Nhân sự
    const btnExportNhanSu = document.getElementById('btn-export-nhansu');
    if (btnExportNhanSu) {
        btnExportNhanSu.addEventListener('click', () => {
            const map = {"Họ và Tên": "name", "Phòng ban": "dept", "Vai trò": "role", "Trưởng bộ phận": "manager", "SĐT": "phone", "Email": "email"};
            exportToCSV(nhanSuData, map, "Danh_Sach_Nhan_Su.csv");
        });
    }
    const importNhanSuFile = document.getElementById('import-nhansu-file');
    if (importNhanSuFile) {
        importNhanSuFile.addEventListener('change', (e) => {
            if (!e.target.files[0]) return;
            const map = {"Họ và Tên": "name", "Phòng ban": "dept", "Vai trò": "role", "Trưởng bộ phận": "manager", "SĐT": "phone", "Email": "email"};
            importFromCSV(e.target.files[0], map, (res) => {
                if(res.length > 0) {
                    nhanSuData = nhanSuData.concat(res);
                    localStorage.setItem('nhanSuData', JSON.stringify(nhanSuData));
                    renderNhanSuTable();
                    alert(`Đã import thành công ${res.length} nhân sự!`);
                }
            });
            e.target.value = '';
        });
    }

    // Đơn vị
    const btnExportDonVi = document.getElementById('btn-export-donvi');
    if (btnExportDonVi) {
        btnExportDonVi.addEventListener('click', () => {
            const map = {"Tên Ngắn Gọn": "shortName", "Tên Đầy Đủ": "fullName", "Địa Chỉ": "address", "MST": "mst"};
            exportToCSV(donViData, map, "Danh_Sach_Don_Vi.csv");
        });
    }
    const importDonViFile = document.getElementById('import-donvi-file');
    if (importDonViFile) {
        importDonViFile.addEventListener('change', (e) => {
            if (!e.target.files[0]) return;
            const map = {"Tên Ngắn Gọn": "shortName", "Tên Đầy Đủ": "fullName", "Địa Chỉ": "address", "MST": "mst"};
            importFromCSV(e.target.files[0], map, (res) => {
                if(res.length > 0) {
                    donViData = donViData.concat(res);
                    localStorage.setItem('donViData', JSON.stringify(donViData));
                    renderDonViTable();
                    alert(`Đã import thành công ${res.length} đơn vị!`);
                }
            });
            e.target.value = '';
        });
    }

    // Phòng ban
    const btnExportDepartments = document.getElementById('btn-export-departments');
    if (btnExportDepartments) {
        btnExportDepartments.addEventListener('click', () => {
            const map = {"Phòng ban": "dept", "Trưởng bộ phận": "manager", "Email TBP": "email"};
            exportToCSV(departmentsData, map, "Danh_Sach_Phong_Ban.csv");
        });
    }
    const importDepartmentsFile = document.getElementById('import-departments-file');
    if (importDepartmentsFile) {
        importDepartmentsFile.addEventListener('change', (e) => {
            if (!e.target.files[0]) return;
            const map = {"Phòng ban": "dept", "Trưởng bộ phận": "manager", "Email TBP": "email"};
            importFromCSV(e.target.files[0], map, (res) => {
                if(res.length > 0) {
                    departmentsData = departmentsData.concat(res);
                    localStorage.setItem('departmentsData', JSON.stringify(departmentsData));
                    renderDepartmentsTable();
                    populateNsDeptDropdown();
                    alert(`Đã import thành công ${res.length} phòng ban!`);
                }
            });
            e.target.value = '';
        });
    }

});


// --- GLOBAL EVENT DELEGATION & FUNCTIONS ---
window.editNcc = function(idx) {
    try {
        let nccData = JSON.parse(localStorage.getItem('nccData')) || [];
        const data = nccData[idx];
        if (!data) { alert('Không tìm thấy dữ liệu NCC tại index ' + idx); return; }
        document.getElementById('ncc-index').value = idx;
        document.getElementById('ncc-name').value = data.name || '';
        document.getElementById('ncc-address').value = data.address || '';
        document.getElementById('ncc-mst').value = data.mst || '';
        document.getElementById('modal-ncc-title').innerText = 'Sửa NCC';
        const modal = document.getElementById('modal-ncc');
        if (modal) { modal.style.display = 'flex'; } else { alert('Lỗi: Không tìm thấy modal-ncc (Sửa)'); }
    } catch (err) {
        alert('Lỗi sửa NCC (Global): ' + err.message);
        console.error(err);
    }
};

document.addEventListener('click', function(e) {
    if (e.target && (e.target.id === 'btn-add-ncc' || e.target.closest('#btn-add-ncc'))) {
        e.preventDefault();
        const modal = document.getElementById('modal-ncc');
        if (modal) {
            document.getElementById('form-ncc').reset();
            document.getElementById('ncc-index').value = '-1';
            document.getElementById('modal-ncc-title').innerText = 'Thêm NCC';
            modal.style.display = 'flex';
        } else {
            alert('Lỗi: Không tìm thấy modal-ncc trong HTML (Thêm NCC)');
        }
    }
});
