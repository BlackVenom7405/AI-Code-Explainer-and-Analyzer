import json
import re
import os
import asyncio
from typing import Dict, Any, Optional
import google.generativeai as genai
from app.core.config import settings
from app.core.exceptions import GeminiApiKeyMissingException, AIAnalysisFailedException
from app.schemas.analysis import AnalysisResult

class GeminiService:
    def __init__(self):
        self._initialized = False

    def _ensure_initialized(self):
        from dotenv import dotenv_values
        env_vals = dotenv_values(".env")
        api_key = env_vals.get("GEMINI_API_KEY") or settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")
        api_key = api_key.strip()
        
        # Check if missing or still contains placeholder
        if not api_key or api_key == "your_actual_gemini_api_key_here":
            raise GeminiApiKeyMissingException()
            
        genai.configure(api_key=api_key)
        self._initialized = True

    def _clean_json_response(self, raw_text: str) -> str:
        """Extract clean JSON substring safely by removing markdown code fences and isolating the root object."""
        text = raw_text.strip()
        
        # Strip markdown fences if wrapping the entire response
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()
            
        # Match outermost { to }
        first_brace = text.find('{')
        last_brace = text.rfind('}')
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            text = text[first_brace:last_brace + 1]
            
        # Clean trailing commas before closing braces/brackets
        text = re.sub(r',\s*([\]}])', r'\1', text)
        return text

    async def generate_analysis(self, language: str, code: str, detail_level: str = "balanced") -> AnalysisResult:
        """Calls Gemini to analyze source code and returns validated AnalysisResult."""
        self._ensure_initialized()

        prompt = f"""You are a Principal Software Architect, Security Auditor, and Senior Code Reviewer.
Analyze the following {language.upper()} source code thoroughly.

Detail Level: {detail_level}

SOURCE CODE:
```{language}
{code}
```

You MUST return a single valid, raw JSON object (with NO other text before or after).
The JSON MUST follow this exact schema:

{{
  "summary": "High-level summary of what the code does in 2-4 sentences",
  "purpose": "Primary objective or business domain purpose of this code",
  "key_components": [
    "List of major functions, classes, data structures, or algorithmic steps"
  ],
  "explanation": [
    {{
      "title": "Code statement or line snippet (e.g., 'max_value = numbers[0]')",
      "lines": "Line X (or Lines X-Y)",
      "explanation": "Thorough line-by-line explanation of what this line does, variable mutations, condition checks, and underlying mechanics."
    }}
  ],
  "bugs": [
    {{
      "title": "Bug or Logic Risk Title",
      "severity": "Critical | High | Medium | Low",
      "location": "Line or function location",
      "description": "Clear description of the bug, edge-case failure, or type issue",
      "recommendation": "Specific actionable fix"
    }}
  ],
  "security_issues": [
    {{
      "title": "Vulnerability or Security Risk Title",
      "severity": "Critical | High | Medium | Low",
      "location": "Line or component location",
      "risk": "Description of potential security risk or exploitability",
      "explanation": "Why this pattern is unsafe",
      "recommendation": "Security remediation"
    }}
  ],
  "complexity": {{
    "time": "O(n) or relevant Big-O notation",
    "space": "O(1) or relevant Big-O notation",
    "explanation": "Clear algorithmic derivation and assumptions"
  }},
  "quality": {{
    "score": 85.0,
    "readability": 85.0,
    "maintainability": 80.0,
    "efficiency": 90.0,
    "security": 85.0
  }},
  "optimizations": [
    {{
      "problem": "Identified bottleneck or inefficiency",
      "current_approach": "How code currently handles it",
      "recommended_approach": "Optimized technique or data structure",
      "expected_benefit": "Performance or memory gain"
    }}
  ],
  "refactored_code": "Complete, production-grade refactored version of the code adhering to best practices and idiomatic patterns",
  "documentation": "Markdown README-style documentation including Purpose, Functions, Parameters, Returns, and Usage examples"
}}

Strict Rules:
- MANDATORY FOR EXPLANATION: You MUST provide an exhaustive, sequential LINE-BY-LINE breakdown in the 'explanation' array covering every key line/statement of the source code in order (e.g. Line 1, Line 2, Line 3, etc.).
- If there are no bugs or security issues, return empty arrays `[]` rather than hallucinating false positives.
- Ensure all quality scores are numeric floats between 0 and 100.
- For complexity, output exact standard Big-O notation (e.g. O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n)).
"""

        MODEL_CANDIDATES = [
            "gemini-flash-latest",
            "gemini-3.5-flash",
            "gemini-3.1-flash-lite",
        ]
        
        last_error = None
        for model_name in MODEL_CANDIDATES:
            try:
                model = genai.GenerativeModel(model_name)
                for attempt in range(2):
                    try:
                        response = model.generate_content(
                            prompt,
                            generation_config=genai.types.GenerationConfig(
                                temperature=0.2,
                                response_mime_type="application/json"
                            )
                        )
                        raw_text = response.text or ""
                        cleaned = self._clean_json_response(raw_text)
                        parsed = json.loads(cleaned)
                        return AnalysisResult(**parsed)
                    except Exception as e:
                        if attempt == 1:
                            raise e
                        await asyncio.sleep(1)
                        continue
            except Exception as e:
                last_error = e
                # If rate limited, wait a brief second before trying fallback
                await asyncio.sleep(1.5)
                continue
                
        # Clean user-friendly error message if rate limit or quota
        err_msg = str(last_error)
        if "429" in err_msg or "quota" in err_msg.lower():
            err_msg = "Google Gemini API rate limit / quota exceeded on free tier. Please wait a few seconds and try again."
            
        raise AIAnalysisFailedException(f"Failed to generate structured code analysis: {err_msg}")

    async def refactor_code(self, language: str, code: str, focus: str = "clean_and_efficient") -> Dict[str, Any]:
        """Generates a clean refactored version of the code and explanation of changes."""
        self._ensure_initialized()
        prompt = f"""You are a Staff Software Engineer. Refactor the following {language.upper()} code.
Refactoring Focus: {focus}

SOURCE CODE:
```{language}
{code}
```

Return a raw JSON object with this exact structure:
{{
  "refactored_code": "Complete refactored source code string",
  "changes_made": [
    "Bullet point explanation of change 1",
    "Bullet point explanation of change 2"
  ],
  "improvements": "Summary of performance, readability, and maintainability benefits"
}}
"""
        MODEL_CANDIDATES = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-3.1-flash-lite"]
        for model_name in MODEL_CANDIDATES:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.2,
                        response_mime_type="application/json"
                    )
                )
                cleaned = self._clean_json_response(response.text or "")
                return json.loads(cleaned)
            except Exception:
                await asyncio.sleep(1)
                continue
        raise AIAnalysisFailedException("Refactoring request failed across model endpoints.")

    async def generate_documentation(self, language: str, code: str, doc_format: str = "markdown") -> str:
        """Generates comprehensive README-style markdown documentation for the given code."""
        self._ensure_initialized()
        prompt = f"""Generate comprehensive, professional documentation for the following {language.upper()} code.

SOURCE CODE:
```{language}
{code}
```

Format the documentation in clean Markdown with:
# Title / Overview
## Purpose & Architecture
## Key Components / Functions / Classes
- Parameters & Types
- Return Values
- Exceptions / Errors
## Dependencies & Requirements
## Usage Examples
## Complexity & Performance Considerations
"""
        MODEL_CANDIDATES = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-3.1-flash-lite"]
        for model_name in MODEL_CANDIDATES:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                return response.text or ""
            except Exception:
                await asyncio.sleep(1)
                continue
        raise AIAnalysisFailedException("Documentation generation failed.")

    async def chat_about_code(self, language: str, code: str, question: str, analysis_context: Optional[str] = None, history: list = None) -> str:
        """Answers contextual questions about the code and previous analysis."""
        self._ensure_initialized()
        
        system_instruction = f"""You are CodeLens AI, an expert code assistant. 
The user is asking questions about the following {language.upper()} source code.

SOURCE CODE:
```{language}
{code}
```

ANALYSIS CONTEXT:
{analysis_context or "No previous analysis provided."}

Guidelines:
- Provide clear, concise, direct answers with code snippets when helpful.
- Reference specific line numbers and variables when discussing logic or complexity.
- Maintain a helpful, professional developer tone.
"""
        MODEL_CANDIDATES = ["gemini-flash-latest", "gemini-3.5-flash", "gemini-3.1-flash-lite"]
        for model_name in MODEL_CANDIDATES:
            try:
                model = genai.GenerativeModel(model_name, system_instruction=system_instruction)
                chat = model.start_chat(history=[])
                
                if history:
                    for msg in history[-6:]:
                        chat.history.append({
                            "role": "user" if msg.role == "user" else "model",
                            "parts": [msg.content]
                        })

                response = chat.send_message(question)
                return response.text or ""
            except Exception:
                await asyncio.sleep(1)
                continue
        raise AIAnalysisFailedException("Chat request failed.")

gemini_service = GeminiService()
