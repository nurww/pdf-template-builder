import React, { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import { FieldBoxData, ExcelRow } from '../types';
import FieldSettingsPanel from './FieldSettingsPanel';

interface CanvasEditorProps {
    width: number;
    height: number;
    excelColumns: string[];
    fields: FieldBoxData[];
    setFields: Dispatch<SetStateAction<FieldBoxData[]>>;
    previewRow?: ExcelRow;
    currentPage?: number;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
                                                       width,
                                                       height,
                                                       excelColumns,
                                                       fields,
                                                       setFields,
                                                       previewRow,
                                                       currentPage
                                                   }) => {
    const stageRef = useRef<any>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' && selectedIndex !== null) {
                deleteSelectedField();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, fields]);

    const measureText = (text: string, fontSize: number, fontFamily: string = 'Arial'): { width: number; height: number } => {
        const context = document.createElement('canvas').getContext('2d');
        if (!context) return { width: 150, height: fontSize + 6 };
        context.font = `${fontSize}px ${fontFamily}`;
        const metrics = context.measureText(text);
        return {
            width: metrics.width + 20,
            height: fontSize,
        };
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const stage = stageRef.current;
        stage.setPointersPositions(e);

        const name = e.dataTransfer.getData('text/plain');
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const fontSize = 14;
        const fontFamily = 'Arial';
        const size = measureText(name, fontSize, fontFamily);

        const newField: FieldBoxData = {
            name,
            x: pointer.x,
            y: pointer.y,
            width: size.width,
            height: size.height,
            fontSize,
            fontFamily,
            color: '#000000',
            wrap: true,
            align: 'left',
            page: currentPage,
        };

        setFields([...fields, newField]);
    };

    const handleDragEnd = (index: number, e: any) => {
        const updated = [...fields];
        updated[index].x = e.target.x();
        updated[index].y = e.target.y();
        setFields(updated);
    };

    const deleteSelectedField = () => {
        if (selectedIndex !== null) {
            setFields(fields.filter((_, i) => i !== selectedIndex));
            setSelectedIndex(null);
        }
    };

    const updateSelectedField = (updated: FieldBoxData) => {
        const size = measureText(updated.name, updated.fontSize, updated.fontFamily);
        updated.width = size.width;
        updated.height = size.height;

        if (selectedIndex !== null) {
            const updatedFields = [...fields];
            updatedFields[selectedIndex] = updated;
            setFields(updatedFields);
        }
    };

    const selectedField = selectedIndex !== null ? fields[selectedIndex] : null;

    return (
        <div style={{ display: 'flex' }}>
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{ border: '1px dashed gray', width, height }}
            >
                <Stage width={width} height={height} ref={stageRef}>
                    <Layer>
                        {fields
                            .map((field, index) => ({ field, index }))
                            .filter(({ field }) => !field.page || field.page === currentPage)
                            .map(({ field, index }) => {
                                const displayText = previewRow ? previewRow[field.name] ?? '' : field.name;
                                return (
                                    <Group
                                        key={index}
                                        x={field.x}
                                        y={field.y}
                                        draggable
                                        onClick={() => setSelectedIndex(index)}
                                        onTap={() => setSelectedIndex(index)}
                                        onDragEnd={(e) => handleDragEnd(index, e)}
                                    >
                                        {/* Внешняя пунктирная рамка */}
                                        <Rect
                                            width={field.width}
                                            height={field.height}
                                            stroke="#888"
                                            strokeWidth={1}
                                            dash={[4, 2]}
                                            fill="transparent"
                                        />
                                        {/* Внутренний фон */}
                                        <Rect
                                            width={field.width - 2}
                                            height={field.height - 2}
                                            x={1}
                                            y={1}
                                            fill="#fefae0"
                                            cornerRadius={2}
                                        />
                                        <Text
                                            text={String(displayText)}
                                            fontSize={field.fontSize}
                                            fontFamily={field.fontFamily}
                                            fill={field.color}
                                            align={field.align}
                                            verticalAlign="top"
                                            width={field.width}
                                            height={field.height}
                                            wrap={field.wrap ? 'word' : 'none'}
                                        />
                                    </Group>
                                );
                            })}
                    </Layer>
                </Stage>
            </div>
            {selectedField && (
                <FieldSettingsPanel
                    field={selectedField}
                    onChange={updateSelectedField}
                    onDelete={deleteSelectedField}
                />
            )}
        </div>
    );
};

export default CanvasEditor;
