from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from agents.feedback_response import FeedbackResponseAgent
from agents.sentiment_visualiztion import SentimentVisualizationAgent
from utils.data_loader import load_review_data
from utils.data_preprocessor import preprocess_data
from utils.logger import setup_logger, log_api_call
import os
from dotenv import load_dotenv

from utils.database import DatabaseManager
from utils.batch_processor import BatchProcessor
from fastapi import UploadFile, File
import json
import time

load_dotenv()

# Setup logger
logger = setup_logger("steamnoodles_api", os.getenv("LOG_LEVEL", "INFO"))

# Initialize database and batch processor
db_manager = DatabaseManager()
batch_processor = BatchProcessor()

app = FastAPI(
    title="SteamNoodles Feedback Agent API",
    description="AI-powered restaurant feedback analysis and response system",
    version="1.0.0"
)

# Allow CORS for frontend
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    logger.info("Root endpoint accessed")
    return {
        "message": "Welcome to the Beyond Flavours Feedback Agent API!",
        "version": "1.0.0",
        "status": "active"
    }

# Models
class ReviewRequest(BaseModel):
    review_text: str = "The food was amazing but service was slow."
    rating: int = 4

    class Config:
        schema_extra = {
            "example": {
                "review_text": "The noodles were delicious but the wait time was too long.",
                "rating": 3
            }
        }

class VisualizationRequest(BaseModel):
    date_range: str = "last 7 days"

    class Config:
        schema_extra = {
            "example": {
                "date_range": "last 30 days"
            }
        }

class ResponseModel(BaseModel):
    response: str

class VisualizationResponse(BaseModel):
    success: bool
    chart_data: Dict[str, Any]
    summary: Dict[str, Any]

class SampleReviewsResponse(BaseModel):
    reviews: List[Dict[str, Any]]
    total_available: int

class BatchProcessingResponse(BaseModel):
    total_reviews: int
    successful: int
    failed: int
    success_rate: float
    total_processing_time: float
    average_time_per_review: float

class AnalyticsResponse(BaseModel):
    sentiment_analytics: Dict[str, Dict[str, Any]]
    api_stats: Dict[str, Dict[str, Any]]
    total_reviews: int

# Initialize agents
feedback_agent = FeedbackResponseAgent()
viz_agent = SentimentVisualizationAgent()
processed_data_path = "data/processed_reviews.csv"
raw_data_path = "data/raw_reviews.csv"

@app.on_event("startup")
def startup_event():
    logger.info("Starting SteamNoodles Feedback Agent API")
    logger.info(f"Processed data path: {processed_data_path}")
    logger.info(f"Raw data path: {raw_data_path}")
    
    if not os.path.exists(processed_data_path):
        if os.path.exists(raw_data_path):
            logger.info("Preprocessing raw data...")
            preprocess_data(raw_data_path, processed_data_path)
            logger.info("Data preprocessing completed")
        else:
            logger.warning("No raw data file found for preprocessing")

@app.post("/respond_review", 
          response_model=ResponseModel,
          summary="Generate AI Response to Customer Review",
          description="Generate a professional, context-aware response to customer feedback using AI")
def respond_review(request: ReviewRequest):
    """
    Generate an AI-powered response to customer reviews.
    
    - **review_text**: The customer's review text
    - **rating**: Rating from 1-5 stars
    
    Returns a polite, professional response under 100 words.
    """
    try:
        logger.info(f"Received review response request - Rating: {request.rating}")
        
        if not request.review_text.strip():
            raise HTTPException(status_code=400, detail="Review text cannot be empty")
        if request.rating < 1 or request.rating > 5:
            raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
        
        response = feedback_agent.generate_response(request.review_text, request.rating)
        
        log_api_call(logger, "/respond_review", 
                    {"rating": request.rating, "review_length": len(request.review_text)},
                    {"response_generated": True})
        
        return {"response": response}
    except HTTPException:
        log_api_call(logger, "/respond_review", None, None, "Validation error")
        raise
    except Exception as e:
        error_msg = f"Error generating response: {str(e)}"
        log_api_call(logger, "/respond_review", None, None, error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/visualize_sentiment",
          response_model=VisualizationResponse,
          summary="Generate Sentiment Analysis Visualization", 
          description="Create sentiment trend charts for specified date ranges")
def visualize_sentiment(request: VisualizationRequest):
    """
    Generate sentiment analysis visualization for a given date range.
    
    - **date_range**: Date range to analyze (e.g., "last 7 days", "Jan 1 2022 to Jan 31 2022")
    
    Returns chart data compatible with Chart.js and summary statistics.
    """
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

@app.get("/sample_reviews",
         response_model=SampleReviewsResponse,
         summary="Get Random Sample Reviews",
         description="Retrieve random sample reviews from the dataset")
def sample_reviews(count: int = Query(3, ge=1, le=10, description="Number of sample reviews to retrieve (1-10)")):
    """
    Get random sample reviews from the dataset.
    
    - **count**: Number of reviews to retrieve (1-10)
    
    Returns sample reviews with rating, text, and sentiment.
    """
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

# New Advanced Endpoints

@app.post("/batch_process",
          response_model=BatchProcessingResponse,
          summary="Batch Process Reviews",
          description="Process multiple reviews in batch for AI responses")
async def batch_process_reviews(file: UploadFile = File(...)):
    """
    Process multiple reviews from uploaded CSV file.
    
    Expected CSV format: columns 'review_text' and 'rating'
    
    Returns processing summary with success/failure statistics.
    """
    try:
        import tempfile
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Process the file
        summary = batch_processor.process_csv_file(temp_file_path)
        
        # Clean up
        os.unlink(temp_file_path)
        
        return summary
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in batch processing: {str(e)}")

@app.get("/analytics",
         response_model=AnalyticsResponse,
         summary="Get System Analytics",
         description="Retrieve comprehensive analytics about reviews and API usage")
def get_analytics(days: int = Query(30, ge=1, le=365, description="Number of days to analyze")):
    """
    Get comprehensive system analytics.
    
    - **days**: Number of days to analyze (1-365)
    
    Returns sentiment analytics, API statistics, and review counts.
    """
    try:
        sentiment_analytics = db_manager.get_sentiment_analytics(days=days)
        api_stats = db_manager.get_api_stats(hours=days * 24)
        
        # Get total review count
        reviews = db_manager.get_reviews(limit=1000000)  # Get all reviews
        total_reviews = len(reviews)
        
        return {
            "sentiment_analytics": sentiment_analytics,
            "api_stats": api_stats,
            "total_reviews": total_reviews
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics: {str(e)}")

@app.get("/health",
         summary="Health Check",
         description="Check system health and status")
def health_check():
    """
    Health check endpoint for monitoring system status.
    """
    try:
        # Check database connectivity
        db_manager.get_reviews(limit=1)
        
        # Check if data files exist
        data_status = {
            "processed_data_exists": os.path.exists(processed_data_path),
            "raw_data_exists": os.path.exists(raw_data_path)
        }
        
        return {
            "status": "healthy",
            "timestamp": time.time(),
            "data_status": data_status,
            "version": "1.0.0"
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": time.time(),
            "error": str(e),
            "version": "1.0.0"
        }
