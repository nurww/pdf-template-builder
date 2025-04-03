import React from 'react';

interface Props {
    columns: string[];
}

const ExcelPanel: React.FC<Props> = ({ columns }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, name: string) => {
        e.dataTransfer.setData('text/plain', name);
    };

    return (
        <div>
            <h3>Поля Excel:</h3>
            {columns.map((col) => (
                <div
                    key={col}
                    draggable
                    onDragStart={(e) => handleDragStart(e, col)}
                    style={{
                        background: '#f0f0f0',
                        margin: '4px 0',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        cursor: 'grab',
                    }}
                >
                    {col}
                </div>
            ))}
        </div>
    );
};

export default ExcelPanel;
