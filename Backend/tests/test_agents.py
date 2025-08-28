import pytest
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.feedback_response import FeedbackResponseAgent
from agents.sentiment_visualiztion import SentimentVisualizationAgent
from utils.data_loader import load_review_data
from utils.data_preprocessor import preprocess_data
import pandas as pd
import tempfile

class TestAgents:
    """Test cases for the AI agents"""
    
    def setup_method(self):
        """Setup test data before each test"""
        self.feedback_agent = FeedbackResponseAgent()
        self.viz_agent = SentimentVisualizationAgent()
    
    def test_feedback_agent_positive_review(self):
        """Test feedback agent with positive review"""
        response = self.feedback_agent.generate_response("Amazing food and great service!", 5)
        assert isinstance(response, str)
        assert len(response) > 0
        assert len(response) <= 200  # Response should be concise
    
    def test_feedback_agent_negative_review(self):
        """Test feedback agent with negative review"""
        response = self.feedback_agent.generate_response("Terrible food, slow service", 1)
        assert isinstance(response, str)
        assert len(response) > 0
    
    def test_feedback_agent_neutral_review(self):
        """Test feedback agent with neutral review"""
        response = self.feedback_agent.generate_response("Food was okay, nothing special", 3)
        assert isinstance(response, str)
        assert len(response) > 0

class TestDataProcessing:
    """Test cases for data processing utilities"""
    
    def test_data_loader(self):
        """Test data loading functionality"""
        # This test requires the processed data file to exist
        data_path = "data/processed_reviews.csv"
        if os.path.exists(data_path):
            df = load_review_data(data_path)
            assert isinstance(df, pd.DataFrame)
            assert not df.empty
            assert 'sentiment' in df.columns
            assert 'rating' in df.columns
            assert 'review_text' in df.columns
    
    def test_data_preprocessor(self):
        """Test data preprocessing functionality"""
        # Create a temporary test CSV file
        test_data = {
            'Review Text': ['Great food!', 'Terrible service', 'Average meal'],
            'Rating': [5, 1, 3],
            'Date': ['01/01/2022', '01/02/2022', '01/03/2022']
        }
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
            test_df = pd.DataFrame(test_data)
            test_df.to_csv(f.name, index=False)
            
            # Test preprocessing
            with tempfile.NamedTemporaryFile(suffix='.csv', delete=False) as output_f:
                result_df = preprocess_data(f.name, output_f.name)
                
                assert isinstance(result_df, pd.DataFrame)
                assert not result_df.empty
                assert 'sentiment' in result_df.columns
                assert 'rating' in result_df.columns
                
                # Clean up
                os.unlink(f.name)
                os.unlink(output_f.name)
