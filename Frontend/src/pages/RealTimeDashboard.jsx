import React, { useState, useEffect, useRef } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  TimeScale
);

const RealTimeDashboard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnecting...');
  const [sentimentData, setSentimentData] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
    total: 0
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sentimentHistory, setSentimentHistory] = useState([]);
  const [connectionStats, setConnectionStats] = useState({});

  // WebSocket references
  const sentimentWs = useRef(null);
  const notificationWs = useRef(null);
  const analyticsWs = useRef(null);

  // Connection management
  useEffect(() => {
    connectWebSockets();
    return () => {
      disconnectWebSockets();
    };
  }, []);

  const connectWebSockets = () => {
    const wsUrl = 'ws://127.0.0.1:8000';
    
    try {
      // Sentiment WebSocket
      sentimentWs.current = new WebSocket(`${wsUrl}/ws/sentiment-live?user_id=dashboard_user`);
      
      sentimentWs.current.onopen = () => {
        console.log('Sentiment WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('Connected to live sentiment feed');
      };

      sentimentWs.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleSentimentMessage(message);
      };

      sentimentWs.current.onclose = () => {
        console.log('Sentiment WebSocket disconnected');
        setIsConnected(false);
        setConnectionStatus('Disconnected - Attempting to reconnect...');
        // Auto-reconnect after 3 seconds
        setTimeout(connectWebSockets, 3000);
      };

      sentimentWs.current.onerror = (error) => {
        console.error('Sentiment WebSocket error:', error);
        setConnectionStatus('Connection error');
      };

      // Notifications WebSocket
      notificationWs.current = new WebSocket(`${wsUrl}/ws/notifications?user_id=dashboard_user`);
      
      notificationWs.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleNotificationMessage(message);
      };

      // Analytics WebSocket
      analyticsWs.current = new WebSocket(`${wsUrl}/ws/analytics?user_id=dashboard_user`);
      
      analyticsWs.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleAnalyticsMessage(message);
      };

    } catch (error) {
      console.error('Error connecting WebSockets:', error);
      setConnectionStatus('Failed to connect');
    }
  };

  const disconnectWebSockets = () => {
    if (sentimentWs.current) {
      sentimentWs.current.close();
    }
    if (notificationWs.current) {
      notificationWs.current.close();
    }
    if (analyticsWs.current) {
      analyticsWs.current.close();
    }
  };

  // Message handlers
  const handleSentimentMessage = (message) => {
    console.log('Sentiment message received:', message);
    
    if (message.event === 'sentiment_update') {
      const { current_sentiment, recent_reviews, latest_review } = message.data;
      
      setSentimentData(current_sentiment);
      
      // Add to sentiment history for the line chart
      setSentimentHistory(prev => {
        const newEntry = {
          timestamp: new Date().toISOString(),
          ...current_sentiment
        };
        const updated = [...prev, newEntry];
        // Keep only last 20 data points
        return updated.slice(-20);
      });

      // Add latest review to recent reviews
      if (latest_review) {
        setRecentReviews(prev => {
          const updated = [latest_review, ...prev];
          // Keep only last 10 reviews
          return updated.slice(0, 10);
        });
      }
    }
  };

  const handleNotificationMessage = (message) => {
    console.log('Notification message received:', message);
    
    if (message.event === 'notification') {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...message.data
      };
      
      setNotifications(prev => {
        const updated = [notification, ...prev];
        // Keep only last 10 notifications
        return updated.slice(0, 10);
      });
    }
  };

  const handleAnalyticsMessage = (message) => {
    console.log('Analytics message received:', message);
    
    if (message.event === 'analytics_update') {
      setConnectionStats(message.data.connections || {});
    }
  };

  // Chart configurations
  const sentimentPieData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [sentimentData.positive, sentimentData.neutral, sentimentData.negative],
        backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
        borderColor: ['#059669', '#2563eb', '#dc2626'],
        borderWidth: 2,
      },
    ],
  };

  const sentimentLineData = {
    labels: sentimentHistory.map(item => 
      new Date(item.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: 'Positive %',
        data: sentimentHistory.map(item => item.positive),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Negative %',
        data: sentimentHistory.map(item => item.negative),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '📝';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent': return '🚨';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      default: return '🔔';
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">📊 Real-Time Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${isConnected ? '#10b981' : '#ef4444'}30`
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isConnected ? '#10b981' : '#ef4444'
              }}></span>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: isConnected ? '#10b981' : '#ef4444'
              }}>
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            <p className="card-subtitle" style={{ margin: 0 }}>
              {connectionStatus}
            </p>
          </div>
        </div>

        <div className="card-content">
          {/* Real-time Statistics */}
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-value">{sentimentData.total}</div>
              <div className="stat-label">Total Reviews</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#10b981' }}>
                {sentimentData.positive?.toFixed(1)}%
              </div>
              <div className="stat-label">😊 Positive</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#3b82f6' }}>
                {sentimentData.neutral?.toFixed(1)}%
              </div>
              <div className="stat-label">😐 Neutral</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#ef4444' }}>
                {sentimentData.negative?.toFixed(1)}%
              </div>
              <div className="stat-label">😞 Negative</div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Sentiment Distribution */}
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Current Sentiment Distribution
                </h3>
                <div style={{ height: '300px' }}>
                  <Doughnut data={sentimentPieData} options={pieOptions} />
                </div>
              </div>
            </div>

            {/* Sentiment Trends */}
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Live Sentiment Trends
                </h3>
                <div style={{ height: '300px' }}>
                  <Line data={sentimentLineData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Live Feed Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Recent Reviews */}
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  🔴 Live Reviews Feed
                </h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {recentReviews.length > 0 ? (
                    recentReviews.map((review, index) => (
                      <div key={index} style={{
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        background: 'var(--background-secondary)',
                        borderRadius: '0.75rem',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <span style={{ fontSize: '1.25rem' }}>
                              {getSentimentIcon(review.sentiment)}
                            </span>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              textTransform: 'capitalize'
                            }}>
                              {review.sentiment}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)'
                          }}>
                            Rating: {review.rating}/5
                          </div>
                        </div>
                        <p style={{
                          fontSize: '0.875rem',
                          lineHeight: '1.4',
                          margin: 0,
                          color: 'var(--text-primary)'
                        }}>
                          "{review.review_text}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
                      <p>Waiting for live reviews...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Live Notifications */}
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  🔔 Live Notifications
                </h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} style={{
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        background: notification.type === 'urgent' ? 'rgba(239, 68, 68, 0.05)' :
                                   notification.type === 'success' ? 'rgba(16, 185, 129, 0.05)' :
                                   'rgba(59, 130, 246, 0.05)',
                        borderRadius: '0.75rem',
                        border: `1px solid ${notification.type === 'urgent' ? '#ef4444' :
                                              notification.type === 'success' ? '#10b981' :
                                              '#3b82f6'}20`
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem'
                        }}>
                          <span style={{ fontSize: '1.25rem' }}>
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              margin: '0 0 0.25rem 0',
                              color: 'var(--text-primary)'
                            }}>
                              {notification.title}
                            </h4>
                            <p style={{
                              fontSize: '0.8rem',
                              lineHeight: '1.4',
                              margin: '0 0 0.5rem 0',
                              color: 'var(--text-secondary)'
                            }}>
                              {notification.message}
                            </p>
                            <div style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-secondary)'
                            }}>
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔕</div>
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Connection Statistics */}
          {Object.keys(connectionStats).length > 0 && (
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  📡 Connection Statistics
                </h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{connectionStats.total_connections || 0}</div>
                    <div className="stat-label">Active Connections</div>
                  </div>
                  {connectionStats.connections_by_type && Object.entries(connectionStats.connections_by_type).map(([type, count]) => (
                    <div key={type} className="stat-card">
                      <div className="stat-value">{count}</div>
                      <div className="stat-label">{type.replace('_', ' ')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
