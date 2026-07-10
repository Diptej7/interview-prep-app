# 🚀 JobPrep AI

**High-performance, privacy-focused Agentic Interview Prep App.**

JobPrep AI uses AI agents powered by Google Gemini to help you optimize your resume, generate a structured preparation plan, and deeply learn each topic — all without ever storing your resume.

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| **Frontend**   | Next.js 15 (App Router), Tailwind CSS, Zustand, Lucide React |
| **Backend**    | Python FastAPI                          |
| **AI/Agents**  | Google Gemini, LangGraph                |
| **Database**   | Supabase (PostgreSQL)                   |
| **Auth**       | NextAuth.js (Google Provider) — *coming soon* |

## Project Structure

```
interview-prep-app/
├── frontend/          # Next.js application
├── backend/           # FastAPI server
├── supabase/          # Database migrations
├── .env.example       # Environment variable template
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Supabase project ([create one here](https://supabase.com))

### 1. Clone & Configure
```bash
cp .env.example .env
# Fill in your Supabase and Gemini API keys in .env
```

### 2. Frontend
```bash
cd frontend
cp .env.local.example .env.local
# Fill in frontend env vars
npm install
npm run dev
```

### 3. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Database
Run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor.

## Privacy
**Your resume is never stored.** All resume processing happens strictly in-memory and is discarded after each session.

## License
MIT
