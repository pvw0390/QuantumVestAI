from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from stock_service import get_stock_data
from ai_service import analyze_news_sentiment

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "QuantumVest AI API Running"}

@app.get("/stock/{ticker}")
def stock_info(ticker: str):
    return get_stock_data(ticker)

@app.get("/sentiment/{ticker}")
def sentiment(ticker: str):
    return analyze_news_sentiment(ticker)