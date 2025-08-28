import sqlite3
import pandas as pd
from datetime import datetime
from typing import List, Dict, Optional
import os

class DatabaseManager:
    def __init__(self, db_path: str = "data/feedback_agent.db"):
        self.db_path = db_path
        self.ensure_db_directory()
        self.init_database()
    
    def ensure_db_directory(self):
        """Ensure the database directory exists"""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
    
    def init_database(self):
        """Initialize database tables"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Reviews table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS reviews (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    review_text TEXT NOT NULL,
                    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                    sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
                    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    source TEXT DEFAULT 'user_input'
                )
            ''')
            
            # AI Responses table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS ai_responses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    review_id INTEGER,
                    response_text TEXT NOT NULL,
                    model_used TEXT,
                    response_time_ms INTEGER,
                    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (review_id) REFERENCES reviews (id)
                )
            ''')
            
            # API Usage logs
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS api_usage (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    endpoint TEXT NOT NULL,
                    request_data TEXT,
                    response_status INTEGER,
                    execution_time_ms INTEGER,
                    error_message TEXT,
                    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # User sessions (for future authentication)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS user_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT UNIQUE NOT NULL,
                    user_agent TEXT,
                    ip_address TEXT,
                    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            conn.commit()
    
    def add_review(self, review_text: str, rating: int, sentiment: str, source: str = "user_input") -> int:
        """Add a new review to the database"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO reviews (review_text, rating, sentiment, source)
                VALUES (?, ?, ?, ?)
            ''', (review_text, rating, sentiment, source))
            conn.commit()
            return cursor.lastrowid
    
    def add_ai_response(self, review_id: int, response_text: str, model_used: str, response_time_ms: int) -> int:
        """Add an AI response to the database"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO ai_responses (review_id, response_text, model_used, response_time_ms)
                VALUES (?, ?, ?, ?)
            ''', (review_id, response_text, model_used, response_time_ms))
            conn.commit()
            return cursor.lastrowid
    
    def log_api_usage(self, endpoint: str, request_data: str = None, response_status: int = 200, 
                     execution_time_ms: int = 0, error_message: str = None):
        """Log API usage"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO api_usage (endpoint, request_data, response_status, execution_time_ms, error_message)
                VALUES (?, ?, ?, ?, ?)
            ''', (endpoint, request_data, response_status, execution_time_ms, error_message))
            conn.commit()
    
    def get_reviews(self, limit: int = 100, sentiment: str = None) -> List[Dict]:
        """Get reviews from database"""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            if sentiment:
                cursor.execute('''
                    SELECT * FROM reviews WHERE sentiment = ? 
                    ORDER BY date_created DESC LIMIT ?
                ''', (sentiment, limit))
            else:
                cursor.execute('''
                    SELECT * FROM reviews ORDER BY date_created DESC LIMIT ?
                ''', (limit,))
            
            return [dict(row) for row in cursor.fetchall()]
    
    def get_sentiment_analytics(self, days: int = 30) -> Dict:
        """Get sentiment analytics for the last N days"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT 
                    sentiment,
                    COUNT(*) as count,
                    AVG(rating) as avg_rating
                FROM reviews 
                WHERE date_created >= datetime('now', '-{} days')
                GROUP BY sentiment
            '''.format(days))
            
            results = cursor.fetchall()
            return {
                row[0]: {"count": row[1], "avg_rating": round(row[2], 2)}
                for row in results
            }
    
    def get_api_stats(self, hours: int = 24) -> Dict:
        """Get API usage statistics"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT 
                    endpoint,
                    COUNT(*) as total_calls,
                    AVG(execution_time_ms) as avg_response_time,
                    COUNT(CASE WHEN response_status != 200 THEN 1 END) as error_count
                FROM api_usage 
                WHERE date_created >= datetime('now', '-{} hours')
                GROUP BY endpoint
            '''.format(hours))
            
            results = cursor.fetchall()
            return {
                row[0]: {
                    "total_calls": row[1],
                    "avg_response_time": round(row[2], 2) if row[2] else 0,
                    "error_count": row[3]
                }
                for row in results
            }
