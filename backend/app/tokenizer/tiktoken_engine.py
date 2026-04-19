import tiktoken
from typing import List
from app.tokenizer.base import TokenizerEngine
from app.schemas.tokenizer import TokenData

SUPPORTED_ENCODINGS = {"cl100k_base", "o200k_base", "p50k_base"}


class TiktokenEngine(TokenizerEngine):
    def __init__(self, encoding_name: str = "cl100k_base"):
        if encoding_name not in SUPPORTED_ENCODINGS:
            raise ValueError(
                f"Unsupported encoding '{encoding_name}'. "
                f"Supported: {sorted(SUPPORTED_ENCODINGS)}"
            )
        self._encoding = tiktoken.get_encoding(encoding_name)

    def tokenize(self, text: str) -> List[TokenData]:
        if not text:
            return []
        token_ids = self._encoding.encode(text)
        tokens = []
        for index, token_id in enumerate(token_ids):
            raw_bytes = self._encoding.decode_single_token_bytes(token_id)
            token_text = raw_bytes.decode("utf-8", errors="replace")
            tokens.append(TokenData(text=token_text, id=token_id, index=index))
        return tokens

    def count(self, text: str) -> int:
        if not text:
            return 0
        return len(self._encoding.encode(text))
