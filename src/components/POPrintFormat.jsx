import React from 'react';
import dayjs from 'dayjs';

const POPrintFormat = ({ doc }) => {
  if (!doc) return null;

  // Helpers
  const formatVnNum = (val) => {
    if (val === null || val === undefined) return "0";
    // Định dạng kiểu 1.000,50 (dấu chấm phân cách hàng ngàn, phẩy phân cách thập phân)
    // Javascript toLocaleString('vi-VN') gives this standard behavior
    return Number(val).toLocaleString('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  };

  const transDate = doc.transaction_date ? dayjs(doc.transaction_date) : dayjs();

  return (
    <div className="print-container">
      <style>
        {`
          @media print {
              @page {
                  size: A4 landscape;
                  margin: 6mm !important;
              }
              body * {
                  visibility: hidden;
              }
              .print-container, .print-container * {
                  visibility: visible;
              }
              .print-container {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  margin: 0;
                  padding: 0;
              }
              body {
                  margin: 0 !important;
                  padding: 0 !important;
              }
          }

          .print-format-po {
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
              max-width: 297mm !important;
              min-height: 210mm !important;
              font-family: "Arial", sans-serif;
              color: #000;
              line-height: 1.3;
              font-size: 10px;
              box-sizing: border-box;
          }

          .print-format-po .gold-top-bar {
              height: 4px;
              background-color: #f1a417;
              margin-bottom: 8px;
          }

          .print-format-po .company-header {
              margin-bottom: 10px;
          }

          .print-format-po .company-name {
              font-weight: bold;
              font-size: 13px;
              color: #000;
          }

          .print-format-po .company-detail {
              font-size: 10px;
              color: #333;
          }

          .print-format-po .supplier-info {
              margin-top: 8px;
              margin-bottom: 8px;
              font-size: 10px;
          }

          .print-format-po .document-title {
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              margin-top: 8px;
              margin-bottom: 8px;
              letter-spacing: 1px;
          }

          .print-format-po .document-no {
              color: red;
              font-size: 10px;
              font-weight: bold;
              margin-top: 3px;
          }

          .print-format-po .po-items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 8px;
              font-size: 9px;
              table-layout: fixed;
              word-wrap: break-word;
          }

          .print-format-po .po-items-table th,
          .print-format-po .po-items-table td {
              border: 1px solid #000;
              padding: 3px 2px;
              vertical-align: middle;
              word-break: break-word;
          }

          .print-format-po .po-items-table th {
              background-color: #e2efda;
              font-weight: bold;
              text-align: center;
              font-size: 9px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
          }

          .print-format-po .po-items-table tr.total-row td {
              background-color: #f2f2f2;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
          }

          .print-format-po .agreements-section {
              margin-top: 10px;
              font-size: 10px;
          }

          .print-format-po .agreement-title {
              font-weight: bold;
              font-style: italic;
              margin-bottom: 5px;
          }

          .print-format-po .agreement-item {
              margin-bottom: 4px;
          }

          .print-format-po .item-num {
              font-weight: bold;
          }

          .print-format-po .item-val {
              margin-left: 5px;
          }

          .print-format-po .sub-item {
              margin-left: 20px;
              margin-top: 3px;
          }

          .print-format-po .attached-info {
              margin-top: 12px;
          }

          .print-format-po .signature-section {
              margin-top: 15px;
              page-break-inside: avoid;
              font-size: 10px;
          }

          .print-format-po .signature-date {
              text-align: right;
              font-style: italic;
              margin-bottom: 10px;
              padding-right: 5%;
          }

          .print-format-po .signature-table {
              width: 100%;
              border-collapse: collapse;
          }

          .print-format-po .signature-table td {
              border: none !important;
          }

          .print-format-po .nowrap-col {
              white-space: nowrap;
          }
        `}
      </style>

      <div className="print-format-po">
        <div className="gold-top-bar"></div>

        <div className="company-header">
          <div className="company-name">{(doc.company_name || doc.company || "CÔNG TY TNHH DEGO HOLDING").toUpperCase()}</div>
          <div className="company-detail">Địa chỉ: {doc.company_address_display || "Chưa cấu hình địa chỉ công ty"}</div>
          <div className="company-detail">Mã số thuế: {doc.company_tax_id || ""}</div>
        </div>

        <div className="supplier-info">
          <div><strong>Kính gửi:</strong> {(doc.supplier_name || doc.supplier || "").toUpperCase()}</div>
          <div><strong>Địa chỉ:</strong> {doc.supplier_address_display || ""}</div>
        </div>

        <div className="document-title">
          ĐƠN ĐẶT HÀNG
          <div className="document-no">Số: {doc.name || doc.poCode}</div>
        </div>

        <table className="po-items-table">
          <thead>
            <tr>
              <th style={{ width: '3%', textAlign: 'center' }} className="nowrap-col">STT</th>
              <th style={{ width: '10%', textAlign: 'center' }}>Mã</th>
              <th style={{ width: '16%', textAlign: 'left' }}>Tên hàng hóa</th>
              <th style={{ width: '9%', textAlign: 'left' }}>Xuất xứ/ TSKT/ chất liệu</th>
              <th style={{ width: '4%', textAlign: 'center' }} className="nowrap-col">ĐVT</th>
              <th style={{ width: '5%', textAlign: 'right' }} className="nowrap-col">SL</th>
              <th style={{ width: '9%', textAlign: 'right' }}>Đơn giá (Chưa VAT)</th>
              <th style={{ width: '4%', textAlign: 'center' }} className="nowrap-col">VAT</th>
              <th style={{ width: '9%', textAlign: 'right' }}>Đơn giá (Đã VAT)</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Thành tiền</th>
              <th style={{ width: '7%', textAlign: 'left' }}>Kho nhận</th>
              <th style={{ width: '7%', textAlign: 'left' }}>Tên trên HĐ</th>
              <th style={{ width: '7%', textAlign: 'left' }}>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {(doc.items || []).map((item, index) => {
              const taxRate = Number(item.tax_rate) || 0;
              const qty = Number(item.qty) || 0;
              const rate = Number(item.rate) || 0; // Đơn giá chưa VAT
              const amountBeforeTax = qty * rate;
              const amountWithVat = amountBeforeTax * (1 + taxRate / 100);
              const rateWithVat = rate * (1 + taxRate / 100);

              return (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }} className="nowrap-col">{index + 1}</td>
                  <td style={{ textAlign: 'center', wordBreak: 'break-all' }}>{item.item_code}</td>
                  <td style={{ textAlign: 'left' }}>{item.item_name}</td>
                  <td style={{ textAlign: 'left' }}>{item.custom_item_specs || ""}</td>
                  <td style={{ textAlign: 'center' }} className="nowrap-col">{item.uom}</td>
                  <td style={{ textAlign: 'right' }} className="nowrap-col">{formatVnNum(qty)}</td>
                  <td style={{ textAlign: 'right' }} className="nowrap-col">{formatVnNum(rate)}</td>
                  <td style={{ textAlign: 'center' }} className="nowrap-col">{taxRate}%</td>
                  <td style={{ textAlign: 'right' }} className="nowrap-col">{formatVnNum(rateWithVat)}</td>
                  <td style={{ textAlign: 'right' }} className="nowrap-col">{formatVnNum(amountWithVat)}</td>
                  <td style={{ textAlign: 'left' }}>{(item.warehouse || "").replace(' - DHC', '')}</td>
                  <td style={{ textAlign: 'left' }}>{item.custom_invoice_name || ""}</td>
                  <td style={{ textAlign: 'left' }}>
                    {item.description && item.description !== item.item_name ? item.description : ""}
                  </td>
                </tr>
              );
            })}
            <tr className="total-row">
              <td colSpan="9" style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>TỔNG CỘNG</td>
              <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                {formatVnNum(
                  (doc.items || []).reduce((sum, item) => {
                    const qty = Number(item.qty) || 0;
                    const rate = Number(item.rate) || 0;
                    const taxRate = Number(item.tax_rate) || 0;
                    return sum + (qty * rate * (1 + taxRate / 100));
                  }, 0)
                )}
              </td>
              <td colSpan="3"></td>
            </tr>
          </tbody>
        </table>

        <div className="agreements-section">
          <div className="agreement-title">* Thoả thuận khác:</div>

          <div className="agreement-item">
            <span className="item-num">1. Thời gian thanh toán/ Số ngày công nợ:</span>
            <span className="item-val">{doc.payment_terms_template || "Công nợ 30 ngày"}</span>
          </div>

          <div className="agreement-item">
            <span className="item-num">2. Thời gian nhận hóa đơn:</span>
            <span className="item-val">{doc.custom_invoice_receive_time || "Chậm nhất 24h kể từ khi nhận hàng"}</span>
          </div>

          <div className="agreement-item">
            <span className="item-num">3. Thông tin nhận hàng:</span>
            <div className="sub-item">- Phương thức giao nhận: {doc.custom_delivery_method || ""}</div>
            <div className="sub-item">- Nơi giao: {doc.supplier_name || doc.supplier || ""}</div>
            <div className="sub-item">- Địa chỉ: {doc.supplier_address_display || ""}</div>
            <div className="sub-item">- Người liên hệ bên mua: {doc.custom_buyer_contact || ""}</div>
          </div>

          <div className="agreement-item">
            <span className="item-num">4. Thông tin nhận hóa đơn:</span>
            <div className="sub-item">- Tên đơn vị: {(doc.company_name || doc.company || "CÔNG TY TNHH DEGO HOLDING").toUpperCase()}</div>
            <div className="sub-item">- Mã số thuế: {doc.company_tax_id || ""}</div>
            <div className="sub-item">- Địa chỉ: {doc.company_address_display || "Chưa cấu hình địa chỉ công ty"}</div>
            <div className="sub-item">- Mail nhận hóa đơn: {doc.custom_billing_email || "phongsanxuat.luutru@gmail.com"}</div>
          </div>

          <div className="agreement-item">
            <span className="item-num">5. Hàng lỗi, sai mẫu:</span>
            <div className="sub-item">- Bên mua kiểm tra hàng trong vòng 15 ngày kể từ ngày nhận hàng.</div>
            <div className="sub-item">- Nếu hàng lỗi/sai mẫu, Bên mua thông báo kèm bằng chứng cho Bên bán.</div>
            <div className="sub-item">- Bên bán phải thu hồi, đổi trả trong vòng 07 ngày; mọi chi phí phát sinh do Bên bán chịu.</div>
          </div>

          <div className="attached-info">
            <strong>Các thông tin, file, hình ảnh gửi kèm đơn hàng:</strong> {doc.custom_attached_info || ""}
          </div>

          {doc.terms && (
            <div className="attached-info" style={{ marginTop: '15px' }}>
              <strong>Ghi chú / Điều khoản khác:</strong>
              <div style={{ marginLeft: '20px', marginTop: '5px', fontStyle: 'italic' }}>{doc.terms}</div>
            </div>
          )}
        </div>

        <div className="signature-section">
          <table className="signature-table">
            <tbody>
              <tr>
                <td style={{ width: '50%' }}></td>
                <td style={{ width: '50%', textAlign: 'center', fontStyle: 'italic' }}>
                  Cần Thơ, ngày {transDate.date()} tháng {transDate.month() + 1} năm {transDate.year()}
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>Trưởng bộ phận</td>
                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>Người lập</td>
              </tr>
              <tr style={{ height: '80px' }}>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default POPrintFormat;
