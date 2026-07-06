import spacy
from fastapi import Body, FastAPI

from analyze import analyze_message
from classes import AnalysisResponse, ReplaceRequest

nlp = spacy.load("fr_core_news_sm")

app = FastAPI()


@app.get("/health")
def health_check():
  return "OK"


@app.post("/analyze")
def analyze(body: ReplaceRequest = Body(...)) -> AnalysisResponse:
  related, matched, dets = analyze_message(
    nlp=nlp, text=body.message, match=body.match, replace=body.replace
  )
  return AnalysisResponse(related=related, matched=matched, dets=dets)
