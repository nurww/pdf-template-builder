import React from 'react';
import { FieldBoxData } from '../types';

interface Props {
    fields: FieldBoxData[];
    setFields: (fields: FieldBoxData[]) => void;
}

const TemplateControls: React.FC<Props> = ({ fields, setFields }) => {
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

    return (
        <div style={{ marginBottom: '10px' }}>
            <button onClick={handleSave}>💾 Сохранить шаблон</button>
            <label style={{ marginLeft: '10px', cursor: 'pointer' }}>
                📂 Загрузить шаблон
                <input type="file" accept="application/json" onChange={handleLoad} style={{ display: 'none' }} />
            </label>
        </div>
    );
};

export default TemplateControls;
