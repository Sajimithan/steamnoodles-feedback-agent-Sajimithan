import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SentimentVisualization = () => {
  const [dateRange, setDateRange] = useState('');
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const predefinedRanges = [
    { label: 'Last 7 days', value: 'last 7 days' },
    { label: 'Last 30 days', value: 'last 30 days' },
    { label: 'Last 90 days', value: 'last 90 days' },
    { label: 'This year', value: 'last 365 days' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateRange.trim()) return;
    
    setLoading(true);
    setError('');
    setChartData(null);
    setSummary(null);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/visualize_sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date_range: dateRange })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success && data.chart_data) {
        setChartData(data.chart_data);
        setSummary(data.summary);
      } else {
        setError(data.detail || 'No data received for the specified date range.');
      }
    } catch (err) {
      setError('Error connecting to backend. Please ensure the server is running.');
    }
    
    setLoading(false);
  };

  const handlePredefinedRange = (range) => {
    setDateRange(range);
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">📊 Sentiment Analytics</h1>
          <p className="card-subtitle">
            Analyze sentiment trends and patterns in customer reviews over time.
          </p>
        </div>
        
        <div className="card-content">
          {/* Quick Range Buttons */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label">Quick Date Ranges</label>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '1rem'
            }}>
              {predefinedRanges.map((range) => (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => handlePredefinedRange(range.value)}
                  className={`btn ${dateRange === range.value ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Custom Date Range</label>
              <input
                type="text"
                className="form-input"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="Enter date range (e.g., 'last 7 days', 'Jan 1 2022 to Jan 31 2022')"
                required
              />
              <div style={{
                marginTop: '0.75rem',
                padding: '1rem',
                background: 'rgba(37, 99, 235, 0.05)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(37, 99, 235, 0.1)'
              }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--primary-color)' }}>Supported formats:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem' }}>
                    <li>"last X days" (e.g., "last 30 days")</li>
                    <li>"MMM DD YYYY to MMM DD YYYY" (e.g., "Jan 1 2022 to Dec 31 2022")</li>
                    <li>"YYYY-MM-DD to YYYY-MM-DD" (e.g., "2022-01-01 to 2022-12-31")</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !dateRange.trim()}
              className="btn btn-primary"
              style={{
                width: '100%',
                fontSize: '1.1rem',
                padding: '1rem'
              }}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Analyzing Sentiment Data...
                </>
              ) : (
                <>
                  📈 Generate Visualization
                </>
              )}
            </button>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="loading-spinner"></span>
                <span>Processing sentiment data and generating charts...</span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Chart and Summary Display */}
          {chartData && (
            <div className="slide-up" style={{ marginTop: '2rem' }}>
              {/* Summary Statistics */}
              {summary && (
                <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                  <div className="stat-card">
                    <div className="stat-value">{summary.total_reviews}</div>
                    <div className="stat-label">Total Reviews</div>
                  </div>
                  {Object.entries(summary.sentiment_counts).map(([sentiment, count]) => (
                    <div key={sentiment} className="stat-card">
                      <div className="stat-value" style={{
                        color: sentiment === 'positive' ? '#10b981' : 
                               sentiment === 'negative' ? '#ef4444' : 
                               '#3b82f6'
                      }}>
                        {count}
                      </div>
                      <div className="stat-label">
                        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Reviews
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Chart Container */}
              <div className="chart-container">
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          font: {
                            size: 14,
                            weight: '600'
                          },
                          padding: 20
                        }
                      },
                      title: {
                        display: true,
                        text: `Sentiment Analysis for ${summary?.date_range || dateRange}`,
                        font: {
                          size: 18,
                          weight: '700'
                        },
                        padding: 20
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                          size: 14,
                          weight: '600'
                        },
                        bodyFont: {
                          size: 13
                        },
                        cornerRadius: 8,
                        padding: 12
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                          font: {
                            size: 12
                          }
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.1)'
                        }
                      },
                      x: {
                        ticks: {
                          font: {
                            size: 12,
                            weight: '600'
                          }
                        },
                        grid: {
                          display: false
                        }
                      }
                    }
                  }}
                  height={400}
                />
              </div>

              {/* Insights Section */}
              {summary && (
                <div className="card" style={{ marginTop: '2rem' }}>
                  <div className="card-content">
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      color: 'var(--text-primary)'
                    }}>
                      📋 Key Insights
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem'
                    }}>
                      {Object.entries(summary.sentiment_counts).map(([sentiment, count]) => {
                        const percentage = ((count / summary.total_reviews) * 100).toFixed(1);
                        return (
                          <div key={sentiment} style={{
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            background: sentiment === 'positive' ? 'rgba(16, 185, 129, 0.1)' : 
                                       sentiment === 'negative' ? 'rgba(239, 68, 68, 0.1)' : 
                                       'rgba(59, 130, 246, 0.1)',
                            border: `1px solid ${sentiment === 'positive' ? '#10b981' : 
                                                  sentiment === 'negative' ? '#ef4444' : 
                                                  '#3b82f6'}30`
                          }}>
                            <div style={{
                              fontSize: '1.5rem',
                              fontWeight: '700',
                              color: sentiment === 'positive' ? '#10b981' : 
                                     sentiment === 'negative' ? '#ef4444' : 
                                     '#3b82f6'
                            }}>
                              {percentage}%
                            </div>
                            <div style={{
                              fontSize: '0.875rem',
                              color: 'var(--text-secondary)',
                              textTransform: 'capitalize'
                            }}>
                              {sentiment} Reviews
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentVisualization;
