import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: '�‍🍳 Live Kitchen Insights',
      description: 'Monitor guest feedback in real-time as it comes in. Watch sentiment updates, notifications, and guest satisfaction metrics live.',
      icon: '�',
      link: '/real-time',
      color: 'var(--gradient-golden)',
      badge: 'LIVE'
    },
    {
      title: '💬 Guest Response Helper',
      description: 'Craft thoughtful, personalized responses to guest reviews that reflect your restaurant\'s warm hospitality and care.',
      icon: '🍜',
      link: '/respond-review',
      color: 'var(--gradient-warm)'
    },
    {
      title: '📈 Guest Sentiment Insights',
      description: 'Understand how your guests really feel about their dining experience through detailed sentiment analysis and trends.',
      icon: '❤️',
      link: '/sentiment-visualization',
      color: 'var(--gradient-fresh)'
    },
    {
      title: '⭐ Guest Reviews Collection',
      description: 'Browse through guest reviews and feedback to understand what makes your restaurant special to your customers.',
      icon: '🌟',
      link: '/sample-reviews',
      color: 'var(--gradient-spicy)'
    }
  ];

  const stats = [
    { label: 'Guest Reviews Analyzed', value: '19,898+', icon: '📝' },
    { label: 'Thoughtful Responses', value: '15,000+', icon: '�' },
    { label: 'Guest Satisfaction', value: '98%', icon: '😊' },
    { label: 'Response Time', value: '< 2s', icon: '⚡' }
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section" style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(220, 38, 38, 0.03) 50%, rgba(5, 150, 105, 0.05) 100%)',
        borderRadius: '24px',
        marginBottom: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '3rem',
          opacity: '0.1',
          animation: 'float 3s ease-in-out infinite'
        }}>🍜</div>
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          fontSize: '2rem',
          opacity: '0.1',
          animation: 'float 3s ease-in-out infinite 1s'
        }}>🥢</div>
        
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          background: 'var(--gradient-golden)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          SteamNoodles Guest Insights
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.7',
          fontWeight: '400'
        }}>
          Understanding your guests' dining experience through thoughtful feedback analysis. 
          Helping you respond with the warmth and care that makes every meal memorable.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/respond-review" className="btn btn-primary" style={{ 
            fontSize: '1.1rem', 
            padding: '1.25rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🍽️ Start Responding to Guests
          </Link>
          <Link to="/real-time" className="btn btn-secondary" style={{ 
            fontSize: '1.1rem', 
            padding: '1.25rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            �‍🍳 Live Kitchen Insights
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
          fontSize: '2.75rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '1rem',
          background: 'var(--gradient-golden)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em'
        }}>
          What Makes Us Special
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          Just like our carefully crafted dishes, every feature is designed with attention to detail and care for your restaurant's success.
        </p>
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
              {feature.badge && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  animation: 'pulse 2s infinite',
                  zIndex: 1
                }}>
                  {feature.badge}
                </div>
              )}
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
