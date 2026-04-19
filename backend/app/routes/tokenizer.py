from fastapi import APIRouter, HTTPException
from app.schemas.tokenizer import TokenizeRequest, TokenizeResponse
from app.services import tokenizer_service

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


@router.post("/tokenize", response_model=TokenizeResponse)
def tokenize(request: TokenizeRequest):
    try:
        return tokenizer_service.tokenize_sections(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Tokenization failed. Please try again.")
