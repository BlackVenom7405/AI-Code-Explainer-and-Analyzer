from typing import List, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.analysis import AnalysisModel
from app.schemas.dashboard import (
    DashboardStats, LanguageCount, QualityTrendPoint, RecentAnalysisCard
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_analyses = db.query(AnalysisModel).count()
    
    if total_analyses == 0:
        return DashboardStats(
            total_analyses=0,
            average_quality_score=0.0,
            total_security_issues=0,
            languages_analyzed_count=0,
            language_distribution=[],
            quality_trends=[],
            recent_analyses=[]
        )

    # Average quality score
    avg_score = db.query(func.avg(AnalysisModel.quality_score)).scalar() or 0.0
    
    # Total security issues
    total_security = db.query(func.sum(AnalysisModel.security_issue_count)).scalar() or 0

    # Language breakdown
    lang_records = db.query(
        AnalysisModel.language,
        func.count(AnalysisModel.id).label("count")
    ).group_by(AnalysisModel.language).all()

    lang_distribution: List[LanguageCount] = []
    for lang, count in lang_records:
        pct = round((count / total_analyses) * 100, 1)
        lang_distribution.append(
            LanguageCount(language=lang.title(), count=count, percentage=pct)
        )

    # Sort language distribution by highest count
    lang_distribution.sort(key=lambda x: x.count, reverse=True)

    # Quality trends: last 15 analyses in chronological order
    recent_trend_rows = db.query(AnalysisModel).order_by(AnalysisModel.created_at.desc()).limit(15).all()
    recent_trend_rows.reverse()
    
    quality_trends = [
        QualityTrendPoint(
            id=row.id,
            title=row.title[:20],
            date=row.created_at.strftime("%b %d, %H:%M") if row.created_at else "",
            score=round(row.quality_score, 1)
        )
        for row in recent_trend_rows
    ]

    # Recent 6 analyses for cards
    recent_analyses_rows = db.query(AnalysisModel).order_by(AnalysisModel.created_at.desc()).limit(6).all()
    recent_analyses = [
        RecentAnalysisCard(
            id=row.id,
            title=row.title,
            language=row.language,
            quality_score=row.quality_score,
            security_issue_count=row.security_issue_count,
            created_at=row.created_at
        )
        for row in recent_analyses_rows
    ]

    return DashboardStats(
        total_analyses=total_analyses,
        average_quality_score=round(float(avg_score), 1),
        total_security_issues=int(total_security),
        languages_analyzed_count=len(lang_records),
        language_distribution=lang_distribution,
        quality_trends=quality_trends,
        recent_analyses=recent_analyses
    )
