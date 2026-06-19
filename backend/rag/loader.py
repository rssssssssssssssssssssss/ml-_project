import fitz
import re

from config import DOCUMENT_DIR


def clean_text(text: str) -> str:
    # Normalize line endings
    text = text.replace("\r", "\n")

    # Remove multiple spaces/tabs
    text = re.sub(r"[ \t]+", " ", text)

    # Remove multiple blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove spaces before newlines
    text = re.sub(r" +\n", "\n", text)

    # Remove newlines inside sentences
    text = re.sub(r"(?<!\n)\n(?!\n)", " ", text)

    # Remove extra spaces again
    text = re.sub(r" +", " ", text)

    return text.strip()


def load_documents():

    pdfs = list(DOCUMENT_DIR.glob("*.pdf"))

    print(f"Found {len(pdfs)} PDF(s)")
    print(DOCUMENT_DIR)

    documents = []

    for pdf in pdfs:

        print(f"Reading {pdf.name}")

        doc = fitz.open(pdf)

        text = ""

        for page in doc:
            text += page.get_text() + "\n"

        doc.close()

        text = clean_text(text)

        documents.append({
            "filename": pdf.name,
            "text": text
        })

    return documents