# Test configuration and fixtures
import os
import sys

# Add the backend directory to Python path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Test settings
TEST_DATABASE_PATH = "test_data/test_feedback_agent.db"
TEST_CSV_PATH = "test_data/test_reviews.csv"

def setup_test_environment():
    """Setup test environment"""
    # Create test data directory
    os.makedirs("test_data", exist_ok=True)
    
def cleanup_test_environment():
    """Cleanup test environment"""
    # Remove test files
    if os.path.exists(TEST_DATABASE_PATH):
        os.remove(TEST_DATABASE_PATH)
    if os.path.exists(TEST_CSV_PATH):
        os.remove(TEST_CSV_PATH)
