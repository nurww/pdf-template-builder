import React from 'react';
import { FieldBoxData } from '../types';

interface Props {
    fields: FieldBoxData[];
    setFields: (fields: FieldBoxData[]) => void;
    pdfFile: File | null;
    excelFile: File | null;
}

const TemplateControls: React.FC<Props> = ({ fields, setFields, pdfFile, excelFile }) => {
    const handleSave = () => {
        const json = JSON.stringify(fields, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'template.json';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string);
                setFields(parsed);
            } catch (err) {
                alert('Ошибка при загрузке шаблона');
            }
        };
        reader.readAsText(file);
    };

    const generatePDF = async () => {
        if (!excelFile || !pdfFile) {
            alert("Пожалуйста, загрузите Excel и PDF");
            return;
        }

        const formData = new FormData();
        formData.append("excel", excelFile);
        formData.append("pdf_template", pdfFile);
        const jsonBlob = new Blob([JSON.stringify(fields)], { type: "application/json" });
        formData.append("template_json", jsonBlob, "template.json");

        try {
            const response = await fetch("http://localhost:8000/generate-pdf", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Ошибка генерации PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "result.pdf";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Ошибка при генерации PDF");
        }
    };

    return (
        <div style={{ marginBottom: '10px' }}>
            <button onClick={handleSave}>💾 Сохранить шаблон</button>
            <label style={{ marginLeft: '10px', cursor: 'pointer' }}>
                📂 Загрузить шаблон
                <input type="file" accept="application/json" onChange={handleLoad} style={{ display: 'none' }} />
            </label>
            <button onClick={generatePDF} style={{ marginLeft: '10px' }}>
                🖨️ Генерировать PDF
            </button>
        </div>
    );
};

export default TemplateControls;
