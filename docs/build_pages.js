const fs = require('fs');

const baocao = fs.readFileSync('BaoCao_Final_BanQuyen_DEGO_29-05-2026.html', 'utf8');
const tailieu = fs.readFileSync('TaiLieu_ThuMua_DEGO_Final.html', 'utf8');

// Extract CSS and base structure from baocao
const headEnd = baocao.indexOf('</head>');
const headHtml = baocao.substring(0, headEnd + 7);

const logoSvgStr = baocao.match(/<div class="logo">([\s\S]*?)<\/div>/)[1];

const buildPage = (content, pageNum, totalPages) => {
  return `
<div class="page">
<div class="rh">
  <div class="logo">${logoSvgStr}</div>
  <div class="rh-meta"><b>TÀI LIỆU HƯỚNG DẪN & KIỂM THỬ</b><i>ERP SYSTEM MANUAL</i>
    Mã văn bản: ERP-THUMUA-2026.05.30<br>Phiên bản: FINAL v1.1</div>
</div>

${content}

<div class="rf">
  <div class="rf-row"><span class="l">DEGO HOLDING · Cần Thơ, Việt Nam</span><span class="c">Tài liệu nội bộ · Lưu hành hạn chế</span><span class="r">Trang ${pageNum} / ${totalPages}</span></div>
  <div class="rf-sub">Tài liệu hệ thống ERP · Phân hệ Thu Mua · Cập nhật: 30/05/2026</div>
</div>
</div>
`;
};

// Extract sections from tailieu
const tTitle = tailieu.match(/<h1 class="doc-title">.*?<\/h1>/)[0];
const tSubtitle = tailieu.match(/<p class="doc-subtitle">.*?<\/p>/)[0];
const tMeta = tailieu.match(/<table class="meta">[\s\S]*?<\/table>/)[0];

const p1Start = tailieu.indexOf('<div class="part-label">PHẦN I - HƯỚNG DẪN SỬ DỤNG</div>');
const p2Start = tailieu.indexOf('<div class="section mt-20 page-break-before"><div class="num">2</div>');
const p3Start = tailieu.indexOf('<div class="section mt-20"><div class="num">3</div>');
const p4Start = tailieu.indexOf('<div class="section mt-20 page-break-before"><div class="num">4</div>');

let contentP1 = tailieu.substring(p1Start, p2Start).trim();
let contentP2 = tailieu.substring(p2Start, p3Start).replace('<div class="section mt-20 page-break-before">', '<div class="section">').trim();
let contentP3 = tailieu.substring(p3Start, p4Start).replace('<div class="section mt-20">', '<div class="section">').trim();

// Add title/meta to page 1
const fullP1 = tTitle + '\n' + tSubtitle + '\n' + tMeta + '\n' + contentP1;

// Rename the title to v1.1
const updatedP1 = fullP1.replace('1.0 (Final)', '1.1 (Final)');

const newHtml = headHtml + '\n<body>\n' + buildPage(updatedP1, 1, 3) + buildPage(contentP2, 2, 3) + buildPage(contentP3, 3, 3) + '\n</body></html>';

fs.writeFileSync('Module_thu_mua_3trang_dau.html', newHtml);
