"""
WebSocket Manager for Real-time Communication
Handles live sentiment updates, notifications, and real-time data streaming
"""

import json
import asyncio
from typing import Dict, List, Set
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        # Store active connections by type
        self.active_connections: Dict[str, Set[WebSocket]] = {
            "sentiment_live": set(),
            "notifications": set(),
            "analytics": set(),
            "admin": set()
        }
        
        # Store connection metadata
        self.connection_data: Dict[WebSocket, Dict] = {}
        
        # Message queue for offline connections
        self.message_queue: Dict[str, List[Dict]] = {}

    async def connect(self, websocket: WebSocket, connection_type: str = "sentiment_live", 
                     user_id: str = None, restaurant_id: str = None):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        
        if connection_type not in self.active_connections:
            self.active_connections[connection_type] = set()
            
        self.active_connections[connection_type].add(websocket)
        
        # Store connection metadata
        self.connection_data[websocket] = {
            "type": connection_type,
            "user_id": user_id,
            "restaurant_id": restaurant_id,
            "connected_at": datetime.now(),
            "last_ping": datetime.now()
        }
        
        logger.info(f"WebSocket connected: {connection_type} - User: {user_id}")
        
        # Send queued messages if any
        if user_id and user_id in self.message_queue:
            for message in self.message_queue[user_id]:
                await self.send_personal_message(websocket, message)
            del self.message_queue[user_id]

    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.connection_data:
            connection_info = self.connection_data[websocket]
            connection_type = connection_info["type"]
            user_id = connection_info.get("user_id")
            
            if connection_type in self.active_connections:
                self.active_connections[connection_type].discard(websocket)
            
            del self.connection_data[websocket]
            logger.info(f"WebSocket disconnected: {connection_type} - User: {user_id}")

    async def send_personal_message(self, websocket: WebSocket, message: Dict):
        """Send a message to a specific WebSocket connection"""
        try:
            message_with_timestamp = {
                **message,
                "timestamp": datetime.now().isoformat(),
                "type": "message"
            }
            await websocket.send_text(json.dumps(message_with_timestamp))
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            self.disconnect(websocket)

    async def broadcast_to_type(self, connection_type: str, message: Dict):
        """Broadcast a message to all connections of a specific type"""
        if connection_type not in self.active_connections:
            return
            
        disconnected = set()
        message_with_timestamp = {
            **message,
            "timestamp": datetime.now().isoformat(),
            "type": "broadcast"
        }
        
        for websocket in self.active_connections[connection_type].copy():
            try:
                await websocket.send_text(json.dumps(message_with_timestamp))
            except Exception as e:
                logger.error(f"Error broadcasting to {connection_type}: {e}")
                disconnected.add(websocket)
        
        # Clean up disconnected websockets
        for websocket in disconnected:
            self.disconnect(websocket)

    async def broadcast_sentiment_update(self, sentiment_data: Dict):
        """Broadcast real-time sentiment updates"""
        message = {
            "event": "sentiment_update",
            "data": sentiment_data
        }
        await self.broadcast_to_type("sentiment_live", message)
        await self.broadcast_to_type("analytics", message)

    async def send_notification(self, notification_data: Dict, user_id: str = None):
        """Send notifications to users"""
        message = {
            "event": "notification",
            "data": notification_data
        }
        
        if user_id:
            # Send to specific user
            user_connections = [
                ws for ws in self.connection_data 
                if self.connection_data[ws].get("user_id") == user_id
            ]
            
            if user_connections:
                for websocket in user_connections:
                    await self.send_personal_message(websocket, message)
            else:
                # Queue message for when user connects
                if user_id not in self.message_queue:
                    self.message_queue[user_id] = []
                self.message_queue[user_id].append(message)
        else:
            # Broadcast to all notification connections
            await self.broadcast_to_type("notifications", message)

    async def send_analytics_update(self, analytics_data: Dict):
        """Send real-time analytics updates"""
        message = {
            "event": "analytics_update",
            "data": analytics_data
        }
        await self.broadcast_to_type("analytics", message)

    async def ping_connections(self):
        """Send ping to all connections to keep them alive"""
        ping_message = {
            "event": "ping",
            "data": {"timestamp": datetime.now().isoformat()}
        }
        
        for connection_type in self.active_connections:
            await self.broadcast_to_type(connection_type, ping_message)

    def get_connection_stats(self) -> Dict:
        """Get statistics about active connections"""
        stats = {
            "total_connections": sum(len(connections) for connections in self.active_connections.values()),
            "connections_by_type": {
                conn_type: len(connections) 
                for conn_type, connections in self.active_connections.items()
            },
            "connection_details": []
        }
        
        for websocket, data in self.connection_data.items():
            stats["connection_details"].append({
                "type": data["type"],
                "user_id": data.get("user_id"),
                "restaurant_id": data.get("restaurant_id"),
                "connected_at": data["connected_at"].isoformat(),
                "duration": str(datetime.now() - data["connected_at"])
            })
            
        return stats

# Global connection manager instance
connection_manager = ConnectionManager()

class RealTimeNotificationService:
    """Service for managing real-time notifications"""
    
    def __init__(self, connection_manager: ConnectionManager):
        self.connection_manager = connection_manager
        
    async def notify_negative_review(self, review_data: Dict):
        """Send urgent notification for negative reviews"""
        notification = {
            "type": "urgent",
            "category": "negative_review",
            "title": "🚨 Negative Review Alert",
            "message": f"New negative review received (Rating: {review_data.get('rating', 'N/A')})",
            "review_data": review_data,
            "priority": "high",
            "actions": [
                {"label": "Respond Now", "action": "respond_review"},
                {"label": "View Details", "action": "view_review"}
            ]
        }
        
        await self.connection_manager.send_notification(notification)
    
    async def notify_sentiment_spike(self, spike_data: Dict):
        """Notify about sudden sentiment changes"""
        notification = {
            "type": "info",
            "category": "sentiment_change",
            "title": "📈 Sentiment Trend Alert",
            "message": f"Sentiment {spike_data['direction']} detected: {spike_data['change']}%",
            "data": spike_data,
            "priority": "medium"
        }
        
        await self.connection_manager.send_notification(notification)
    
    async def notify_milestone(self, milestone_data: Dict):
        """Notify about achievements and milestones"""
        notification = {
            "type": "success",
            "category": "milestone",
            "title": "🎉 Milestone Achieved",
            "message": milestone_data['message'],
            "data": milestone_data,
            "priority": "low"
        }
        
        await self.connection_manager.send_notification(notification)

# Global notification service instance
notification_service = RealTimeNotificationService(connection_manager)

class SentimentStreamProcessor:
    """Processes and streams sentiment data in real-time"""
    
    def __init__(self, connection_manager: ConnectionManager):
        self.connection_manager = connection_manager
        self.sentiment_buffer = []
        self.buffer_size = 10
        self.last_analysis = {}
        
    async def process_new_review(self, review_data: Dict):
        """Process a new review and update real-time sentiment"""
        # Add to buffer
        self.sentiment_buffer.append(review_data)
        
        # Keep buffer size manageable
        if len(self.sentiment_buffer) > self.buffer_size:
            self.sentiment_buffer.pop(0)
        
        # Calculate current sentiment distribution
        current_sentiment = self._calculate_current_sentiment()
        
        # Detect significant changes
        if self.last_analysis:
            change_detected = self._detect_sentiment_change(current_sentiment)
            if change_detected:
                await notification_service.notify_sentiment_spike(change_detected)
        
        # Update last analysis
        self.last_analysis = current_sentiment
        
        # Broadcast update
        await self.connection_manager.broadcast_sentiment_update({
            "current_sentiment": current_sentiment,
            "recent_reviews": len(self.sentiment_buffer),
            "latest_review": review_data
        })
    
    def _calculate_current_sentiment(self) -> Dict:
        """Calculate current sentiment distribution from buffer"""
        if not self.sentiment_buffer:
            return {"positive": 0, "neutral": 0, "negative": 0, "total": 0}
        
        sentiment_counts = {"positive": 0, "neutral": 0, "negative": 0}
        
        for review in self.sentiment_buffer:
            sentiment = review.get('sentiment', 'neutral')
            if sentiment in sentiment_counts:
                sentiment_counts[sentiment] += 1
        
        total = len(self.sentiment_buffer)
        sentiment_percentages = {
            sentiment: (count / total) * 100 
            for sentiment, count in sentiment_counts.items()
        }
        sentiment_percentages['total'] = total
        
        return sentiment_percentages
    
    def _detect_sentiment_change(self, current_sentiment: Dict) -> Dict:
        """Detect significant sentiment changes"""
        threshold = 20  # 20% change threshold
        
        for sentiment_type in ['positive', 'negative']:
            current_pct = current_sentiment.get(sentiment_type, 0)
            last_pct = self.last_analysis.get(sentiment_type, 0)
            
            change = current_pct - last_pct
            
            if abs(change) >= threshold:
                return {
                    "sentiment_type": sentiment_type,
                    "direction": "increased" if change > 0 else "decreased",
                    "change": round(abs(change), 1),
                    "current_percentage": round(current_pct, 1),
                    "previous_percentage": round(last_pct, 1)
                }
        
        return None

# Global sentiment processor instance
sentiment_processor = SentimentStreamProcessor(connection_manager)
