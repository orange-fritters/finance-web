from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sample_model import Model

app = FastAPI()
model = Model()

# origins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://172.30.1.25:3000"]
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return model.prediction(20)
