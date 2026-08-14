import json
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.analysis import AnalysisModel
from app.schemas.analysis import (
    AnalyzeRequest, AnalysisResponse, AnalysisListItem, AnalysisUpdate, AnalysisResult
)
from app.services.ai_service import ai_service
from app.utils.language_map import normalize_language
from app.utils.file_validator import validate_and_read_uploaded_file
from app.core.exceptions import CodeValidationException, ResourceNotFoundException

router = APIRouter(prefix="/analyses", tags=["Analyses"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_code(payload: AnalyzeRequest, db: Session = Depends(get_db)):
    code_text = payload.code.strip()
    if not code_text:
        raise CodeValidationException("Source code cannot be empty.")
    
    normalized_lang = normalize_language(payload.language)
    if not normalized_lang:
        raise CodeValidationException(f"Unsupported programming language '{payload.language}'.")

    # Run AI Analysis
    analysis_result: AnalysisResult = await ai_service.analyze_code(
        language=normalized_lang,
        code=code_text,
        detail_level=payload.detail_level or "balanced"
    )

    # Save to SQLite Database
    title = payload.title.strip() if payload.title and payload.title.strip() != "Untitled Analysis" else f"{normalized_lang.title()} Analysis: {analysis_result.purpose[:40]}..."
    
    db_item = AnalysisModel(
        title=title,
        language=normalized_lang,
        source_code=code_text,
        analysis_json=json.dumps(analysis_result.model_dump()),
        quality_score=analysis_result.quality.score,
        security_issue_count=len(analysis_result.security_issues)
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    return AnalysisResponse(
        id=db_item.id,
        title=db_item.title,
        language=db_item.language,
        source_code=db_item.source_code,
        analysis=analysis_result,
        quality_score=db_item.quality_score,
        security_issue_count=db_item.security_issue_count,
        created_at=db_item.created_at,
        updated_at=db_item.updated_at
    )

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Uploads a source file (max 1MB) and returns plain text code and detected language. Never executes code."""
    code_text, detected_lang = await validate_and_read_uploaded_file(file)
    return {
        "filename": file.filename,
        "language": detected_lang,
        "code": code_text,
        "size_bytes": len(code_text.encode("utf-8"))
    }

@router.get("", response_model=List[AnalysisListItem])
def list_analyses(
    search: Optional[str] = Query(None, description="Search by title"),
    language: Optional[str] = Query(None, description="Filter by language"),
    min_quality: Optional[float] = Query(None, description="Minimum quality score"),
    has_security_issues: Optional[bool] = Query(None, description="Filter items with security findings"),
    db: Session = Depends(get_db)
):
    query = db.query(AnalysisModel)

    if search:
        query = query.filter(AnalysisModel.title.ilike(f"%{search}%"))
    if language:
        query = query.filter(AnalysisModel.language == language.lower())
    if min_quality is not None:
        query = query.filter(AnalysisModel.quality_score >= min_quality)
    if has_security_issues is True:
        query = query.filter(AnalysisModel.security_issue_count > 0)
    elif has_security_issues is False:
        query = query.filter(AnalysisModel.security_issue_count == 0)

    items = query.order_by(AnalysisModel.created_at.desc()).all()
    return items

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    item = db.query(AnalysisModel).filter(AnalysisModel.id == analysis_id).first()
    if not item:
        raise ResourceNotFoundException("Analysis")
    
    parsed_json = json.loads(item.analysis_json)
    return AnalysisResponse(
        id=item.id,
        title=item.title,
        language=item.language,
        source_code=item.source_code,
        analysis=AnalysisResult(**parsed_json),
        quality_score=item.quality_score,
        security_issue_count=item.security_issue_count,
        created_at=item.created_at,
        updated_at=item.updated_at
    )

@router.put("/{analysis_id}", response_model=AnalysisListItem)
def update_analysis(analysis_id: int, payload: AnalysisUpdate, db: Session = Depends(get_db)):
    item = db.query(AnalysisModel).filter(AnalysisModel.id == analysis_id).first()
    if not item:
        raise ResourceNotFoundException("Analysis")

    if payload.title is not None:
        item.title = payload.title.strip()
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{analysis_id}")
def delete_analysis(analysis_id: int, db: Session = Depends(get_db)):
    item = db.query(AnalysisModel).filter(AnalysisModel.id == analysis_id).first()
    if not item:
        raise ResourceNotFoundException("Analysis")
    
    db.delete(item)
    db.commit()
    return {"message": "Analysis deleted successfully", "id": analysis_id}
