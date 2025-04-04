export type FieldName = string;

export interface ExcelRow {
    [key: string]: string | number;
}

export interface FieldBoxData {
    name: FieldName;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    wrap: boolean;
    align: 'left' | 'center' | 'right';
    page?: number;
}
