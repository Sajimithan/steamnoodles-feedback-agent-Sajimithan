import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RespondReview from './pages/RespondReview';
import SentimentVisualization from './pages/SentimentVisualization';
import SampleReviews from './pages/SampleReviews';
import RealTimeDashboard from './pages/RealTimeDashboard';
import bfLogo from '/bf-logo.svg';
import './App.css';

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/real-time', label: 'Live Dashboard', icon: '📡' },
    { path: '/respond-review', label: 'AI Response', icon: '🤖' },
    { path: '/sentiment-visualization', label: 'Analytics', icon: '📊' },
    { path: '/sample-reviews', label: 'Reviews', icon: '⭐' }
  ];

  return (
    <nav className="nav-menu">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <img src={bfLogo} className="logo" alt="Beyond Flavours logo" />
              <div className="brand-text">SteamNoodles AI</div>
            </div>
            <Navigation />
          </div>
        </header>
        
        <main className="main-content">
          <div className="fade-in">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/real-time" element={<RealTimeDashboard />} />
              <Route path="/respond-review" element={<RespondReview />} />
              <Route path="/sentiment-visualization" element={<SentimentVisualization />} />
              <Route path="/sample-reviews" element={<SampleReviews />} />
            </Routes>
          </div>
        </main>
        
        <footer className="app-footer" style={{
          background: 'var(--surface-color)',
          borderTop: '1px solid var(--border-color)',
          padding: '2rem 0',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <div className="container">
            <p>&copy; 2025 SteamNoodles Feedback Agent. Built with ❤️ for Beyond Flavours.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
