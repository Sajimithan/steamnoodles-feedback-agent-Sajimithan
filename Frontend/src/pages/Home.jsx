import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'Live Kitchen Insights',
      description: 'Monitor guest feedback in real-time as it comes in. Watch sentiment updates, notifications, and guest satisfaction metrics live.',
      icon: '',
      link: '/real-time',
      color: 'var(--gradient-golden)',
      badge: 'LIVE'
    },
    {
      title: 'Guest Response Helper',
      description: 'Craft thoughtful, personalized responses to guest reviews that reflect your restaurant\'s warm hospitality and care.',
      icon: '',
      link: '/respond-review',
      color: 'var(--gradient-warm)'
    },
    {
      title: 'Guest Sentiment Insights',
      description: 'Understand how your guests really feel about their dining experience through detailed sentiment analysis and trends.',
      icon: '',
      link: '/sentiment-visualization',
      color: 'var(--gradient-fresh)'
    },
    {
      title: 'Guest Reviews Collection',
      description: 'Browse through guest reviews and feedback to understand what makes your restaurant special to your customers.',
      icon: '',
      link: '/sample-reviews',
      color: 'var(--gradient-spicy)'
    }
  ];

  const stats = [
    { label: 'Guest Reviews Analyzed', value: '19,898+', icon: '' },
    { label: 'Thoughtful Responses', value: '15,000+', icon: '' },
    { label: 'Guest Satisfaction', value: '98%', icon: '' },
    { label: 'Response Time', value: '< 2s', icon: '' }
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section" style={{
        textAlign: 'center',
        padding: '4rem 0',
        background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(220, 38, 38, 0.03) 100%)',
        borderRadius: '2rem',
        marginBottom: '4rem'
      }}>
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
          fontSize: '1.25rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.7'
        }}>
          Transform your restaurant's guest feedback management with thoughtful response generation 
          and detailed sentiment insights that help you serve better.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/respond-review" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Get Started
          </Link>
          <Link to="/sentiment-visualization" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            View Insights
          </Link>
          <Link to="/real-time" className="btn btn-success" style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Live Kitchen
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
                  background: 'var(--accent-color)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  animation: 'pulse 2s infinite',
                  zIndex: 10
                }}>
                  {feature.badge}
                </div>
              )}
              <div className="card-content">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: feature.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-warm)'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    {feature.title}
                  </h3>
                </div>
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="card" style={{
        background: 'var(--gradient-warm)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="card-content">
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'white'
          }}>
            Ready to Transform Your Guest Experience?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '2rem',
            opacity: 0.9,
            maxWidth: '500px',
            margin: '0 auto 2rem'
          }}>
            Join thousands of restaurants already using SteamNoodles to create meaningful connections with their guests.
          </p>
          <Link to="/respond-review" className="btn btn-secondary" style={{
            background: 'white',
            color: 'var(--primary-color)',
            fontWeight: '700',
            fontSize: '1.1rem',
            padding: '1rem 2rem'
          }}>
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
