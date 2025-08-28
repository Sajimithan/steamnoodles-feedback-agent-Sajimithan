# API Documentation

## SteamNoodles Feedback Agent API

### Overview
The SteamNoodles Feedback Agent API provides AI-powered restaurant feedback analysis and response generation capabilities.

### Base URL
```
http://127.0.0.1:8000
```

### Authentication
Currently, no authentication is required. API key validation is handled internally for AI services.

---

## Endpoints

### 1. Health Check
**GET** `/health`

Check system health and status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": 1693353600,
  "data_status": {
    "processed_data_exists": true,
    "raw_data_exists": true
  },
  "version": "1.0.0"
}
```

### 2. Generate AI Response
**POST** `/respond_review`

Generate professional AI responses to customer reviews.

**Request:**
```json
{
  "review_text": "The food was amazing but service was slow",
  "rating": 4
}
```

**Response:**
```json
{
  "response": "Thank you for your positive feedback about our food! We sincerely apologize for the slow service and are working to improve our response times. We appreciate your patience and hope to serve you better next time."
}
```

### 3. Sentiment Visualization
**POST** `/visualize_sentiment`

Generate sentiment analysis charts for specified date ranges.

**Request:**
```json
{
  "date_range": "last 30 days"
}
```

**Response:**
```json
{
  "success": true,
  "chart_data": {
    "labels": ["positive", "neutral", "negative"],
    "datasets": [...]
  },
  "summary": {
    "total_reviews": 150,
    "sentiment_counts": {
      "positive": 80,
      "neutral": 45,
      "negative": 25
    },
    "date_range": "last 30 days"
  }
}
```

### 4. Sample Reviews
**GET** `/sample_reviews?count=5`

Retrieve random sample reviews from the dataset.

**Parameters:**
- `count` (optional): Number of reviews to retrieve (1-10, default: 3)

**Response:**
```json
{
  "reviews": [
    {
      "rating": 5,
      "review_text": "Excellent food and service!",
      "sentiment": "positive"
    }
  ],
  "total_available": 19898
}
```

### 5. Batch Processing
**POST** `/batch_process`

Process multiple reviews from uploaded CSV file.

**Request:** Upload CSV file with columns: `review_text`, `rating`

**Response:**
```json
{
  "total_reviews": 100,
  "successful": 98,
  "failed": 2,
  "success_rate": 98.0,
  "total_processing_time": 45.2,
  "average_time_per_review": 0.452
}
```

### 6. Analytics
**GET** `/analytics?days=30`

Get comprehensive system analytics.

**Parameters:**
- `days` (optional): Number of days to analyze (1-365, default: 30)

**Response:**
```json
{
  "sentiment_analytics": {
    "positive": {"count": 120, "avg_rating": 4.5},
    "neutral": {"count": 50, "avg_rating": 3.0},
    "negative": {"count": 30, "avg_rating": 1.8}
  },
  "api_stats": {
    "/respond_review": {
      "total_calls": 500,
      "avg_response_time": 1250.5,
      "error_count": 5
    }
  },
  "total_reviews": 200
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "detail": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, consider implementing rate limiting based on your requirements.

---

## Interactive Documentation

Visit `http://127.0.0.1:8000/docs` for interactive Swagger documentation where you can test all endpoints directly in your browser.
