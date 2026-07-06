from pydantic import BaseModel
from spacy.tokens.token import Token


class WordMatch(BaseModel):
  gender: str
  number: str
  word: str


class ReplaceRequest(BaseModel):
  message: str
  match: WordMatch
  replace: WordMatch


class RelatedWord(BaseModel):
  word: str
  wordIndex: int
  lemma: str
  position: int
  dep: str
  targetGender: str
  targetNumber: str
  gender: str
  number: str


class MatchedWord(BaseModel):
  word: str
  wordIndex: int
  lemma: str
  position: int
  dep: str


class AnalysisResponse(BaseModel):
  related: list[RelatedWord]
  matched: list[MatchedWord]
  dets: list[RelatedWord]


class RelatedToken:
  token: Token
  related_to_token: Token

  def __init__(self, token: Token, related_to_token: Token):
    self.token = token
    self.related_to_token = related_to_token
