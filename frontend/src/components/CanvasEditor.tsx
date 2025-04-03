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
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
                                                       width,
                                                       height,
                                                       excelColumns,
                                                       fields,
                                                       setFields,
                                                       previewRow
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
        if (!context) return { width: 150, height: fontSize + 10 };
        context.font = `${fontSize}px ${fontFamily}`;
        const metrics = context.measureText(text);
        return {
            width: metrics.width + 20,
            height: fontSize + 10,
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
                        {fields.map((field, index) => {
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
                                    <Rect
                                        width={field.width}
                                        height={field.height}
                                        fill="#fefae0"
                                        stroke="#333"
                                        cornerRadius={4}
                                    />
                                    <Text
                                        text={String(displayText)}
                                        fontSize={field.fontSize}
                                        fontFamily={field.fontFamily}
                                        fill={field.color}
                                        align={field.align}
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
