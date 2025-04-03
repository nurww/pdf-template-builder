import React, { useState } from 'react';
import PDFViewer from './components/PDFViewer';
import ExcelPanel from './components/ExcelPanel';
import CanvasEditor from "./components/CanvasEditor";
import * as XLSX from 'xlsx';
import { FieldBoxData, ExcelRow } from './types';
import TemplateControls from './components/TemplateControls';

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [pdfSize, setPdfSize] = useState({ width: 800, height: 1000 });
  const [fields, setFields] = useState<FieldBoxData[]>([]);
  const [previewRow, setPreviewRow] = useState<ExcelRow | null>(null);

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
        setPreviewRow(data[0]); // ✅ теперь тут
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
        <div style={{ flex: 1, padding: '10px' }}>
          {pdfFile ? (
              <div style={{ position: 'relative', width: pdfSize.width, height: pdfSize.height }}>

                {/* КНОПКИ – поверх Canvas и PDF */}
                <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      zIndex: 2,
                      background: 'white',
                      padding: 8,
                      borderRadius: 4,
                      boxShadow: '0 0 6px rgba(0,0,0,0.1)'
                    }}
                >
                  <TemplateControls fields={fields} setFields={setFields} />
                </div>

                {/* PDF */}
                <PDFViewer
                    file={pdfFile}
                    onSize={(width, height) => setPdfSize({ width, height })}
                />

                {/* KANVA поверх PDF */}
                <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                  <CanvasEditor
                      width={pdfSize.width}
                      height={pdfSize.height}
                      excelColumns={excelColumns}
                      fields={fields}
                      setFields={setFields}
                      previewRow={previewRow ?? undefined}
                  />
                </div>
              </div>
          ) : (
              <p style={{ padding: '20px' }}>Загрузите PDF</p>
          )}
        </div>
      </div>
  );
};

export default App;
