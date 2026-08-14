import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from app.database.base import Base

class AnalysisModel(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False, default="Untitled Analysis")
    language = Column(String(50), nullable=False, default="python")
    source_code = Column(Text, nullable=False)
    analysis_json = Column(Text, nullable=False)  # Serialized JSON analysis output
    quality_score = Column(Float, nullable=False, default=0.0)
    security_issue_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
