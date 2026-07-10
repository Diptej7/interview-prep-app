"""
JobPrep AI — PDF Text Extractor
Extracts text from PDF files strictly in-memory using PyMuPDF.
No file is ever saved to disk.
"""

import fitz  # PyMuPDF


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract all text content from a PDF file's raw bytes.

    Args:
        file_bytes: Raw bytes of the PDF file.

    Returns:
        Concatenated text from all pages, separated by newlines.

    Raises:
        ValueError: If the PDF cannot be read or contains no text.
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception as e:
        raise ValueError(f"Failed to open PDF: {e}")

    if doc.page_count == 0:
        raise ValueError("PDF has no pages.")

    text_parts: list[str] = []

    for page_num in range(doc.page_count):
        page = doc[page_num]
        page_text = page.get_text("text")
        if page_text.strip():
            text_parts.append(page_text.strip())

    doc.close()

    full_text = "\n\n".join(text_parts)

    if not full_text.strip():
        raise ValueError(
            "No text could be extracted from the PDF. "
            "The file may be image-based or scanned."
        )

    return full_text
