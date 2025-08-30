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
    { path: '/', label: 'Home', icon: 'icon-home' },
    { path: '/real-time', label: 'Live Kitchen', icon: 'icon-live', badge: 'LIVE' },
    { path: '/respond-review', label: 'Guest Response', icon: 'icon-chat' },
    { path: '/sentiment-visualization', label: 'Guest Insights', icon: 'icon-chart' },
    { path: '/sample-reviews', label: 'Reviews', icon: 'icon-star' }
  ];

  return (
    <nav className="nav-menu">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className={`icon ${item.icon}`}></span>
          {item.label}
          {item.badge && (
            <span style={{
              background: 'var(--accent-color)',
              color: 'white',
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '8px',
              fontWeight: '700',
              marginLeft: '0.5rem',
              animation: 'pulse 2s infinite'
            }}>
              {item.badge}
            </span>
          )}
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
              <img src="/steamnoodles-logo.png" className="logo" alt="SteamNoodles logo" />
              <div className="brand-text">SteamNoodles Insights</div>
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
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-accent)',
          padding: '2.5rem 0',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <div className="container">
            <p style={{
              background: 'var(--gradient-golden)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '600',
              margin: 0
            }}>
              &copy; 2025 SteamNoodles Guest Insights • Crafted for Beyond Flavours
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
