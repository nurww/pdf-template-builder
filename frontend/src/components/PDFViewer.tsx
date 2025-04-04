import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

interface Props {
    file: File;
    page?: number;
    onSize?: (width: number, height: number) => void;
    onLoadTotalPages?: (total: number) => void;
}

const PDFViewer: React.FC<Props> = ({ file, page = 1, onSize, onLoadTotalPages }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setFileUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleLoadSuccess = (pdf: any) => {
        onLoadTotalPages?.(pdf.numPages);
    };

    const handlePageRender = (page: any) => {
        const { width, height } = page.getViewport({ scale: 1 });
        onSize?.(width, height);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Document file={fileUrl} onLoadSuccess={handleLoadSuccess}>
                <Page pageNumber={page} onRenderSuccess={handlePageRender} />
            </Document>
        </div>
    );
};

export default PDFViewer;
