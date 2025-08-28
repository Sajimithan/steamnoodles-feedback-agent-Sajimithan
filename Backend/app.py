from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
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
    try:
        if not request.review_text.strip():
            raise HTTPException(status_code=400, detail="Review text cannot be empty")
        if request.rating < 1 or request.rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        
        response = feedback_agent.generate_response(request.review_text, request.rating)
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/visualize_sentiment")
def visualize_sentiment(request: VisualizationRequest):
    try:
        if not request.date_range.strip():
            raise HTTPException(status_code=400, detail="Date range cannot be empty")
        
        data, chart_data = viz_agent.generate_visualization(request.date_range)
        if data is not None and chart_data is not None:
            return {
                "success": True,
                "chart_data": chart_data,
                "summary": {
                    "total_reviews": len(data),
                    "sentiment_counts": data['sentiment'].value_counts().to_dict(),
                    "date_range": request.date_range
                }
            }
        else:
            raise HTTPException(status_code=404, detail="No data found for the specified date range")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating visualization: {str(e)}")

@app.get("/sample_reviews")
def sample_reviews(count: int = Query(3, ge=1, le=10)):
    try:
        if not os.path.exists(processed_data_path):
            raise HTTPException(status_code=404, detail="Processed data file not found")
        
        df = load_review_data(processed_data_path)
        if len(df) == 0:
            raise HTTPException(status_code=404, detail="No review data available")
        
        sample_count = min(count, len(df))
        samples = df.sample(sample_count)
        reviews = [
            {
                "rating": int(row["rating"]), 
                "review_text": row["review_text"],
                "sentiment": row["sentiment"]
            }
            for _, row in samples.iterrows()
        ]
        return {"reviews": reviews, "total_available": len(df)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sample reviews: {str(e)}")
