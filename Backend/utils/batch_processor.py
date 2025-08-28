import pandas as pd
from typing import List, Dict, Any
import asyncio
import time
from concurrent.futures import ThreadPoolExecutor
import os
from utils.logger import setup_logger
from agents.feedback_response import FeedbackResponseAgent
from utils.database import DatabaseManager

class BatchProcessor:
    """
    Batch processing system for handling multiple reviews
    """
    
    def __init__(self, max_workers: int = 4):
        self.max_workers = max_workers
        self.logger = setup_logger("batch_processor")
        self.feedback_agent = FeedbackResponseAgent()
        self.db_manager = DatabaseManager()
    
    def process_review_batch(self, reviews: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Process a batch of reviews sequentially
        
        Args:
            reviews: List of review dictionaries with 'review_text' and 'rating'
        
        Returns:
            List of processed reviews with AI responses
        """
        results = []
        
        for i, review in enumerate(reviews):
            self.logger.info(f"Processing review {i+1}/{len(reviews)}")
            
            try:
                start_time = time.time()
                
                # Generate AI response
                response = self.feedback_agent.generate_response(
                    review['review_text'], 
                    review['rating']
                )
                
                processing_time = int((time.time() - start_time) * 1000)
                
                # Determine sentiment based on rating
                sentiment = self._determine_sentiment(review['rating'])
                
                # Store in database
                review_id = self.db_manager.add_review(
                    review['review_text'],
                    review['rating'],
                    sentiment,
                    "batch_processing"
                )
                
                response_id = self.db_manager.add_ai_response(
                    review_id,
                    response,
                    "llama3-8b-8192",
                    processing_time
                )
                
                result = {
                    "review_id": review_id,
                    "response_id": response_id,
                    "original_review": review['review_text'],
                    "rating": review['rating'],
                    "sentiment": sentiment,
                    "ai_response": response,
                    "processing_time_ms": processing_time,
                    "status": "success"
                }
                
                results.append(result)
                
            except Exception as e:
                self.logger.error(f"Error processing review {i+1}: {str(e)}")
                results.append({
                    "original_review": review['review_text'],
                    "rating": review['rating'],
                    "error": str(e),
                    "status": "failed"
                })
        
        return results
    
    def process_csv_file(self, file_path: str, output_path: str = None) -> Dict[str, Any]:
        """
        Process reviews from a CSV file
        
        Args:
            file_path: Path to input CSV file
            output_path: Optional path for output CSV file
        
        Returns:
            Processing summary
        """
        self.logger.info(f"Starting batch processing of {file_path}")
        
        try:
            # Load CSV file
            df = pd.read_csv(file_path)
            
            # Validate required columns
            required_columns = ['review_text', 'rating']
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Convert to list of dictionaries
            reviews = df.to_dict('records')
            
            # Process reviews
            start_time = time.time()
            results = self.process_review_batch(reviews)
            total_time = time.time() - start_time
            
            # Save results if output path provided
            if output_path:
                results_df = pd.DataFrame(results)
                results_df.to_csv(output_path, index=False)
                self.logger.info(f"Results saved to {output_path}")
            
            # Calculate summary
            successful = len([r for r in results if r.get('status') == 'success'])
            failed = len([r for r in results if r.get('status') == 'failed'])
            
            summary = {
                "total_reviews": len(reviews),
                "successful": successful,
                "failed": failed,
                "success_rate": (successful / len(reviews)) * 100 if reviews else 0,
                "total_processing_time": total_time,
                "average_time_per_review": total_time / len(reviews) if reviews else 0
            }
            
            self.logger.info(f"Batch processing completed: {summary}")
            return summary
            
        except Exception as e:
            self.logger.error(f"Error in batch processing: {str(e)}")
            raise
    
    def _determine_sentiment(self, rating: int) -> str:
        """Determine sentiment based on rating"""
        if rating >= 4:
            return "positive"
        elif rating <= 2:
            return "negative"
        else:
            return "neutral"

    async def process_review_batch_async(self, reviews: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Process a batch of reviews asynchronously for better performance
        """
        loop = asyncio.get_event_loop()
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            tasks = []
            
            for review in reviews:
                task = loop.run_in_executor(
                    executor,
                    self._process_single_review,
                    review
                )
                tasks.append(task)
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Handle exceptions
            processed_results = []
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    self.logger.error(f"Error processing review {i}: {str(result)}")
                    processed_results.append({
                        "original_review": reviews[i]['review_text'],
                        "rating": reviews[i]['rating'],
                        "error": str(result),
                        "status": "failed"
                    })
                else:
                    processed_results.append(result)
            
            return processed_results
    
    def _process_single_review(self, review: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single review (used by async processing)"""
        try:
            start_time = time.time()
            
            response = self.feedback_agent.generate_response(
                review['review_text'], 
                review['rating']
            )
            
            processing_time = int((time.time() - start_time) * 1000)
            sentiment = self._determine_sentiment(review['rating'])
            
            return {
                "original_review": review['review_text'],
                "rating": review['rating'],
                "sentiment": sentiment,
                "ai_response": response,
                "processing_time_ms": processing_time,
                "status": "success"
            }
            
        except Exception as e:
            return {
                "original_review": review['review_text'],
                "rating": review['rating'],
                "error": str(e),
                "status": "failed"
            }
