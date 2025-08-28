import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app import app
import json

client = TestClient(app)

class TestAPI:
    """Test cases for the SteamNoodles Feedback Agent API"""
    
    def test_root_endpoint(self):
        """Test the root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert data["status"] == "active"
    
    def test_respond_review_valid(self):
        """Test review response with valid input"""
        test_data = {
            "review_text": "The food was great but service was slow",
            "rating": 4
        }
        response = client.post("/respond_review", json=test_data)
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert isinstance(data["response"], str)
        assert len(data["response"]) > 0
    
    def test_respond_review_invalid_rating(self):
        """Test review response with invalid rating"""
        test_data = {
            "review_text": "Great food!",
            "rating": 6  # Invalid rating
        }
        response = client.post("/respond_review", json=test_data)
        assert response.status_code == 400
        assert "Rating must be between 1 and 5" in response.json()["detail"]
    
    def test_respond_review_empty_text(self):
        """Test review response with empty text"""
        test_data = {
            "review_text": "",
            "rating": 5
        }
        response = client.post("/respond_review", json=test_data)
        assert response.status_code == 400
        assert "Review text cannot be empty" in response.json()["detail"]
    
    def test_visualize_sentiment_valid(self):
        """Test sentiment visualization with valid date range"""
        test_data = {
            "date_range": "last 7 days"
        }
        response = client.post("/visualize_sentiment", json=test_data)
        assert response.status_code in [200, 404]  # 404 if no data for range
        
        if response.status_code == 200:
            data = response.json()
            assert "success" in data
            assert "chart_data" in data
            assert "summary" in data
    
    def test_visualize_sentiment_empty_range(self):
        """Test sentiment visualization with empty date range"""
        test_data = {
            "date_range": ""
        }
        response = client.post("/visualize_sentiment", json=test_data)
        assert response.status_code == 400
        assert "Date range cannot be empty" in response.json()["detail"]
    
    def test_sample_reviews_default(self):
        """Test sample reviews with default count"""
        response = client.get("/sample_reviews")
        assert response.status_code == 200
        data = response.json()
        assert "reviews" in data
        assert "total_available" in data
        assert isinstance(data["reviews"], list)
        assert len(data["reviews"]) <= 3  # Default count
    
    def test_sample_reviews_custom_count(self):
        """Test sample reviews with custom count"""
        response = client.get("/sample_reviews?count=5")
        assert response.status_code == 200
        data = response.json()
        assert len(data["reviews"]) <= 5
    
    def test_sample_reviews_invalid_count(self):
        """Test sample reviews with invalid count"""
        response = client.get("/sample_reviews?count=15")  # Above max limit
        assert response.status_code == 422  # Validation error
    
    def test_api_documentation(self):
        """Test that API documentation is accessible"""
        response = client.get("/docs")
        assert response.status_code == 200
        
        response = client.get("/redoc")
        assert response.status_code == 200
        
        response = client.get("/openapi.json")
        assert response.status_code == 200
