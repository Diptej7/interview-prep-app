"""
JobPrep AI — LaTeX Compiler
Compiles LaTeX code to PDF using the LaTeX.Online API
(https://latex.ytotech.com). No local TeX installation required.

If compilation fails, attempts one auto-fix via Gemini,
then falls back to returning raw LaTeX + error message.
"""

import httpx
from google import genai
from app.config import get_settings

LATEX_API_URL = "https://latex.ytotech.com/builds/sync"

# Timeout for the LaTeX compilation API (seconds)
COMPILE_TIMEOUT = 60.0


async def compile_latex_to_pdf(latex_code: str) -> dict:
    """
    Compile LaTeX code to PDF via the LaTeX.Online API.
    On failure, attempts one Gemini-powered auto-fix.

    Returns:
        {
            "success": True/False,
            "pdf_bytes": bytes | None,
            "error": str | None,
            "latex": str,          # possibly fixed LaTeX
            "was_retried": bool,
        }
    """
    # First attempt
    result = await _call_latex_api(latex_code)

    if result["success"]:
        return {
            "success": True,
            "pdf_bytes": result["pdf_bytes"],
            "error": None,
            "latex": latex_code,
            "was_retried": False,
        }

    # ── Auto-retry: ask Gemini to fix the LaTeX ────────────
    original_error = result["error"]

    try:
        fixed_latex = await _auto_fix_latex(latex_code, original_error)
    except Exception:
        # If Gemini fix itself fails, return the original error
        return {
            "success": False,
            "pdf_bytes": None,
            "error": f"Compilation failed: {original_error}",
            "latex": latex_code,
            "was_retried": False,
        }

    # Second attempt with fixed LaTeX
    retry_result = await _call_latex_api(fixed_latex)

    if retry_result["success"]:
        return {
            "success": True,
            "pdf_bytes": retry_result["pdf_bytes"],
            "error": None,
            "latex": fixed_latex,
            "was_retried": True,
        }

    # Both attempts failed — return LaTeX + error
    return {
        "success": False,
        "pdf_bytes": None,
        "error": (
            f"Compilation failed after auto-fix attempt.\n"
            f"Original error: {original_error}\n"
            f"Retry error: {retry_result['error']}"
        ),
        "latex": fixed_latex,
        "was_retried": True,
    }


async def _call_latex_api(latex_code: str) -> dict:
    """
    Call the LaTeX.Online API to compile LaTeX to PDF.

    Returns:
        { "success": bool, "pdf_bytes": bytes | None, "error": str | None }
    """
    payload = {
        "compiler": "pdflatex",
        "resources": [
            {
                "main": True,
                "content": latex_code,
            }
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=COMPILE_TIMEOUT) as client:
            response = await client.post(
                LATEX_API_URL,
                json=payload,
            )

        if response.status_code == 200:
            content_type = response.headers.get("content-type", "")
            if "application/pdf" in content_type:
                return {
                    "success": True,
                    "pdf_bytes": response.content,
                    "error": None,
                }
            else:
                # API returned 200 but not a PDF — likely an error page
                return {
                    "success": False,
                    "pdf_bytes": None,
                    "error": response.text[:500],
                }
        else:
            return {
                "success": False,
                "pdf_bytes": None,
                "error": f"API returned {response.status_code}: {response.text[:500]}",
            }

    except httpx.TimeoutException:
        return {
            "success": False,
            "pdf_bytes": None,
            "error": "LaTeX compilation timed out (60s limit).",
        }
    except Exception as e:
        return {
            "success": False,
            "pdf_bytes": None,
            "error": f"LaTeX API request failed: {str(e)}",
        }


async def _auto_fix_latex(latex_code: str, error_message: str) -> str:
    """
    Send broken LaTeX + error to Gemini for a fix attempt.
    Returns the fixed LaTeX code.
    """
    settings = get_settings()

    if not settings.gemini_api_key:
        raise RuntimeError("No Gemini API key for auto-fix.")

    fix_prompt = f"""The following LaTeX code failed to compile with pdflatex.

## COMPILATION ERROR
{error_message}

## LATEX CODE
{latex_code}

Fix the LaTeX code so it compiles successfully with pdflatex.
- Fix ONLY the compilation errors
- Do NOT change the content or meaning
- Ensure all packages used are standard (available in TeX Live)
- Output ONLY the fixed LaTeX code, no markdown fences or explanations."""

    client = genai.Client(api_key=settings.gemini_api_key)

    response = client.models.generate_content(
        model=settings.gemini_model_default,
        contents=fix_prompt,
        config=genai.types.GenerateContentConfig(
            temperature=0.1,
            max_output_tokens=8192,
        ),
    )

    fixed = response.text.strip()

    # Clean markdown fences if present
    if fixed.startswith("```"):
        lines = fixed.split("\n")
        lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        fixed = "\n".join(lines).strip()

    return fixed
