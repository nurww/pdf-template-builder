import fitz  # PyMuPDF
import json
import openpyxl
from typing import List


def read_excel_rows(excel_path: str) -> List[dict]:
    wb = openpyxl.load_workbook(excel_path)
    sheet = wb.active
    headers = [cell.value for cell in sheet[1]]
    rows = []
    for row in sheet.iter_rows(min_row=2, values_only=True):
        row_dict = dict(zip(headers, row))
        rows.append(row_dict)
    return rows


def read_template_json(json_path: str) -> List[dict]:
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def generate_pdf(template_pdf_path: str, excel_path: str, json_path: str, output_path: str):
    rows = read_excel_rows(excel_path)
    template = read_template_json(json_path)

    base_pdf = fitz.open(template_pdf_path)
    result_pdf = fitz.open()

    for row_data in rows:
        working_pdf = fitz.open()
        working_pdf.insert_pdf(base_pdf)  # копируем исходный шаблон

        for field in template:
            text = str(row_data.get(field["name"], ""))
            page_index = field.get("page", 1) - 1
            if page_index < 0 or page_index >= len(working_pdf):
                continue

            page = working_pdf[page_index]
            x = field["x"]
            y = field["y"] + field.get("fontSize", 12)
            color = field.get("color", "#000000")
            font_size = field.get("fontSize", 12)
            frontend_font = field.get("fontFamily", "Arial")

            font = {
                "Arial": "helv",
                "Times New Roman": "times",
                "Courier New": "courier"
            }.get(frontend_font, "helv")

            def hex_to_rgb(hex_color):
                hex_color = hex_color.lstrip("#")
                r, g, b = tuple(int(hex_color[i:i + 2], 16) / 255 for i in (0, 2, 4))
                return (r, g, b)

            page.insert_text(
                (x, y),
                text,
                fontsize=font_size,
                fontname=font,
                fill=hex_to_rgb(color)
            )

        result_pdf.insert_pdf(working_pdf)  # только один раз за каждую строку

    result_pdf.save(output_path)
    result_pdf.close()
    base_pdf.close()
