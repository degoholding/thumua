export const exportToCSV = (dataList, filename) => {
  if (!dataList || !dataList.length) return;

  const headers = Object.keys(dataList[0]).filter(k => k !== 'key' && k !== 'index');
  
  const csvRows = [];
  // Header row
  csvRows.push(headers.join(','));

  // Data rows
  for (const row of dataList) {
    const values = headers.map(header => {
      let val = row[header];
      if (val === null || val === undefined) val = '';
      const str = String(val);
      // Escape quotes and wrap in quotes if contains comma, newline, or quote
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    csvRows.push(values.join(','));
  }

  // Add UTF-8 BOM so Excel opens it with correct Vietnamese characters
  const csvString = '\uFEFF' + csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
