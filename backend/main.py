from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from pdf_generator import generate_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # разреши из фронта
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-pdf")
async def generate_pdf_endpoint(
    excel: UploadFile = File(...),
    template_json: UploadFile = File(...),
    pdf_template: UploadFile = File(...),
):
    os.makedirs("tmp", exist_ok=True)

    excel_path = f"tmp/{excel.filename}"
    json_path = f"tmp/{template_json.filename}"
    pdf_path = f"tmp/{pdf_template.filename}"
    output_path = "tmp/result.pdf"

    # сохраняем временные файлы
    for file, path in [(excel, excel_path), (template_json, json_path), (pdf_template, pdf_path)]:
        with open(path, "wb") as f:
            shutil.copyfileobj(file.file, f)

    # вызываем генератор
    generate_pdf(pdf_path, excel_path, json_path, output_path)

    return FileResponse(output_path, media_type="application/pdf", filename="result.pdf")
