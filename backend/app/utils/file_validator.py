import os
from fastapi import UploadFile
from app.core.config import settings
from app.core.exceptions import CodeValidationException
from app.utils.language_map import detect_language_from_filename

ALLOWED_EXTENSIONS = {".py", ".java", ".c", ".cpp", ".cc", ".cxx", ".h", ".hpp", ".js", ".html", ".htm", ".css", ".sql"}

async def validate_and_read_uploaded_file(file: UploadFile) -> tuple[str, str]:
    """
    Validates uploaded file extension, size, and plain-text encoding.
    Returns (filename, decoded_content, detected_language).
    NEVER executes the code.
    """
    if not file.filename:
        raise CodeValidationException("Invalid filename.")

    _, ext = os.path.splitext(file.filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise CodeValidationException(f"Unsupported file type '{ext}'. Supported: {', '.join(sorted(ALLOWED_EXTENSIONS))}")

    # Read bytes with size limit check
    content_bytes = await file.read(settings.MAX_FILE_SIZE_BYTES + 1)
    if len(content_bytes) > settings.MAX_FILE_SIZE_BYTES:
        raise CodeValidationException(f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB.")

    if len(content_bytes) == 0:
        raise CodeValidationException("Uploaded file is empty.")

    # Validate plain-text decode
    try:
        content_text = content_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            content_text = content_bytes.decode("latin-1")
        except Exception:
            raise CodeValidationException("File is not valid text/source code.")

    detected_lang = detect_language_from_filename(file.filename) or "python"
    return content_text, detected_lang
