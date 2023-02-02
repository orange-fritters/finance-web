from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sample_model import Model
from sentiment.sentiment_dashboard import SentimentModel

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

@app.get("/sentiment-bar")
async def sentiment_bar():
    return sent_model.sentiment_bar()

@app.get("/sentiment-donut")
async def sentiment_donut():
    return sent_model.sentiment_donut()

@app.get("/tweets-plot/{tiempo}")
async def tweets_plot(tiempo):
    return sent_model.tweets_plot(tiempo)
    
