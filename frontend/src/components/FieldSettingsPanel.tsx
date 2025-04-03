import React from 'react';
import { FieldBoxData } from '../types';

interface Props {
    field: FieldBoxData;
    onChange: (updated: FieldBoxData) => void;
    onDelete: () => void;
}

const FieldSettingsPanel: React.FC<Props> = ({ field, onChange, onDelete }) => {
    const handleChange = (key: keyof FieldBoxData, value: any) => {
        onChange({ ...field, [key]: value });
    };

    return (
        <div style={{ padding: '10px', border: '1px solid #ccc', width: '250px' }}>
            <h4>Настройки поля</h4>
            <label>Шрифт:
                <input
                    type="text"
                    value={field.fontFamily}
                    onChange={(e) => handleChange('fontFamily', e.target.value)}
                />
            </label>

            <label>Размер:
                <input
                    type="number"
                    value={field.fontSize}
                    onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                />
            </label>

            <label>Цвет:
                <input
                    type="color"
                    value={field.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                />
            </label>

            <label>Выравнивание:
                <select
                    value={field.align}
                    onChange={(e) => handleChange('align', e.target.value as 'left' | 'center' | 'right')}
                >
                    <option value="left">Слева</option>
                    <option value="center">По центру</option>
                    <option value="right">Справа</option>
                </select>
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={field.wrap}
                    onChange={(e) => handleChange('wrap', e.target.checked)}
                /> Перенос строк
            </label>

            <button style={{ marginTop: '10px', color: 'red' }} onClick={onDelete}>
                🗑 Удалить
            </button>
        </div>
    );
};

export default FieldSettingsPanel;