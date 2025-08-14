import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import RespondReview from './pages/RespondReview';
import SentimentVisualization from './pages/SentimentVisualization';
import SampleReviews from './pages/SampleReviews';
import { useState } from 'react'
import bfLogo from '/bf-logo.svg';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <img src={bfLogo} className="logo" alt="Beyond Flavours logo" />
      </div>
      
      <nav style={{ padding: '1rem', background: '#f5f5f5', marginBottom: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/respond-review" style={{ marginRight: '1rem' }}>Respond to Review</Link>
        <Link to="/sentiment-visualization" style={{ marginRight: '1rem' }}>Sentiment Visualization</Link>
        <Link to="/sample-reviews">Sample Reviews</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/respond-review" element={<RespondReview />} />
        <Route path="/sentiment-visualization" element={<SentimentVisualization />} />
        <Route path="/sample-reviews" element={<SampleReviews />} />
      </Routes>
  {/* ...existing code... */}
    </Router>
  )
}

export default App
