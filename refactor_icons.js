const fs = require('fs');
const path = require('path');

const dir = 'd:/01.Soft/pltgiang/thu_mua_tool/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const iconMap = {
  'EditOutlined': 'Pencil',
  'DeleteOutlined': 'Trash2',
  'PlusOutlined': 'Plus',
  'UploadOutlined': 'Upload',
  'CheckCircleOutlined': 'CheckCircle',
  'CloseCircleOutlined': 'XCircle',
  'PrinterOutlined': 'Printer',
  'UserOutlined': 'User',
  'SafetyCertificateOutlined': 'ShieldCheck',
  'ShoppingCartOutlined': 'ShoppingCart',
  'CarOutlined': 'Car',
  'LockOutlined': 'Lock',
  'MailOutlined': 'Mail',
  'DownloadOutlined': 'Download'
};

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the ant-design import
  const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]@ant-design\/icons['"];?/);
  
  if (importMatch) {
    const importedIcons = importMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    const lucideIconsToImport = new Set();
    
    // Replace icon usages
    importedIcons.forEach(antIcon => {
      const lucideIcon = iconMap[antIcon];
      if (lucideIcon) {
        lucideIconsToImport.add(lucideIcon);
        // Replace <IconName /> with <IconName size={16} />
        // Note: some might have props like <IconName style={{...}} />
        // We'll just replace the tag name
        const tagRegex = new RegExp(`<${antIcon}(\\s|>)`, 'g');
        content = content.replace(tagRegex, `<${lucideIcon} size={16}$1`);
      }
    });

    // Replace the import statement
    const lucideImportStr = `import { ${Array.from(lucideIconsToImport).join(', ')} } from 'lucide-react';`;
    content = content.replace(importMatch[0], lucideImportStr);
    
    // Also, lucide icons might need to merge imports if lucide-react is already imported
    // But typically pages don't import lucide-react yet (except maybe Layout).
    // Let's check if there's already a lucide-react import
    if (content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/g)?.length > 1) {
      // Very naive fix for multiple lucide imports
      console.log(`WARNING: Multiple lucide-react imports in ${f}`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Refactored icons in ${f}`);
  }
});
