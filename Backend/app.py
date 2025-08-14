from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from agents.feedback_response import FeedbackResponseAgent
from agents.sentiment_visualiztion import SentimentVisualizationAgent
from utils.data_loader import load_review_data
from utils.data_preprocessor import preprocess_data
import os


app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Beyond Flavours Feedback Agent API!"}

# Models
class ReviewRequest(BaseModel):
    review_text: str
    rating: int

class VisualizationRequest(BaseModel):
    date_range: str

# Initialize agents
feedback_agent = FeedbackResponseAgent()
viz_agent = SentimentVisualizationAgent()
processed_data_path = "data/processed_reviews.csv"
raw_data_path = "data/raw_reviews.csv"

@app.on_event("startup")
def startup_event():
    if not os.path.exists(processed_data_path):
        if os.path.exists(raw_data_path):
            preprocess_data(raw_data_path, processed_data_path)

@app.post("/respond_review")
def respond_review(request: ReviewRequest):
    response = feedback_agent.generate_response(request.review_text, request.rating)
    return {"response": response}

@app.post("/visualize_sentiment")
def visualize_sentiment(request: VisualizationRequest):
    fig = viz_agent.generate_visualization(request.date_range)
    if fig is not None:
        # For demo, just return a success message
        return {"message": "Visualization generated."}
    else:
        return {"error": "No visualization generated - check date range and try again"}

@app.get("/sample_reviews")
def sample_reviews(count: int = Query(3, ge=1, le=10)):
    df = load_review_data(processed_data_path)
    samples = df.sample(count)
    reviews = [
        {"rating": row["rating"], "review_text": row["review_text"]}
        for _, row in samples.iterrows()
    ]
    return {"reviews": reviews}
