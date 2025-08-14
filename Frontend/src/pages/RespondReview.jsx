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
      if (data.response) {
        setResponse(data.response);
      } else {
        setError(data.error || 'No response received.');
      }
    } catch (err) {
      setError('Error connecting to backend.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Respond to Customer Review</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          placeholder="Enter customer review..."
          rows={4}
          required
        />
        <label>
          Rating:
          <select value={rating} onChange={e => setRating(e.target.value)}>
            {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <button type="submit" disabled={loading}>Generate Response</button>
      </form>
      {loading && <p>Generating response...</p>}
      {response && (
        <div style={{ marginTop: '2rem', background: '#e6ffe6', padding: '1rem', borderRadius: 8 }}>
          <strong>Generated Response:</strong>
          <p>{response}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RespondReview;
