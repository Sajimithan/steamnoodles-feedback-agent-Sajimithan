import React, { useEffect, useState } from 'react';


const SampleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://127.0.0.1:8000/sample_reviews?count=3');
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        } else if (data.reviews) {
          setReviews(data.reviews);
        } else {
          setError('No reviews found.');
        }
      } catch (err) {
        setError('Error connecting to backend.');
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Sample Reviews</h2>
      {loading && <p>Loading reviews...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <div>
          <p style={{ marginBottom: '1rem', fontStyle: 'italic' }}>
            Showing {reviews.length} sample reviews
          </p>
          <div>
            {reviews.map((review, idx) => (
              <div key={idx} style={{ 
                marginBottom: '1rem', 
                padding: '1rem', 
                border: '1px solid #eee', 
                borderRadius: '8px',
                borderLeft: `4px solid ${
                  review.sentiment === 'positive' ? '#4CAF50' : 
                  review.sentiment === 'negative' ? '#F44336' : 
                  '#2196F3'
                }`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong>Rating: {review.rating}/5</strong>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem',
                    backgroundColor: review.sentiment === 'positive' ? '#E8F5E8' : 
                                   review.sentiment === 'negative' ? '#FFE8E8' : 
                                   '#E8F0FF',
                    color: review.sentiment === 'positive' ? '#2E7D32' : 
                           review.sentiment === 'negative' ? '#C62828' : 
                           '#1565C0'
                  }}>
                    {review.sentiment.toUpperCase()}
                  </span>
                </div>
                <p style={{ margin: 0 }}>{review.review_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleReviews;
