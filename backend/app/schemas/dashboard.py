import datetime
from pydantic import BaseModel
from typing import List, Dict, Any

class LanguageCount(BaseModel):
    language: str
    count: int
    percentage: float

class QualityTrendPoint(BaseModel):
    id: int
    title: str
    date: str
    score: float

class RecentAnalysisCard(BaseModel):
    id: int
    title: str
    language: str
    quality_score: float
    security_issue_count: int
    created_at: datetime.datetime

class DashboardStats(BaseModel):
    total_analyses: int
    average_quality_score: float
    total_security_issues: int
    languages_analyzed_count: int
    language_distribution: List[LanguageCount]
    quality_trends: List[QualityTrendPoint]
    recent_analyses: List[RecentAnalysisCard]
