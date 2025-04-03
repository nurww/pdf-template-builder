import React, { useState } from 'react';
import PDFViewer from './components/PDFViewer';
import ExcelPanel from './components/ExcelPanel';
import * as XLSX from 'xlsx';
import { ExcelRow } from './types';

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfFile(file);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const data: ExcelRow[] = XLSX.utils.sheet_to_json(ws);
      if (data.length > 0) {
        const columns = Object.keys(data[0]);
        setExcelColumns(columns);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ width: '250px', borderRight: '1px solid #ddd', padding: '10px' }}>
          <h3>Загрузка</h3>
          <input type="file" accept="application/pdf" onChange={handlePDFUpload} />
          <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} />
          <ExcelPanel columns={excelColumns} />
        </div>
        <div style={{ flex: 1 }}>
          {pdfFile ? <PDFViewer file={pdfFile} /> : <p style={{ padding: '20px' }}>Загрузите PDF</p>}
        </div>
      </div>
  );
};

export default App;
