import React, { useState, useEffect, useRef } from 'react';

const RealTimeDashboard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
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

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '';
      case 'negative': return '';
      case 'neutral': return '';
      default: return '';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent': return '';
      case 'info': return '';
      case 'success': return '';
      case 'warning': return '';
      default: return '';
    }
  };

  return (
    <div className="page-container">
      {/* Hero Image Section */}
      <div style={{
        height: '200px',
        backgroundImage: 'url(/kitchen-live.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.8) 0%, rgba(220, 38, 38, 0.6) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '2rem'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: '800',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span className="icon icon-live"></span>
            Live Kitchen Dashboard
          </h1>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <span className="icon icon-live"></span>
            Real-Time Dashboard
          </h1>
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
              <div className="stat-label">Positive</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#3b82f6' }}>
                {sentimentData.neutral?.toFixed(1)}%
              </div>
              <div className="stat-label">Neutral</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#ef4444' }}>
                {sentimentData.negative?.toFixed(1)}%
              </div>
              <div className="stat-label">Negative</div>
            </div>
          </div>

          {/* Sentiment Visualization - Simple HTML/CSS Charts */}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Positive Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Positive</span>
                      <span style={{ fontSize: '0.875rem', color: '#10b981' }}>{sentimentData.positive?.toFixed(1)}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${sentimentData.positive || 0}%`,
                        height: '100%',
                        backgroundColor: '#10b981',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Neutral Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Neutral</span>
                      <span style={{ fontSize: '0.875rem', color: '#3b82f6' }}>{sentimentData.neutral?.toFixed(1)}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${sentimentData.neutral || 0}%`,
                        height: '100%',
                        backgroundColor: '#3b82f6',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Negative Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Negative</span>
                      <span style={{ fontSize: '0.875rem', color: '#ef4444' }}>{sentimentData.negative?.toFixed(1)}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${sentimentData.negative || 0}%`,
                        height: '100%',
                        backgroundColor: '#ef4444',
                        transition: 'width 0.5s ease'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment History */}
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Live Sentiment Trends
                </h3>
                <div style={{ 
                  height: '200px', 
                  display: 'flex', 
                  alignItems: 'end', 
                  justifyContent: 'space-between',
                  gap: '2px',
                  padding: '1rem',
                  background: 'var(--background-secondary)',
                  borderRadius: '0.5rem'
                }}>
                  {sentimentHistory.length > 0 ? (
                    sentimentHistory.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                        height: '100%'
                      }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'end',
                          height: '160px',
                          gap: '1px'
                        }}>
                          {/* Positive bar */}
                          <div style={{
                            width: '20px',
                            height: `${(item.positive / 100) * 50}px`,
                            backgroundColor: '#10b981',
                            borderRadius: '2px 2px 0 0'
                          }}></div>
                          {/* Negative bar */}
                          <div style={{
                            width: '20px',
                            height: `${(item.negative / 100) * 50}px`,
                            backgroundColor: '#ef4444',
                            borderRadius: '0 0 2px 2px'
                          }}></div>
                        </div>
                        <div style={{
                          fontSize: '0.6rem',
                          color: 'var(--text-secondary)',
                          marginTop: '0.25rem',
                          transform: 'rotate(-45deg)',
                          transformOrigin: 'center'
                        }}>
                          {new Date(item.timestamp).toLocaleTimeString().slice(0, 5)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      color: 'var(--text-secondary)'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></div>
                        <p>Waiting for data...</p>
                      </div>
                    </div>
                  )}
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
                  Live Reviews Feed
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
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></div>
                      <p>Waiting for live reviews...</p>
                      <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'rgba(59, 130, 246, 0.05)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(59, 130, 246, 0.1)'
                      }}>
                        <p style={{ fontSize: '0.875rem', margin: 0 }}>
                          Try submitting a review in the "AI Response" section to see real-time updates here!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Live Notifications */}
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Live Notifications
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
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></div>
                      <p>No notifications yet</p>
                      <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'rgba(59, 130, 246, 0.05)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(59, 130, 246, 0.1)'
                      }}>
                        <p style={{ fontSize: '0.875rem', margin: 0 }}>
                          Notifications will appear here when important events occur
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Testing Section */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div className="card-content">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Test Real-Time Features
              </h3>
              <div style={{
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.05)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                  How to test real-time updates:
                </h4>
                <ol style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                  <li>Navigate to the "AI Response" page</li>
                  <li>Submit a review with any rating</li>
                  <li>Return to this dashboard to see live updates</li>
                  <li>Try submitting negative reviews (rating 1-2) to trigger urgent notifications</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
