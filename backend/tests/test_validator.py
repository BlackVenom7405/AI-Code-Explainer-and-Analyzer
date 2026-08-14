import pytest
from app.utils.language_map import normalize_language, detect_language_from_filename
from app.core.security import sanitize_text

def test_language_normalization():
    assert normalize_language("python") == "python"
    assert normalize_language("Python") == "python"
    assert normalize_language("JS") == "javascript"
    assert normalize_language("c++") == "cpp"
    assert normalize_language("html") == "html"
    assert normalize_language("unknown_lang_xyz") is None

def test_language_detection_from_filename():
    assert detect_language_from_filename("main.py") == "python"
    assert detect_language_from_filename("App.jsx") is None
    assert detect_language_from_filename("index.js") == "javascript"
    assert detect_language_from_filename("Solution.java") == "java"
    assert detect_language_from_filename("algo.cpp") == "cpp"
    assert detect_language_from_filename("schema.sql") == "sql"

def test_sanitize_text():
    dirty = "def foo():\x00\x08 return 42\n"
    cleaned = sanitize_text(dirty)
    assert "\x00" not in cleaned
    assert "\x08" not in cleaned
    assert "def foo(): return 42\n" == cleaned
