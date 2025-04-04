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

    # Открываем PDF-шаблон
    template_pdf = fitz.open(template_pdf_path)

    result_pdf = fitz.open()

    for row_data in rows:
        # Клонируем первую страницу шаблона
        page = template_pdf[0]
        new_page = result_pdf.new_page(width=page.rect.width, height=page.rect.height)
        new_page.show_pdf_page(page.rect, template_pdf, 0)

        # Вставляем данные по шаблону
        for field in template:
            text = str(row_data.get(field["name"], ""))
            x = field["x"]
            y = field["y"]
            font_size = field.get("fontSize", 12)
            color = field.get("color", "#000000")
            font = field.get("fontFamily", "helv")  # default font

            # PyMuPDF использует цвет в виде RGB (0-1)
            def hex_to_rgb(hex_color):
                hex_color = hex_color.lstrip("#")
                r, g, b = tuple(int(hex_color[i:i + 2], 16) / 255 for i in (0, 2, 4))
                return (r, g, b)

            new_page.insert_text(
                (x, y),
                text,
                fontsize=font_size,
                fontname="helv",  # заменим позже на кастом
                fill=hex_to_rgb(color)
            )

    result_pdf.save(output_path)
    result_pdf.close()
    template_pdf.close()
