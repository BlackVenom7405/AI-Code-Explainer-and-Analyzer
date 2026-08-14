import datetime
from pydantic import BaseModel, Field
from typing import List, Optional, Union, Dict, Any

class CodeBlockExplanation(BaseModel):
    title: str = Field(..., description="Short title or label for the logical block/function")
    lines: Optional[str] = Field(None, description="Line number range or block identifier (e.g. Lines 1-5)")
    explanation: str = Field(..., description="Explanation of what this section does")

class BugFinding(BaseModel):
    title: str
    severity: str = Field(..., description="Critical, High, Medium, or Low")
    location: Optional[str] = Field(None, description="Line number or code identifier")
    description: str
    recommendation: str

class SecurityIssue(BaseModel):
    title: str
    severity: str = Field(..., description="Critical, High, Medium, or Low")
    location: Optional[str] = Field(None, description="Line number or function where risk exists")
    risk: str = Field(..., description="Summary of potential exploit or vulnerability risk")
    explanation: str
    recommendation: str

class ComplexityAnalysis(BaseModel):
    time: str = Field(..., description="Big-O time complexity (e.g. O(n), O(log n))")
    space: str = Field(..., description="Big-O space complexity (e.g. O(1), O(n))")
    explanation: str = Field(..., description="Step-by-step reasoning and algorithmic assumptions")

class QualityScoreMetrics(BaseModel):
    score: float = Field(..., description="Overall score out of 100")
    readability: float = Field(..., description="Readability rating out of 100")
    maintainability: float = Field(..., description="Maintainability rating out of 100")
    efficiency: float = Field(..., description="Efficiency rating out of 100")
    security: float = Field(..., description="Security rating out of 100")

class OptimizationSuggestion(BaseModel):
    problem: str
    current_approach: str
    recommended_approach: str
    expected_benefit: str

class AnalysisResult(BaseModel):
    summary: str
    purpose: str
    key_components: List[str] = Field(default_factory=list)
    explanation: List[CodeBlockExplanation] = Field(default_factory=list)
    bugs: List[BugFinding] = Field(default_factory=list)
    security_issues: List[SecurityIssue] = Field(default_factory=list)
    complexity: ComplexityAnalysis
    quality: QualityScoreMetrics
    optimizations: List[OptimizationSuggestion] = Field(default_factory=list)
    refactored_code: Optional[str] = ""
    documentation: Optional[str] = ""

# Request models
class AnalyzeRequest(BaseModel):
    language: str
    code: str
    title: Optional[str] = "Untitled Analysis"
    detail_level: Optional[str] = "balanced"  # concise, balanced, detailed

class ExplainRequest(BaseModel):
    language: str
    code: str
    detail_level: Optional[str] = "balanced"

class RefactorRequest(BaseModel):
    language: str
    code: str
    focus: Optional[str] = "clean_and_efficient"

class DocumentRequest(BaseModel):
    language: str
    code: str
    doc_format: Optional[str] = "markdown"

class AnalysisResponse(BaseModel):
    id: Optional[int] = None
    title: str
    language: str
    source_code: str
    analysis: AnalysisResult
    quality_score: float
    security_issue_count: int
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None

class AnalysisListItem(BaseModel):
    id: int
    title: str
    language: str
    quality_score: float
    security_issue_count: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

class AnalysisUpdate(BaseModel):
    title: Optional[str] = None
