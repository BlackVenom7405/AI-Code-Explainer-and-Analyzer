import json
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.analysis import AnalysisModel
from app.schemas.analysis import AnalysisResult
from app.services.pdf_service import pdf_service
from app.services.markdown_service import markdown_service
from app.core.exceptions import ResourceNotFoundException

router = APIRouter(prefix="/analyses", tags=["Export"])

@router.get("/{analysis_id}/pdf")
def export_analysis_pdf(analysis_id: int, db: Session = Depends(get_db)):
    item = db.query(AnalysisModel).filter(AnalysisModel.id == analysis_id).first()
    if not item:
        raise ResourceNotFoundException("Analysis")
    
    parsed_json = json.loads(item.analysis_json)
    analysis_result = AnalysisResult(**parsed_json)
    
    pdf_bytes = pdf_service.generate_analysis_pdf(
        title=item.title,
        language=item.language,
        source_code=item.source_code,
        analysis=analysis_result
    )

    clean_filename = f"codelens_analysis_{item.id}_{item.language}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{clean_filename}"'
        }
    )

@router.get("/{analysis_id}/markdown")
def export_analysis_markdown(analysis_id: int, db: Session = Depends(get_db)):
    item = db.query(AnalysisModel).filter(AnalysisModel.id == analysis_id).first()
    if not item:
        raise ResourceNotFoundException("Analysis")

    parsed_json = json.loads(item.analysis_json)
    analysis_result = AnalysisResult(**parsed_json)

    md_content = markdown_service.generate_analysis_markdown(
        title=item.title,
        language=item.language,
        source_code=item.source_code,
        analysis=analysis_result
    )

    clean_filename = f"codelens_analysis_{item.id}_{item.language}.md"
    return Response(
        content=md_content,
        media_type="text/markdown",
        headers={
            "Content-Disposition": f'attachment; filename="{clean_filename}"'
        }
    )
