# CodeLens AI 🔍⚡

> **Understand. Analyze. Improve. Your Code.**

CodeLens AI is a modern, full-stack AI-powered source code explanation, security vulnerability auditing, and algorithmic optimization platform.

---

## 🌟 Key Capabilities

1. **Multi-Vector AI Analysis**:
   - Executive summary and core domain purpose.
   - Logical block-level code walkthroughs with line-range tags.
   - Automated Bug & Edge-Case detection with severity classifications.
   - Comprehensive Security Audits (SQLi, XSS, Command Injections, Secrets, Deserialization risks).
   - Time Complexity $O(n)$ and Space Complexity $O(1)$ algorithmic derivations.
   - Radial Code Quality Index (Readability, Maintainability, Efficiency, Security).
   - Concrete optimization suggestions with before/after comparisons.

2. **Smart Refactoring & Comparison**:
   - Automatic generation of production-grade refactored code.
   - Side-by-side or stacked split comparison viewer.
   - Itemized changes list with copy & download shortcuts.

3. **Technical Documentation Generator**:
   - Markdown README generator detailing purpose, signatures, return types, parameters, dependencies, and usage examples.

4. **Context-Aware AI Chat**:
   - Interactive chat panel grounded in active source code and analysis metrics.

5. **Engineering Dashboard & Analytics**:
   - Real-time statistics: Total Analyses, Average Quality Score, Security Findings, Language Counts.
   - Interactive Recharts for Quality Score Progression and Language Distribution.

6. **History & Persistence**:
   - Direct-access SQLite database with SQLAlchemy ORM (no login friction).
   - Search by title, filter by language, quality score, or security status.
   - Rename, delete, and re-analyze previously saved snippets.

7. **Export Pipeline**:
   - Professional PDF Export using ReportLab (styled headers, tables, code blocks, summary).
   - Markdown Export formatted as clean GitHub-flavored markdown.

---

## 🛡️ Security Guarantee

- **Zero Code Execution**: Source files are strictly treated as read-only plain text.
- **No dynamic execution**: `eval()`, `exec()`, and `subprocess` are never used.
- **Upload safety**: Restricted extensions (`.py`, `.java`, `.c`, `.cpp`, `.js`, `.html`, `.css`, `.sql`) and maximum file size enforced at 1MB.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Monaco Editor, Tailwind CSS, Framer Motion, Recharts, Lucide React, Canvas Confetti.
- **Backend**: Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0, ReportLab, Google Gemini API (`gemini-1.5-flash`), Uvicorn.
- **Database**: SQLite (`codelens.db`), modular for PostgreSQL.

---

## 🚀 Quick Start Guide

### 1. Backend Setup

```bash
cd backend
python -m pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY in .env
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Testing

Run backend test suite:

```bash
python -m pytest backend
```

Build frontend production bundle:

```bash
cd frontend && npm run build
```
