import logging
import os
from datetime import datetime

def setup_logger(name: str = "steamnoodles_feedback", log_level: str = "INFO"):
    """
    Setup logger with file and console handlers
    """
    # Create logs directory if it doesn't exist
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    # Configure logger
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, log_level.upper()))
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger
    
    # Create formatters
    file_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
    )
    console_formatter = logging.Formatter(
        '%(levelname)s - %(message)s'
    )
    
    # File handler
    log_file = os.path.join(log_dir, f"app_{datetime.now().strftime('%Y%m%d')}.log")
    file_handler = logging.FileHandler(log_file)
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(file_formatter)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(console_formatter)
    
    # Add handlers to logger
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

def log_api_call(logger, endpoint: str, request_data: dict = None, response_data: dict = None, error: str = None):
    """
    Log API call details
    """
    log_data = {
        "endpoint": endpoint,
        "timestamp": datetime.now().isoformat(),
        "request_data": request_data,
        "response_data": response_data,
        "error": error
    }
    
    if error:
        logger.error(f"API Error - {endpoint}: {error}", extra=log_data)
    else:
        logger.info(f"API Success - {endpoint}", extra=log_data)
