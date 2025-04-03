import React from 'react';

interface Props {
    columns: string[];
}

const ExcelPanel: React.FC<Props> = ({ columns }) => {
    return (
        <div>
            <h3>Поля Excel:</h3>
            {columns.map((col) => (
                <div key={col} style={{ background: '#eee', margin: '4px 0', padding: '4px' }}>
                    {col}
                </div>
            ))}
        </div>
    );
};

export default ExcelPanel;
