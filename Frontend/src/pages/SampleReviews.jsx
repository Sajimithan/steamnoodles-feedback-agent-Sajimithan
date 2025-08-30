import React, { useState, useEffect } from 'react';

const SampleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, selectedSentiment, searchTerm]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/sample_reviews?count=10');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setReviews(data);
      } else if (data.reviews) {
        setReviews(data.reviews);
      } else {
        setError('No reviews found.');
      }
    } catch (err) {
      setError('Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    // Filter by sentiment
    if (selectedSentiment !== 'all') {
      filtered = filtered.filter(review => review.sentiment === selectedSentiment);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.review_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.restaurant_name && review.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredReviews(filtered);
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '';
      case 'negative': return '';
      case 'neutral': return '';
      default: return '';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      case 'neutral': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? '#fbbf24' : '#e5e7eb',
            fontSize: '1.25rem'
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const sentimentCounts = reviews.reduce((acc, review) => {
    acc[review.sentiment] = (acc[review.sentiment] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="page-container">
        <div className="card">
          <div className="card-content" style={{ textAlign: 'center', padding: '3rem' }}>
            <span className="loading-spinner" style={{ width: '3rem', height: '3rem' }}></span>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Loading sample reviews...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header Image Section */}
      <div style={{
        height: '150px',
        backgroundImage: 'url(/customer-reviews.jpg)',
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
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.6) 0%, rgba(217, 119, 6, 0.5) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '2rem'
        }}>
          <h1 style={{
            color: 'white',
            fontSize: '2.2rem',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span className="icon icon-star"></span>
            Guest Reviews Collection
          </h1>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <span className="icon icon-star"></span>
            Sample Reviews
          </h1>
          <p className="card-subtitle">
            Browse and explore sample customer reviews with sentiment analysis.
          </p>
        </div>

        <div className="card-content">
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Statistics Overview */}
          {reviews.length > 0 && (
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-value">{reviews.length}</div>
                <div className="stat-label">Total Reviews</div>
              </div>
              {Object.entries(sentimentCounts).map(([sentiment, count]) => (
                <div key={sentiment} className="stat-card">
                  <div className="stat-value" style={{ color: getSentimentColor(sentiment) }}>
                    {count}
                  </div>
                  <div className="stat-label">
                    {getSentimentIcon(sentiment)} {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {/* Search Input */}
            <div className="form-group">
              <label className="form-label">
                <span className="icon icon-search"></span>
                Search Reviews
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by review content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sentiment Filter */}
            <div className="form-group">
              <label className="form-label">
                <span className="icon icon-filter"></span>
                Filter by Sentiment
              </label>
              <select
                className="form-input"
                value={selectedSentiment}
                onChange={(e) => setSelectedSentiment(e.target.value)}
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div style={{
            padding: '1rem',
            background: 'rgba(37, 99, 235, 0.05)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(37, 99, 235, 0.1)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}></span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                Showing {filteredReviews.length} of {reviews.length} reviews
              </span>
            </div>
          </div>

          {/* Reviews Grid */}
          {filteredReviews.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredReviews.map((review, index) => (
                <div key={index} className="card hover-lift">
                  <div className="card-content">
                    {/* Review Header */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        {review.restaurant_name && (
                          <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            marginBottom: '0.25rem'
                          }}>
                            {review.restaurant_name}
                          </h3>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div>{getRatingStars(review.rating)}</div>
                          <span style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            fontWeight: '600'
                          }}>
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                      
                      <div style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: '2rem',
                        background: `${getSentimentColor(review.sentiment)}15`,
                        border: `1px solid ${getSentimentColor(review.sentiment)}30`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{ fontSize: '1rem' }}>
                          {getSentimentIcon(review.sentiment)}
                        </span>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: getSentimentColor(review.sentiment),
                          textTransform: 'capitalize'
                        }}>
                          {review.sentiment}
                        </span>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div style={{
                      padding: '1rem',
                      background: 'var(--background-secondary)',
                      borderRadius: '0.75rem',
                      border: '1px solid var(--border-color)',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        left: '1rem',
                        background: 'var(--background-primary)',
                        padding: '0 0.5rem',
                        fontSize: '1.5rem'
                      }}>
                        
                      </div>
                      <p style={{
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: 'var(--text-primary)',
                        margin: 0,
                        fontStyle: 'italic'
                      }}>
                        "{review.review_text}"
                      </p>
                    </div>

                    {/* Review Metadata */}
                    {review.date && (
                      <div style={{
                        marginTop: '1rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span></span>
                        <span>{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                No Reviews Found
              </h3>
              <p>
                {searchTerm || selectedSentiment !== 'all' 
                  ? 'Try adjusting your search filters to find more reviews.'
                  : 'No sample reviews are available at the moment.'
                }
              </p>
              {(searchTerm || selectedSentiment !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSentiment('all');
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: '1rem' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SampleReviews;
