import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Указываем PDF.js воркер
pdfjs.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

interface Props {
    file: File;
}

const PDFViewer: React.FC<Props> = ({ file }) => {
    const fileUrl = URL.createObjectURL(file);

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Document
                file={fileUrl}
                onLoadError={(error: any) => console.error('Ошибка загрузки PDF:', error)}
                onSourceError={(error: any) => console.error('Ошибка источника PDF:', error)}
            >
                <Page pageNumber={1} width={800} />
            </Document>
        </div>
    );
};

export default PDFViewer;
