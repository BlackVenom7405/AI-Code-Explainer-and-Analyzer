import json
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.base import Base
from app.database.session import engine, SessionLocal
from app.models.analysis import AnalysisModel

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    # Clean up
    db = SessionLocal()
    db.query(AnalysisModel).delete()
    db.commit()
    db.close()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_dashboard_empty_stats():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_analyses"] == 0
    assert data["average_quality_score"] == 0.0

def test_manual_analysis_lifecycle_and_export():
    # Insert a sample analysis directly to test list, get, delete, pdf, markdown export
    db = SessionLocal()
    sample_analysis_json = {
        "summary": "Finds the maximum integer in a list.",
        "purpose": "Algorithm utility function.",
        "key_components": ["find_max loop"],
        "explanation": [{"title": "Loop", "lines": "1-6", "explanation": "Iterates over numbers"}],
        "bugs": [],
        "security_issues": [],
        "complexity": {"time": "O(n)", "space": "O(1)", "explanation": "Single linear pass."},
        "quality": {"score": 90.0, "readability": 95.0, "maintainability": 90.0, "efficiency": 90.0, "security": 100.0},
        "optimizations": [{"problem": "None", "current_approach": "linear", "recommended_approach": "built-in max()", "expected_benefit": "faster C-level execution"}],
        "refactored_code": "def find_max(numbers):\n    return max(numbers) if numbers else None",
        "documentation": "# find_max Documentation\nReturns max value."
    }
    
    item = AnalysisModel(
        title="Test Find Max",
        language="python",
        source_code="def find_max(numbers):\n    return max(numbers)",
        analysis_json=json.dumps(sample_analysis_json),
        quality_score=90.0,
        security_issue_count=0
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    saved_id = item.id
    db.close()

    # 1. Test List
    res_list = client.get("/api/analyses")
    assert res_list.status_code == 200
    assert len(res_list.json()) == 1
    assert res_list.json()[0]["title"] == "Test Find Max"

    # 2. Test Get
    res_get = client.get(f"/api/analyses/{saved_id}")
    assert res_get.status_code == 200
    data = res_get.json()
    assert data["analysis"]["complexity"]["time"] == "O(n)"
    assert data["analysis"]["quality"]["score"] == 90.0

    # 3. Test Dashboard Stats populated
    res_dash = client.get("/api/dashboard")
    assert res_dash.status_code == 200
    dash_data = res_dash.json()
    assert dash_data["total_analyses"] == 1
    assert dash_data["average_quality_score"] == 90.0

    # 4. Test PDF Export
    res_pdf = client.get(f"/api/analyses/{saved_id}/pdf")
    assert res_pdf.status_code == 200
    assert res_pdf.headers["content-type"] == "application/pdf"
    assert len(res_pdf.content) > 100

    # 5. Test Markdown Export
    res_md = client.get(f"/api/analyses/{saved_id}/markdown")
    assert res_md.status_code == 200
    assert res_md.headers["content-type"].startswith("text/markdown")
    assert "# Test Find Max" in res_md.text

    # 6. Test Delete
    res_del = client.delete(f"/api/analyses/{saved_id}")
    assert res_del.status_code == 200
    
    # 7. Verify Not Found
    res_get_after = client.get(f"/api/analyses/{saved_id}")
    assert res_get_after.status_code == 404
