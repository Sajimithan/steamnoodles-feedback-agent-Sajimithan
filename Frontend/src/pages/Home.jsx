import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'Live Kitchen Insights',
      description: 'Monitor guest feedback in real-time as it comes in. Watch sentiment updates, notifications, and guest satisfaction metrics live.',
      icon: 'icon-live',
      link: '/real-time',
      color: 'var(--gradient-golden)',
      badge: 'LIVE'
    },
    {
      title: 'Guest Response Helper',
      description: 'Craft thoughtful, personalized responses to guest reviews that reflect your restaurant\'s warm hospitality and care.',
      icon: 'icon-chat',
      link: '/respond-review',
      color: 'var(--gradient-warm)'
    },
    {
      title: 'Guest Sentiment Insights',
      description: 'Understand how your guests really feel about their dining experience through detailed sentiment analysis and trends.',
      icon: 'icon-chart',
      link: '/sentiment-visualization',
      color: 'var(--gradient-fresh)'
    },
    {
      title: 'Guest Reviews Collection',
      description: 'Browse through guest reviews and feedback to understand what makes your restaurant special to your customers.',
      icon: 'icon-star',
      link: '/sample-reviews',
      color: 'var(--gradient-spicy)'
    }
  ];

  const stats = [
    { label: 'Guest Reviews Analyzed', value: '19,898+', icon: 'icon-star' },
    { label: 'Thoughtful Responses', value: '15,000+', icon: 'icon-chat' },
    { label: 'Guest Satisfaction', value: '98%', icon: 'icon-positive' },
    { label: 'Response Time', value: '< 2s', icon: 'icon-live' }
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section hero-background noodle-pattern" style={{
        textAlign: 'center',
        padding: '4rem 0',
        borderRadius: '2rem',
        marginBottom: '4rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '2rem',
          padding: '3rem',
          margin: '0 2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          background: 'var(--gradient-golden)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <span className="icon icon-steam" style={{ fontSize: '3rem', color: '#d97706' }}></span>
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
          <Link to="/respond-review" className="btn btn-primary" style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span className="icon icon-chat"></span>
            Get Started
          </Link>
          <Link to="/sentiment-visualization" className="btn btn-secondary" style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span className="icon icon-chart"></span>
            View Insights
          </Link>
          <Link to="/real-time" className="btn btn-success" style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span className="icon icon-live"></span>
            Live Kitchen
          </Link>
        </div>
        </div>
        
        {/* Decorative elements */}
        <div className="decorative-chopsticks">
          <span className="icon icon-chopsticks" style={{ fontSize: '3rem', color: 'rgba(217, 119, 6, 0.1)' }}></span>
        </div>
        <div className="decorative-steam">
          <span className="icon icon-steam" style={{ fontSize: '2rem', color: 'rgba(217, 119, 6, 0.1)' }}></span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              <span className={`icon ${stat.icon}`} style={{ fontSize: '2rem' }}></span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div style={{ marginBottom: '4rem', position: 'relative' }}>
        <div className="bowl-illustration" style={{
          position: 'absolute',
          top: '-50px',
          right: '50px',
          width: '100px',
          height: '100px',
          opacity: 0.1,
          zIndex: 0
        }}></div>
        <h2 style={{
          fontSize: '2.75rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '1rem',
          background: 'var(--gradient-golden)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
          position: 'relative',
          zIndex: 1
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
          {features.map((feature, index) => {
            const getBackgroundClass = (title) => {
              if (title.includes('Live Kitchen')) return 'feature-card-live';
              if (title.includes('Response')) return 'feature-card-response';
              if (title.includes('Sentiment')) return 'feature-card-insights';
              if (title.includes('Reviews')) return 'feature-card-reviews';
              return '';
            };
            
            return (
            <Link
              key={index}
              to={feature.link}
              className={`card ${getBackgroundClass(feature.title)}`}
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
                    <span className={`icon ${feature.icon}`} style={{ 
                      fontSize: '1.8rem', 
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }}></span>
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
            );
          })}
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
