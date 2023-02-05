import json
from typing import List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sample_model import Model
from sentiment.sentiment_dashboard import SentimentModel
from portfolio.portfolio_model import PortfolioModel
from pydantic import BaseModel

app = FastAPI()
model = Model()
sent_model = SentimentModel()

# origins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://172.30.1.25:3000"]
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/home-predictions")
async def home():
    return model.prediction(20)

### Sentiment Model ###
@app.get("/sentiment-bar")
async def sentiment_bar():
    return sent_model.sentiment_bar()

@app.get("/sentiment-donut")
async def sentiment_donut():
    return sent_model.sentiment_donut()

@app.get("/tweets-plot/{tiempo}")
async def tweets_plot(tiempo):
    return sent_model.tweets_plot(tiempo)

### Portfolio Model ###
portfolio_model = PortfolioModel()

class Item(BaseModel):
    name: str
    value: float

class ItemList(BaseModel):
    data: List[Item]

@app.post("/set-stocks")
async def portfolio(value: ItemList):
    portfolio_model.set_stocks(value.dict()['data'])
    return json.dumps({"status": "ok"})

@app.get("/check-weight")
async def check_weight():
    return json.dumps(portfolio_model.weights)

@app.get("/auto-optimize")
async def auto_optimize():
    return portfolio_model.auto_optimize()

@app.get("/portfolio-value-over-time")
async def portfolio_value_over_time():
    return portfolio_model.portfolio_value_over_time()

@app.get("/scatter-plot")
async def scatter_plot():
    return portfolio_model.scatter_plot()

@app.get("/daily-return")
async def daily_return():
    return portfolio_model.daily_return()

@app.get("/return-hist")
async def return_hist():
    return portfolio_model.return_hist()

@app.get("/risk-distribution")
async def risk_distribution():
    return portfolio_model.risk_distribution()