import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'AI-Powered Responses',
      description: 'Generate professional, context-aware responses to customer reviews using advanced AI technology.',
      icon: '🤖',
      link: '/respond-review',
      color: 'var(--gradient-primary)'
    },
    {
      title: 'Sentiment Analytics',
      description: 'Visualize sentiment trends over time with interactive charts and comprehensive analytics.',
      icon: '📊',
      link: '/sentiment-visualization',
      color: 'var(--gradient-success)'
    },
    {
      title: 'Review Samples',
      description: 'Browse through sample reviews with sentiment analysis and rating insights.',
      icon: '⭐',
      link: '/sample-reviews',
      color: 'var(--gradient-secondary)'
    }
  ];

  const stats = [
    { label: 'Reviews Processed', value: '19,898+', icon: '📝' },
    { label: 'AI Responses Generated', value: '15,000+', icon: '💬' },
    { label: 'Customer Satisfaction', value: '98%', icon: '😊' },
    { label: 'Average Response Time', value: '< 2s', icon: '⚡' }
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section" style={{
        textAlign: 'center',
        padding: '4rem 0',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderRadius: '2rem',
        marginBottom: '4rem'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1.5rem'
        }}>
          SteamNoodles AI Agent
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.7'
        }}>
          Transform your restaurant's customer feedback management with AI-powered response generation 
          and advanced sentiment analysis.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/respond-review" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            🚀 Get Started
          </Link>
          <Link to="/sentiment-visualization" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            📊 View Analytics
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem',
          color: 'var(--text-primary)'
        }}>
          Powerful Features
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="card"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                position: 'relative',
                overflow: 'hidden',
                animationDelay: `${index * 0.2}s`
              }}
            >
              <div className="card-content">
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  color: 'var(--text-primary)'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: feature.color
                }}></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="card" style={{ marginBottom: '4rem' }}>
        <div className="card-header">
          <h2 className="card-title">🔧 Built with Modern Technology</h2>
          <p className="card-subtitle">Powered by cutting-edge AI and web technologies</p>
        </div>
        <div className="card-content">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: '600' }}>Frontend</h4>
              <p style={{ color: 'var(--text-secondary)' }}>React, Vite, Chart.js</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: '600' }}>Backend</h4>
              <p style={{ color: 'var(--text-secondary)' }}>FastAPI, Python, SQLite</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', fontWeight: '600' }}>AI Engine</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Groq, Llama3-8B, NLP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        background: 'var(--gradient-primary)',
        borderRadius: '2rem',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '700' }}>
          Ready to Transform Your Customer Feedback?
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
          Start generating professional responses and analyzing sentiment trends today.
        </p>
        <Link to="/respond-review" className="btn" style={{
          background: 'white',
          color: 'var(--primary-color)',
          fontSize: '1.1rem',
          padding: '1rem 2rem',
          fontWeight: '600'
        }}>
          Try It Now →
        </Link>
      </div>
    </div>
  );
};

export default Home;
