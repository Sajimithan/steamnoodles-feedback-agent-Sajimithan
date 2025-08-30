import React, { useState } from 'react';

const RespondReview = () => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const res = await fetch('http://127.0.0.1:8000/respond_review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review_text: reviewText, rating: Number(rating) })
      });
      
      const data = await res.json();
      
      if (res.ok && data.response) {
        setResponse(data.response);
      } else {
        setError(data.detail || 'Failed to generate response.');
      }
    } catch (err) {
      setError('Error connecting to backend. Please ensure the server is running.');
    }
    
    setLoading(false);
  };

  const getRatingColor = (ratingValue) => {
    if (ratingValue >= 4) return '#10b981'; // green
    if (ratingValue >= 3) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getSentimentText = (ratingValue) => {
    if (ratingValue >= 4) return 'Positive';
    if (ratingValue >= 3) return 'Neutral';
    return 'Negative';
  };

  return (
    <div className="page-container">
      {/* Header Image Section */}
      <div style={{
        height: '150px',
        backgroundImage: 'url(/ai-response.jpg)',
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
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.7) 100%)',
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
            <span className="icon icon-chat"></span>
            AI Response Generator
          </h1>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <span className="icon icon-chat"></span>
            AI Response Generator
          </h1>
          <p className="card-subtitle">
            Generate professional, context-aware responses to customer reviews using advanced AI technology.
          </p>
        </div>
        
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            {/* Review Text Input */}
            <div className="form-group">
              <label className="form-label">Customer Review</label>
              <textarea
                className="form-textarea"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Enter the customer's review here... (e.g., 'The food was amazing but the service was a bit slow.')"
                required
                style={{
                  minHeight: '120px',
                  resize: 'vertical'
                }}
              />
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginTop: '0.5rem'
              }}>
                {reviewText.length}/500 characters
              </div>
            </div>

            {/* Rating Selection */}
            <div className="form-group">
              <label className="form-label">Customer Rating</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <select
                  className="form-select"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ maxWidth: '120px' }}
                >
                  {[1, 2, 3, 4, 5].map(r => (
                    <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                  ))}
                </select>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`star ${star <= rating ? '' : 'empty'}`}
                        style={{
                          color: star <= rating ? '#fbbf24' : 'var(--border-color)',
                          fontSize: '1.5rem'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  
                  <div className="sentiment-tag" style={{
                    backgroundColor: `${getRatingColor(rating)}15`,
                    color: getRatingColor(rating),
                    border: `1px solid ${getRatingColor(rating)}30`
                  }}>
                    {getSentimentText(rating)}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !reviewText.trim()}
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
                  Generating AI Response...
                </>
              ) : (
                <>
                  Generate Professional Response
                </>
              )}
            </button>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="loading-spinner"></span>
                <span>Our AI is crafting a professional response...</span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="alert alert-error" style={{ marginTop: '1.5rem' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="slide-up" style={{ marginTop: '2rem' }}>
              <div className="card" style={{
                background: 'linear-gradient(135deg, #e6ffe6 0%, #f0fff4 100%)',
                border: '2px solid var(--success-color)',
                borderRadius: '1rem'
              }}>
                <div className="card-content">
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>✨</span>
                    <strong style={{ color: 'var(--success-color)', fontSize: '1.1rem' }}>
                      AI-Generated Response
                    </strong>
                  </div>
                  <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #d1fae5',
                    fontSize: '1.1rem',
                    lineHeight: '1.7',
                    color: 'var(--text-primary)'
                  }}>
                    "{response}"
                  </div>
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic'
                  }}>
                    This response is professionally crafted to be polite, context-aware, and under 100 words.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Tips for Best Results</h2>
        </div>
        <div className="card-content">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Be Specific</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Include specific details from the review for more contextual responses.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Accurate Rating</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Select the correct star rating to ensure appropriate response tone.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Professional Tone</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Our AI automatically maintains a professional and empathetic tone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RespondReview;
