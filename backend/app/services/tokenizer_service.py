from app.schemas.tokenizer import (
    TokenizeRequest,
    TokenizeResponse,
    TokenSectionResponse,
)
from app.tokenizer.tiktoken_engine import TiktokenEngine


def tokenize_sections(request: TokenizeRequest) -> TokenizeResponse:
    engine = TiktokenEngine(encoding_name=request.encoding)

    section_results = []
    for section in request.sections:
        tokens = engine.tokenize(section.text)
        section_results.append(
            TokenSectionResponse(
                label=section.label,
                tokens=tokens,
                token_count=len(tokens),
                char_count=len(section.text),
            )
        )

    total_token_count = sum(s.token_count for s in section_results)
    total_char_count = sum(s.char_count for s in section_results)

    return TokenizeResponse(
        sections=section_results,
        total_token_count=total_token_count,
        total_char_count=total_char_count,
        encoding=request.encoding,
    )
