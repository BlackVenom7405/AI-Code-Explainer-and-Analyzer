from typing import Dict, Any, Optional
from app.services.gemini_service import gemini_service
from app.schemas.analysis import AnalysisResult

class AIService:
    @staticmethod
    async def analyze_code(language: str, code: str, detail_level: str = "balanced") -> AnalysisResult:
        return await gemini_service.generate_analysis(language=language, code=code, detail_level=detail_level)

    @staticmethod
    async def explain_code(language: str, code: str, detail_level: str = "balanced") -> AnalysisResult:
        return await gemini_service.generate_analysis(language=language, code=code, detail_level=detail_level)

    @staticmethod
    async def refactor_code(language: str, code: str, focus: str = "clean_and_efficient") -> Dict[str, Any]:
        return await gemini_service.refactor_code(language=language, code=code, focus=focus)

    @staticmethod
    async def generate_documentation(language: str, code: str, doc_format: str = "markdown") -> str:
        return await gemini_service.generate_documentation(language=language, code=code, doc_format=doc_format)

    @staticmethod
    async def chat_about_code(language: str, code: str, question: str, analysis_context: Optional[str] = None, history: list = None) -> str:
        return await gemini_service.chat_about_code(
            language=language,
            code=code,
            question=question,
            analysis_context=analysis_context,
            history=history
        )

ai_service = AIService()
