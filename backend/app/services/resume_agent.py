"""
JobPrep AI — Resume Agent
Uses Google Gemini to transform a generic resume into
a job-targeted LaTeX resume.

Strategy: Hybrid LaTeX Template
- A high-quality ATS-friendly LaTeX template is provided as fallback
- The agent adapts section ordering and emphasis based on the
  original resume's structure
"""

from google import genai
from app.config import get_settings

# ============================================
# LaTeX Template (ATS-Friendly Fallback)
# ============================================

LATEX_TEMPLATE = r"""
\documentclass[letterpaper,11pt]{article}

\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage{tabularx}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-0.5in}
\addtolength{\textheight}{1.0in}

\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\newcommand{\resumeItem}[1]{\item\small{#1 \vspace{-2pt}}}
\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}
\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\begin{document}

% --- HEADER ---
% Name, contact info, links

% --- EDUCATION ---
% Degrees, institutions, dates

% --- EXPERIENCE ---
% Roles, companies, achievements with metrics

% --- PROJECTS ---
% Notable projects with tech stacks

% --- TECHNICAL SKILLS ---
% Categorized skills list

\end{document}
"""

# ============================================
# System Prompt
# ============================================

SYSTEM_PROMPT = f"""You are an Expert Technical Resume Writer and LaTeX specialist.

## YOUR TASK
You will receive:
1. The extracted text of a user's existing resume
2. A target job description
3. Optional user instructions/preferences

You must produce a **complete, compilable LaTeX resume** that is optimized for the target job.

## STRATEGY (Hybrid Template Approach)
- Use the following LaTeX template as your BASE STRUCTURE for formatting, commands, and preamble.
- ADAPT the section ordering and emphasis based on the user's original resume structure.
  - If the user's resume leads with Experience, keep Experience first.
  - If it leads with Education, keep Education first.
  - Add or remove sections as appropriate (e.g., Projects, Certifications, Publications).
- REWRITE the content to align with the job description:
  - Highlight skills that match the JD requirements
  - Quantify achievements with numbers/metrics where possible
  - Use strong action verbs (Led, Designed, Implemented, Optimized, etc.)
  - Incorporate relevant keywords from the JD naturally
- Follow the user's instructions/preferences if provided.

## LATEX TEMPLATE (BASE STRUCTURE)
```latex
{LATEX_TEMPLATE}
```

## OUTPUT RULES
1. Output ONLY valid, raw LaTeX code
2. Do NOT include markdown backticks (```) around the code
3. Do NOT include any conversational text, explanations, or commentary
4. The output must compile with pdflatex without errors
5. Use the \\resumeSubheading, \\resumeItem, and other custom commands from the template
6. Keep the resume to 1 page (2 pages maximum for senior roles)
7. Ensure all special LaTeX characters are properly escaped (%, &, $, #, etc.)
"""


async def generate_optimized_resume(
    resume_text: str,
    job_description: str,
    user_instructions: str,
    model_name: str | None = None,
) -> dict:
    """
    Generate an optimized LaTeX resume using Google Gemini.
    Includes retry logic with exponential backoff for 503 errors.
    """
    import asyncio
    import logging

    logger = logging.getLogger(__name__)

    settings = get_settings()

    if not settings.gemini_api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured. "
            "Set it in your .env file to use agent features."
        )

    # Use configured model or fallback
    model = model_name or settings.gemini_model_resume

    # Build the user prompt
    user_prompt = f"""## ORIGINAL RESUME TEXT
{resume_text}

## TARGET JOB DESCRIPTION
{job_description}

## USER INSTRUCTIONS
{user_instructions if user_instructions.strip() else "No specific instructions provided."}

Now generate the optimized LaTeX resume. Output ONLY the LaTeX code."""

    client = genai.Client(api_key=settings.gemini_api_key)

    # Retry with exponential backoff (3 attempts: wait 2s, 4s, 8s)
    max_retries = 3
    last_error = None

    for attempt in range(max_retries + 1):
        try:
            logger.info(
                f"Gemini API call attempt {attempt + 1}/{max_retries + 1} "
                f"using model={model}"
            )

            response = client.models.generate_content(
                model=model,
                contents=user_prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    temperature=0.3,
                    max_output_tokens=8192,
                ),
            )

            latex_output = response.text.strip()

            # Clean up: remove markdown code fences if the model added them
            if latex_output.startswith("```"):
                lines = latex_output.split("\n")
                lines = lines[1:]
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                latex_output = "\n".join(lines).strip()

            logger.info(f"Gemini API call succeeded on attempt {attempt + 1}")

            return {
                "latex": latex_output,
                "model_used": model,
            }

        except Exception as e:
            last_error = e
            error_str = str(e)
            logger.warning(
                f"Gemini API attempt {attempt + 1} failed: {error_str[:200]}"
            )

            # Check if it's a retryable error (503, 429, rate limit)
            is_retryable = any(
                keyword in error_str.upper()
                for keyword in ["503", "UNAVAILABLE", "429", "RATE", "QUOTA", "RESOURCE_EXHAUSTED"]
            )

            if is_retryable and attempt < max_retries:
                wait_time = 2 ** (attempt + 1)  # 2s, 4s, 8s
                logger.info(f"Retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
            else:
                break

    raise RuntimeError(
        f"Gemini API call failed after {max_retries + 1} attempts: {last_error}"
    )

