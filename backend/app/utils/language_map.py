from typing import Dict, Optional

SUPPORTED_LANGUAGES: Dict[str, Dict[str, str]] = {
    "python": {
        "name": "Python",
        "extension": ".py",
        "monaco_id": "python",
        "mime": "text/x-python"
    },
    "javascript": {
        "name": "JavaScript",
        "extension": ".js",
        "monaco_id": "javascript",
        "mime": "application/javascript"
    },
    "java": {
        "name": "Java",
        "extension": ".java",
        "monaco_id": "java",
        "mime": "text/x-java-source"
    },
    "c": {
        "name": "C",
        "extension": ".c",
        "monaco_id": "c",
        "mime": "text/x-c"
    },
    "cpp": {
        "name": "C++",
        "extension": ".cpp",
        "monaco_id": "cpp",
        "mime": "text/x-c++src"
    },
    "html": {
        "name": "HTML",
        "extension": ".html",
        "monaco_id": "html",
        "mime": "text/html"
    },
    "css": {
        "name": "CSS",
        "extension": ".css",
        "monaco_id": "css",
        "mime": "text/css"
    },
    "sql": {
        "name": "SQL",
        "extension": ".sql",
        "monaco_id": "sql",
        "mime": "text/x-sql"
    }
}

EXTENSION_TO_LANG: Dict[str, str] = {
    ".py": "python",
    ".js": "javascript",
    ".java": "java",
    ".c": "c",
    ".cpp": "cpp",
    ".cc": "cpp",
    ".cxx": "cpp",
    ".h": "c",
    ".hpp": "cpp",
    ".html": "html",
    ".htm": "html",
    ".css": "css",
    ".sql": "sql"
}

def normalize_language(lang: str) -> Optional[str]:
    cleaned = lang.strip().lower()
    if cleaned in SUPPORTED_LANGUAGES:
        return cleaned
    if cleaned in ["js", "node"]:
        return "javascript"
    if cleaned in ["py"]:
        return "python"
    if cleaned in ["c++", "cplusplus"]:
        return "cpp"
    return None

def detect_language_from_filename(filename: str) -> Optional[str]:
    import os
    _, ext = os.path.splitext(filename.lower())
    return EXTENSION_TO_LANG.get(ext)
