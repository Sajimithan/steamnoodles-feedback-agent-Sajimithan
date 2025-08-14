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
        <ul>
          {reviews.map((review, idx) => (
            <li key={idx} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
              <strong>Rating:</strong> {review.rating}<br />
              <strong>Review:</strong> {review.review_text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SampleReviews;
