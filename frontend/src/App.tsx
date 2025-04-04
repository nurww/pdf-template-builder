import React, { useState } from 'react';
import PDFViewer from './components/PDFViewer';
import ExcelPanel from './components/ExcelPanel';
import CanvasEditor from "./components/CanvasEditor";
import * as XLSX from 'xlsx';
import { FieldBoxData, ExcelRow } from './types';
import TemplateControls from './components/TemplateControls';

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [pdfSize, setPdfSize] = useState({ width: 800, height: 1000 });
  const [fields, setFields] = useState<FieldBoxData[]>([]);
  const [previewRow, setPreviewRow] = useState<ExcelRow | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);

  const handlePageChange = (delta: number) => {
    setCurrentPage((prev) => Math.max(1, Math.min(prev + delta, numPages)));
  };

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfFile(file);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file); // 👈 добавили это

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
        setPreviewRow(data[0]);
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
              <>
                {/* Панель кнопок ВНЕ pdf/canvas */}
                <TemplateControls
                    fields={fields}
                    setFields={setFields}
                    pdfFile={pdfFile}
                    excelFile={excelFile}
                />

                {/* Кнопки навигации — ВНЕ PDF/Canvas */}
                <div style={{ margin: '10px 0' }}>
                  <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>⬅ Назад</button>
                  <span style={{ margin: '0 10px' }}>Страница {currentPage} из {numPages}</span>
                  <button onClick={() => handlePageChange(1)} disabled={currentPage === numPages}>Вперед ➡</button>
                </div>

                {/* Сам PDF и Canvas */}
                <div style={{ position: 'relative', width: pdfSize.width, height: pdfSize.height }}>
                  <div style={{ border: '1px solid red', width: pdfSize.width, height: pdfSize.height }}>
                    <PDFViewer
                        file={pdfFile}
                        onSize={(width, height) => setPdfSize({ width, height })}
                        page={currentPage}
                        onLoadTotalPages={(pages) => setNumPages(pages)}
                    />
                  </div>

                  <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                    <CanvasEditor
                        width={pdfSize.width}
                        height={pdfSize.height}
                        excelColumns={excelColumns}
                        fields={fields}
                        setFields={setFields}
                        previewRow={previewRow ?? undefined}
                        currentPage={currentPage}
                    />
                  </div>
                </div>

              </>
          ) : (
              <p style={{ padding: '20px' }}>Загрузите PDF</p>
          )}
        </div>
      </div>
  );
};

export default App;
