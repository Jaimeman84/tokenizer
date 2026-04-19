from pydantic import BaseModel, Field
from typing import List


class TokenData(BaseModel):
    text: str
    id: int
    index: int


class TokenSectionRequest(BaseModel):
    label: str
    text: str = Field(default="", max_length=10000)


class TokenSectionResponse(BaseModel):
    label: str
    tokens: List[TokenData]
    token_count: int
    char_count: int


class TokenizeRequest(BaseModel):
    sections: List[TokenSectionRequest] = Field(min_length=1, max_length=3)
    encoding: str = "cl100k_base"


class TokenizeResponse(BaseModel):
    sections: List[TokenSectionResponse]
    total_token_count: int
    total_char_count: int
    encoding: str
