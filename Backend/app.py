from fastapi import FastAPI, Query, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from agents.feedback_response import FeedbackResponseAgent
from agents.sentiment_visualiztion import SentimentVisualizationAgent
from utils.data_loader import load_review_data
from utils.data_preprocessor import preprocess_data
from utils.logger import setup_logger, log_api_call
from utils.websocket_manager import connection_manager, notification_service, sentiment_processor
import os
from dotenv import load_dotenv
import asyncio
import json

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
async def respond_review(request: ReviewRequest):
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
        
        # Determine sentiment based on rating
        sentiment = "positive" if request.rating >= 4 else "negative" if request.rating <= 2 else "neutral"
        
        # Create review data for real-time processing
        review_data = {
            "review_text": request.review_text,
            "rating": request.rating,
            "sentiment": sentiment,
            "timestamp": time.time(),
            "response_generated": True,
            "response_text": response
        }
        
        # Process for real-time updates
        await sentiment_processor.process_new_review(review_data)
        
        # Send notification for negative reviews
        if sentiment == "negative":
            await notification_service.notify_negative_review(review_data)
        
        # Store in database
        try:
            db_manager.store_review_response(review_data, response)
        except Exception as db_error:
            logger.warning(f"Failed to store in database: {db_error}")
        
        log_api_call(logger, "/respond_review", 
                    {"rating": request.rating, "review_length": len(request.review_text)},
                    {"response_generated": True, "sentiment": sentiment})
        
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

# =============================================================================
# WEBSOCKET ENDPOINTS FOR REAL-TIME FEATURES
# =============================================================================

@app.websocket("/ws/sentiment-live")
async def websocket_sentiment_live(websocket: WebSocket, user_id: Optional[str] = None):
    """WebSocket endpoint for real-time sentiment updates"""
    await connection_manager.connect(websocket, "sentiment_live", user_id)
    
    try:
        # Send initial data
        initial_data = {
            "event": "connected",
            "data": {
                "message": "Connected to live sentiment feed",
                "user_id": user_id
            }
        }
        await connection_manager.send_personal_message(websocket, initial_data)
        
        # Keep connection alive and handle incoming messages
        while True:
            try:
                # Wait for messages from client (like ping responses)
                data = await websocket.receive_text()
                message = json.loads(data)
                
                if message.get("type") == "ping":
                    await connection_manager.send_personal_message(websocket, {
                        "event": "pong",
                        "data": {"timestamp": message.get("timestamp")}
                    })
                    
            except WebSocketDisconnect:
                break
            except Exception as e:
                logger.error(f"Error in sentiment WebSocket: {e}")
                break
                
    except WebSocketDisconnect:
        logger.info("Sentiment WebSocket disconnected")
    finally:
        connection_manager.disconnect(websocket)

@app.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket, user_id: Optional[str] = None):
    """WebSocket endpoint for real-time notifications"""
    await connection_manager.connect(websocket, "notifications", user_id)
    
    try:
        # Send welcome notification
        welcome_notification = {
            "event": "notification",
            "data": {
                "type": "info",
                "title": "🔔 Notifications Connected",
                "message": "You will now receive real-time notifications",
                "priority": "low"
            }
        }
        await connection_manager.send_personal_message(websocket, welcome_notification)
        
        # Keep connection alive
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Handle client actions
                if message.get("type") == "mark_read":
                    # Handle marking notifications as read
                    notification_id = message.get("notification_id")
                    logger.info(f"Notification {notification_id} marked as read by user {user_id}")
                    
            except WebSocketDisconnect:
                break
            except Exception as e:
                logger.error(f"Error in notifications WebSocket: {e}")
                break
                
    except WebSocketDisconnect:
        logger.info("Notifications WebSocket disconnected")
    finally:
        connection_manager.disconnect(websocket)

@app.websocket("/ws/analytics")
async def websocket_analytics(websocket: WebSocket, user_id: Optional[str] = None):
    """WebSocket endpoint for real-time analytics updates"""
    await connection_manager.connect(websocket, "analytics", user_id)
    
    try:
        # Send initial analytics data
        initial_analytics = {
            "event": "analytics_update",
            "data": {
                "message": "Connected to live analytics feed",
                "connections": connection_manager.get_connection_stats(),
                "timestamp": time.time()
            }
        }
        await connection_manager.send_personal_message(websocket, initial_analytics)
        
        # Keep connection alive
        while True:
            try:
                data = await websocket.receive_text()
                # Handle any analytics-specific messages
                
            except WebSocketDisconnect:
                break
            except Exception as e:
                logger.error(f"Error in analytics WebSocket: {e}")
                break
                
    except WebSocketDisconnect:
        logger.info("Analytics WebSocket disconnected")
    finally:
        connection_manager.disconnect(websocket)

@app.get("/api/websocket/stats",
         summary="Get WebSocket connection statistics",
         description="Returns information about active WebSocket connections")
async def get_websocket_stats():
    """Get statistics about WebSocket connections"""
    return connection_manager.get_connection_stats()

# =============================================================================
# ENHANCED ENDPOINTS WITH REAL-TIME FEATURES
# =============================================================================

# Update the respond_review endpoint to include real-time features
