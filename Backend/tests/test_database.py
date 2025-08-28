import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.database import DatabaseManager
import tempfile

class TestDatabase:
    """Test cases for database functionality"""
    
    def setup_method(self):
        """Setup test database before each test"""
        # Create temporary database for testing
        self.temp_db = tempfile.NamedTemporaryFile(suffix='.db', delete=False)
        self.db_manager = DatabaseManager(self.temp_db.name)
    
    def teardown_method(self):
        """Clean up after each test"""
        os.unlink(self.temp_db.name)
    
    def test_add_review(self):
        """Test adding a review to database"""
        review_id = self.db_manager.add_review(
            "Great food!", 5, "positive", "test"
        )
        assert isinstance(review_id, int)
        assert review_id > 0
    
    def test_add_ai_response(self):
        """Test adding an AI response to database"""
        # First add a review
        review_id = self.db_manager.add_review(
            "Good service", 4, "positive", "test"
        )
        
        # Then add response
        response_id = self.db_manager.add_ai_response(
            review_id, "Thank you for your feedback!", "llama3-8b-8192", 1500
        )
        assert isinstance(response_id, int)
        assert response_id > 0
    
    def test_get_reviews(self):
        """Test retrieving reviews from database"""
        # Add test reviews
        self.db_manager.add_review("Amazing!", 5, "positive", "test")
        self.db_manager.add_review("Terrible", 1, "negative", "test")
        
        reviews = self.db_manager.get_reviews(limit=10)
        assert isinstance(reviews, list)
        assert len(reviews) >= 2
        
        # Test filtering by sentiment
        positive_reviews = self.db_manager.get_reviews(limit=10, sentiment="positive")
        assert len(positive_reviews) >= 1
    
    def test_sentiment_analytics(self):
        """Test sentiment analytics functionality"""
        # Add test data
        self.db_manager.add_review("Great!", 5, "positive", "test")
        self.db_manager.add_review("Good", 4, "positive", "test")
        self.db_manager.add_review("Bad", 2, "negative", "test")
        
        analytics = self.db_manager.get_sentiment_analytics(days=30)
        assert isinstance(analytics, dict)
        assert "positive" in analytics
        assert "negative" in analytics
    
    def test_api_stats(self):
        """Test API statistics functionality"""
        # Log some API usage
        self.db_manager.log_api_usage("/test", "test_data", 200, 100)
        self.db_manager.log_api_usage("/test", "test_data", 500, 200, "Test error")
        
        stats = self.db_manager.get_api_stats(hours=24)
        assert isinstance(stats, dict)
        if "/test" in stats:
            assert "total_calls" in stats["/test"]
            assert "error_count" in stats["/test"]
