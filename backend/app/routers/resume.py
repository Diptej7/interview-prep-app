"""
JobPrep AI — Resume Router
POST /api/update-resume: Accepts PDF + JD + instructions,
returns optimized LaTeX resume.
POST /api/compile-resume: Compiles LaTeX to PDF via LaTeX.Online API.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io

from app.services.pdf_extractor import extract_text_from_pdf
from app.services.resume_agent import generate_optimized_resume
from app.services.latex_compiler import compile_latex_to_pdf
from app.config import get_settings

router = APIRouter(prefix="/api", tags=["Resume"])

# Max PDF size: 10 MB
MAX_PDF_SIZE = 10 * 1024 * 1024


class CompileRequest(BaseModel):
    latex: str


@router.post("/update-resume")
async def update_resume(
    resume_file: UploadFile = File(..., description="PDF resume file"),
    job_description: str = Form(..., description="Target job description"),
    user_instructions: str = Form(
        default="", description="Optional user instructions"
    ),
):
    """
    Generate an optimized LaTeX resume from a PDF resume,
    job description, and optional user instructions.

    The PDF is processed strictly in-memory — nothing touches disk.
    """

    # ── Validate file type ──────────────────────────────────
    if resume_file.content_type not in (
        "application/pdf",
        "application/x-pdf",
    ):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are accepted. "
            f"Received: {resume_file.content_type}",
        )

    # ── Read file bytes ─────────────────────────────────────
    file_bytes = await resume_file.read()

    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(file_bytes) > MAX_PDF_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_PDF_SIZE // (1024*1024)} MB.",
        )

    # ── Validate inputs ─────────────────────────────────────
    if not job_description.strip():
        raise HTTPException(
            status_code=400, detail="Job description cannot be empty."
        )

    # ── Step A: Extract text from PDF ───────────────────────
    try:
        resume_text = extract_text_from_pdf(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # ── Step B: Generate optimized resume via agent ─────────
    settings = get_settings()

    try:
        result = await generate_optimized_resume(
            resume_text=resume_text,
            job_description=job_description,
            user_instructions=user_instructions,
            model_name=settings.gemini_model_resume,
        )
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return {
        "success": True,
        "latex": result["latex"],
        "model_used": result["model_used"],
        "resume_length": len(resume_text),
    }


@router.post("/compile-resume")
async def compile_resume(request: CompileRequest):
    """
    Compile LaTeX code to PDF via the LaTeX.Online API.

    If compilation fails, attempts one auto-fix via Gemini.
    Returns PDF binary on success, or error details + raw LaTeX on failure.
    """
    if not request.latex.strip():
        raise HTTPException(
            status_code=400, detail="LaTeX code cannot be empty."
        )

    result = await compile_latex_to_pdf(request.latex)

    if result["success"]:
        return StreamingResponse(
            io.BytesIO(result["pdf_bytes"]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=optimized_resume.pdf"
            },
        )
    else:
        # Compilation failed — return error + LaTeX for user to fix manually
        raise HTTPException(
            status_code=422,
            detail={
                "message": "PDF compilation failed.",
                "error": result["error"],
                "latex": result["latex"],
                "was_retried": result["was_retried"],
                "suggestion": "You can paste this LaTeX into Overleaf to fix manually.",
            },
        )

