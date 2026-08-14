from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.security import SecurityHeadersMiddleware
from app.core.exceptions import (
    GeminiApiKeyMissingException, AIAnalysisFailedException, 
    CodeValidationException, ResourceNotFoundException
)
from app.database.base import Base
from app.database.session import engine
from app.api.analyses import router as analyses_router
from app.api.tools import router as tools_router
from app.api.dashboard import router as dashboard_router
from app.api.export import router as export_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables on startup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CodeLens AI - Source Code Explanation and Security Analysis Platform API",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers
app.add_middleware(SecurityHeadersMiddleware)

# Custom Exception Handlers
@app.exception_handler(GeminiApiKeyMissingException)
async def gemini_missing_handler(request: Request, exc: GeminiApiKeyMissingException):
    return JSONResponse(status_code=exc.status_code, content=exc.detail)

@app.exception_handler(AIAnalysisFailedException)
async def ai_failed_handler(request: Request, exc: AIAnalysisFailedException):
    return JSONResponse(status_code=exc.status_code, content=exc.detail)

@app.exception_handler(CodeValidationException)
async def validation_handler(request: Request, exc: CodeValidationException):
    return JSONResponse(status_code=exc.status_code, content=exc.detail)

@app.exception_handler(ResourceNotFoundException)
async def not_found_handler(request: Request, exc: ResourceNotFoundException):
    return JSONResponse(status_code=exc.status_code, content=exc.detail)

# Register API Routers
app.include_router(analyses_router, prefix="/api")
app.include_router(tools_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(export_router, prefix="/api")

@app.get("/api/health")
def health_check():
    has_key = bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip())
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_engine_configured": has_key
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to CodeLens AI API",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
