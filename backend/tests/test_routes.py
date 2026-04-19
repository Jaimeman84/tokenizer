import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_tokenize_single_section():
    response = client.post("/tokenize", json={
        "sections": [{"label": "user", "text": "Hello world"}]
    })
    assert response.status_code == 200
    data = response.json()
    assert data["total_token_count"] > 0
    assert len(data["sections"]) == 1
    assert data["sections"][0]["label"] == "user"
    assert len(data["sections"][0]["tokens"]) > 0


def test_tokenize_two_sections():
    response = client.post("/tokenize", json={
        "sections": [
            {"label": "system", "text": "You are a helpful assistant."},
            {"label": "user", "text": "What is tokenization?"},
        ]
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data["sections"]) == 2
    assert data["total_token_count"] == sum(
        s["token_count"] for s in data["sections"]
    )


def test_tokenize_empty_text():
    response = client.post("/tokenize", json={
        "sections": [{"label": "user", "text": ""}]
    })
    assert response.status_code == 200
    data = response.json()
    assert data["total_token_count"] == 0
    assert data["sections"][0]["tokens"] == []


def test_tokenize_invalid_encoding():
    response = client.post("/tokenize", json={
        "sections": [{"label": "user", "text": "hello"}],
        "encoding": "not_real"
    })
    assert response.status_code == 400


def test_tokenize_response_includes_token_ids():
    response = client.post("/tokenize", json={
        "sections": [{"label": "user", "text": "hello"}]
    })
    data = response.json()
    token = data["sections"][0]["tokens"][0]
    assert "id" in token
    assert "text" in token
    assert "index" in token
