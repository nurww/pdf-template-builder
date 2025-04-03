import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

interface Props {
    file: File;
    onSize?: (width: number, height: number) => void;
}

const PDFViewer: React.FC<Props> = ({ file, onSize }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setFileUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file]);

    if (!fileUrl) return null;

    return (
        <Document file={fileUrl}>
            <Page
                pageNumber={1}
                // @ts-ignore
                onRenderSuccess={({ width, height }) => {
                    onSize?.(width, height);
                }}
            />
        </Document>
    );
};

export default PDFViewer;
