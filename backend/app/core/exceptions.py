from fastapi import HTTPException, status

class GeminiApiKeyMissingException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "GEMINI_API_KEY_MISSING",
                "message": "Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable in your .env file."
            }
        )

class AIAnalysisFailedException(HTTPException):
    def __init__(self, message: str = "AI analysis failed to generate a valid structured response."):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={
                "error": "AI_ANALYSIS_FAILED",
                "message": message
            }
        )

class CodeValidationException(HTTPException):
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "CODE_VALIDATION_ERROR",
                "message": message
            }
        )

class ResourceNotFoundException(HTTPException):
    def __init__(self, resource: str = "Analysis"):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "error": "RESOURCE_NOT_FOUND",
                "message": f"{resource} not found."
            }
        )
