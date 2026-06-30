-- DDL cho Hệ thống Thu mua (Thu Mua Tool)
-- Chú ý: Đây là bản thiết kế Database tham khảo (MySQL / PostgreSQL) cho quá trình triển khai Backend sau này.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(50) NOT NULL, -- NSYC, TBP, QLTM, NSTM, Admin
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pyc_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pyc_code VARCHAR(50) NOT NULL UNIQUE,
    requester_username VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    manager_username VARCHAR(50), -- TBP
    purpose TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Chờ TBP duyệt', -- Chờ TBP duyệt, Đã duyệt TBP, Đã duyệt QLTM, Đã hủy
    total_amount DECIMAL(15, 2) DEFAULT 0,
    required_date DATE,
    received_date DATE,
    show_code_on_print BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (requester_username) REFERENCES users(username) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS pyc_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pyc_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    action_by VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pyc_id) REFERENCES pyc_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (action_by) REFERENCES users(username) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS pyc_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pyc_id INT NOT NULL,
    product_code VARCHAR(50),
    product_name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    estimated_price DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    note TEXT,
    assigned_to VARCHAR(50), -- Nhân sự thu mua được phân bổ (username)
    status VARCHAR(50) DEFAULT 'Chưa giao', -- Chưa giao, Chờ tiếp nhận, Đã tiếp nhận
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pyc_id) REFERENCES pyc_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(username) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS supplier_surveys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pyc_id INT, -- Có thể tham chiếu đến pyc_requests
    pyc_code VARCHAR(50), 
    product_category VARCHAR(100), -- Nhóm hàng
    survey_details TEXT, -- Yêu cầu chi tiết
    manager_approval_status VARCHAR(50) DEFAULT 'Chưa duyệt', -- Duyệt, Không duyệt, Chưa duyệt
    manager_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pyc_id) REFERENCES pyc_requests(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS survey_suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    survey_id INT NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(50),
    phone VARCHAR(50),
    contact_person VARCHAR(100),
    product_category_supplied VARCHAR(100),
    warehouse_address TEXT,
    map_link TEXT,
    quote_link TEXT,
    debt_policy VARCHAR(100),
    invoice_policy TEXT,
    reliability_level VARCHAR(50), -- Cao, Trung bình, Thấp
    production_time VARCHAR(100),
    delivery_policy TEXT,
    pt_evaluation VARCHAR(50), -- Đạt, Không đạt
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (survey_id) REFERENCES supplier_surveys(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_surveys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pyc_id INT, 
    pyc_code VARCHAR(50), 
    product_category VARCHAR(100),
    survey_details TEXT,
    manager_approval_status VARCHAR(50) DEFAULT 'Chưa duyệt',
    manager_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pyc_id) REFERENCES pyc_requests(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS survey_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_survey_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    technical_specs TEXT,
    origin VARCHAR(100),
    quote_unit VARCHAR(50),
    moq DECIMAL(10, 2),
    qty_range VARCHAR(50),
    price DECIMAL(15, 2),
    vat DECIMAL(5, 2),
    requested_qty DECIMAL(10, 2),
    shipping_fee DECIMAL(15, 2),
    delivery_time VARCHAR(100),
    lab_result VARCHAR(50), -- Đạt, Không đạt
    total_amount DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_survey_id) REFERENCES product_surveys(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_code VARCHAR(50) NOT NULL UNIQUE,
    pyc_id INT,
    company_name VARCHAR(255),
    supplier_name VARCHAR(255),
    supplier_address TEXT,
    supplier_tax_code VARCHAR(50),
    supplier_contact VARCHAR(100),
    supplier_phone VARCHAR(50),
    delivery_address TEXT,
    delivery_date DATE,
    delivery_time VARCHAR(50),
    receiver_name VARCHAR(100),
    receiver_phone VARCHAR(50),
    payment_terms TEXT,
    total_amount_before_vat DECIMAL(15, 2),
    total_vat_amount DECIMAL(15, 2),
    total_amount_after_vat DECIMAL(15, 2),
    discount_amount DECIMAL(15, 2),
    amount_in_words TEXT,
    status VARCHAR(50) DEFAULT 'Nháp',
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pyc_id) REFERENCES pyc_requests(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS po_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    specs TEXT,
    unit VARCHAR(50),
    quantity DECIMAL(10, 2),
    price DECIMAL(15, 2),
    amount DECIMAL(15, 2),
    vat_percent DECIMAL(5, 2),
    vat_amount DECIMAL(15, 2),
    total_amount DECIMAL(15, 2),
    note TEXT,
    
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE
);
