const fs = require('fs');
const htmlDocx = require('html-docx-js');

const htmlPath = 'C:\\Users\\Admin\\Downloads\\Xác Nhận Quy Trình Tạo Phiếu Yêu Cầu (PYC) · DEGO Holding-GGS.html';
const outPath = 'D:\\01.Soft\\pltgiang\\thu_mua_tool\\Quy_trinh_Tao_PYC_Converted.docx';

async function generate() {
    try {
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // MS Word / html-docx-js does not support CSS variables well, we replace known ones
        htmlContent = htmlContent.replace(/var\(--teal-dark\)/g, '#1E7F9C');
        htmlContent = htmlContent.replace(/var\(--line\)/g, '#D1D5DB');
        htmlContent = htmlContent.replace(/var\(--radius\)/g, '4px');
        htmlContent = htmlContent.replace(/var\(--teal-light\)/g, '#E8F3F8');
        htmlContent = htmlContent.replace(/var\(--orange\)/g, '#E67E22');

        // Make sure we have utf-8 charset for Vietnamese text
        if (!htmlContent.includes('charset="utf-8"') && htmlContent.includes('<head>')) {
            htmlContent = htmlContent.replace('<head>', '<head><meta charset="utf-8">');
        }

        const docxBlob = htmlDocx.asBlob(htmlContent);
        
        let buffer;
        if (docxBlob.arrayBuffer) {
            buffer = Buffer.from(await docxBlob.arrayBuffer());
        } else {
            // Some versions return a Buffer or something else
            buffer = docxBlob;
        }

        fs.writeFileSync(outPath, buffer);
        console.log('SUCCESS: Generated ' + outPath);
    } catch (error) {
        console.error('ERROR:', error);
    }
}

generate();
