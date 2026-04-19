from abc import ABC, abstractmethod
from typing import List
from app.schemas.tokenizer import TokenData


class TokenizerEngine(ABC):
    @abstractmethod
    def tokenize(self, text: str) -> List[TokenData]:
        ...

    @abstractmethod
    def count(self, text: str) -> int:
        ...
