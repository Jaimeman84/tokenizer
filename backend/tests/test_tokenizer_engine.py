import pytest
from app.tokenizer.tiktoken_engine import TiktokenEngine


def test_empty_string_returns_empty():
    engine = TiktokenEngine()
    assert engine.tokenize("") == []
    assert engine.count("") == 0


def test_single_word():
    engine = TiktokenEngine()
    tokens = engine.tokenize("hello")
    assert len(tokens) == 1
    assert tokens[0].text == "hello"
    assert tokens[0].index == 0
    assert isinstance(tokens[0].id, int)


def test_token_count_matches_list_length():
    engine = TiktokenEngine()
    text = "What is tokenization?"
    tokens = engine.tokenize(text)
    assert engine.count(text) == len(tokens)


def test_token_indices_are_sequential():
    engine = TiktokenEngine()
    tokens = engine.tokenize("Hello world, how are you?")
    for i, token in enumerate(tokens):
        assert token.index == i


def test_invalid_encoding_raises():
    with pytest.raises(ValueError, match="Unsupported encoding"):
        TiktokenEngine(encoding_name="fake_encoding")


def test_known_token_id():
    engine = TiktokenEngine()
    # "hello" in cl100k_base is token ID 15339
    tokens = engine.tokenize("hello")
    assert tokens[0].id == 15339
