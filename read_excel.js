const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('D:\\01.Soft\\pltgiang\\Bao cao lo trinh phat trien Dego ERP\\Pltgiang Tasklist công việc tổng thể v3.0 20260623.xlsx');
const sheetName = wb.SheetNames[0]; // Assuming data is on first sheet
const data = xlsx.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 });

const headers = data[0];
const rows = data.slice(1);

let stats = {
    total: 0,
    byCategory: {},
    byStatus: {}
};

let erpTasks = [];

rows.forEach(row => {
    if (!row || row.length < 5) return;
    const category = row[1];
    const taskName = row[2];
    const status = row[4];
    const startDate = row[7];
    const endDate = row[8];
    
    if (category) {
        stats.total++;
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
        
        if (typeof taskName === 'string' && (taskName.toLowerCase().includes('erp') || taskName.toLowerCase().includes('ggs') || category.includes('Lập trình'))) {
            erpTasks.push({
                category,
                taskName,
                status,
                startDate,
                endDate
            });
        }
    }
});

fs.writeFileSync('D:\\01.Soft\\pltgiang\\thu_mua_tool\\summary.json', JSON.stringify({ stats, erpTasks }, null, 2));
console.log("Summary saved to summary.json");
