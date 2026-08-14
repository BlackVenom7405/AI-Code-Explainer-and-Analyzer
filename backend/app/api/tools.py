from fastapi import APIRouter
from app.schemas.analysis import ExplainRequest, RefactorRequest, DocumentRequest
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import ai_service
from app.utils.language_map import normalize_language
from app.core.exceptions import CodeValidationException

router = APIRouter(tags=["AI Tools"])

@router.post("/explain")
async def explain_code(payload: ExplainRequest):
    code_text = payload.code.strip()
    if not code_text:
        raise CodeValidationException("Source code cannot be empty.")
    normalized_lang = normalize_language(payload.language) or "python"
    
    result = await ai_service.explain_code(
        language=normalized_lang,
        code=code_text,
        detail_level=payload.detail_level or "balanced"
    )
    return result

@router.post("/refactor")
async def refactor_code(payload: RefactorRequest):
    code_text = payload.code.strip()
    if not code_text:
        raise CodeValidationException("Source code cannot be empty.")
    normalized_lang = normalize_language(payload.language) or "python"

    result = await ai_service.refactor_code(
        language=normalized_lang,
        code=code_text,
        focus=payload.focus or "clean_and_efficient"
    )
    return result

@router.post("/document")
async def document_code(payload: DocumentRequest):
    code_text = payload.code.strip()
    if not code_text:
        raise CodeValidationException("Source code cannot be empty.")
    normalized_lang = normalize_language(payload.language) or "python"

    markdown_doc = await ai_service.generate_documentation(
        language=normalized_lang,
        code=code_text,
        doc_format=payload.doc_format or "markdown"
    )
    return {"documentation": markdown_doc}

@router.post("/chat", response_model=ChatResponse)
async def chat_about_code(payload: ChatRequest):
    code_text = payload.code.strip()
    if not code_text:
        raise CodeValidationException("Source code cannot be empty for context.")
    if not payload.question.strip():
        raise CodeValidationException("Question cannot be empty.")

    normalized_lang = normalize_language(payload.language) or "python"
    
    reply = await ai_service.chat_about_code(
        language=normalized_lang,
        code=code_text,
        question=payload.question,
        analysis_context=payload.analysis_context,
        history=payload.chat_history
    )
    return ChatResponse(reply=reply)
