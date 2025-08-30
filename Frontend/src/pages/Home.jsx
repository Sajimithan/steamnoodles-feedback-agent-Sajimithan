import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: 'Kitchen Pulse Monitor',
      description: 'Keep your finger on the pulse of guest satisfaction as it happens. See what people are saying about your dishes in real-time, just like having ears in every dining room.',
      icon: 'icon-live',
      image: '/live-monitoring.jpg',
      link: '/real-time',
      color: 'var(--gradient-golden)',
      badge: 'LIVE'
    },
    {
      title: 'Thoughtful Response Craft',
      description: 'Because every guest deserves a personal touch. Help craft responses that sound like they come from your heart, not a template - the way great hospitality should be.',
      icon: 'icon-chat',
      image: '/ai-response.jpg',
      link: '/respond-review',
      color: 'var(--gradient-warm)'
    },
    {
      title: 'Guest Story Analytics',
      description: 'Every review tells a story about your restaurant. Understand the emotions behind the words and discover what truly makes your guests smile (or frown).',
      icon: 'icon-chart',
      image: '/sentiment-analysis.jpg',
      link: '/sentiment-visualization',
      color: 'var(--gradient-fresh)'
    },
    {
      title: 'Memory Lane Reviews',
      description: 'Take a stroll through what guests have shared about their experiences. Sometimes the best insights come from simply listening to their stories.',
      icon: 'icon-star',
      image: '/customer-reviews.jpg',
      link: '/sample-reviews',
      color: 'var(--gradient-spicy)'
    }
  ];

  const stats = [
    { label: 'Stories Shared', value: '19,898+', icon: 'icon-star' },
    { label: 'Hearts Touched', value: '15,000+', icon: 'icon-chat' },
    { label: 'Smiles Created', value: '98%', icon: 'icon-positive' },
    { label: 'Response Time', value: '< 2s', icon: 'icon-live' }
  ];

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section hero-pattern" style={{
        textAlign: 'center',
        padding: '4rem 0',
        background: `
          linear-gradient(135deg, rgba(217, 119, 6, 0.65) 0%, rgba(220, 38, 38, 0.55) 100%),
          url('/noodle-texture.jpg'),
          url('/restaurant-hero.jpg')
        `,
        backgroundSize: 'cover, 200px 200px, cover',
        backgroundPosition: 'center, center, center',
        backgroundBlendMode: 'normal, soft-light, normal',
        backgroundAttachment: 'fixed, scroll, fixed',
        borderRadius: '2rem',
        marginBottom: '4rem',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.2)'
      }}>
        
        {/* Additional overlay for text readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.15) 80%)',
          zIndex: 1
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2 }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          color: 'white',
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic'
        }}>
          <span className="icon icon-steam" style={{ fontSize: '3rem', color: 'white' }}></span>
          SteamNoodles
          <span className="handwritten-accent" style={{ 
            color: '#fef3c7', 
            fontSize: '2rem',
            fontFamily: 'Brush Script MT, cursive',
            transform: 'rotate(-3deg)',
            marginLeft: '10px'
          }}>
            Guest Insights
          </span>
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'rgba(255, 255, 255, 0.95)',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: '1.7',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          fontFamily: 'Georgia, serif'
        }}>
          "Where every review tells a story, and every story makes us better."
          <br />
          <span style={{ fontSize: '1rem', fontStyle: 'italic', opacity: 0.9 }}>
            - Transform guest feedback into culinary excellence with heartfelt insights
          </span>
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/respond-review" className="btn btn-primary" style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'Georgia, serif'
          }}>
            <span className="icon icon-chat"></span>
            Let's Start Cooking
          </Link>
          <Link to="/sentiment-visualization" className="btn btn-secondary" style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'Georgia, serif'
          }}>
            <span className="icon icon-chart"></span>
            Story Insights
          </Link>
          <Link to="/real-time" className="btn btn-success" style={{ 
            fontSize: '1.1rem', 
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'Georgia, serif'
          }}>
            <span className="icon icon-live"></span>
            Kitchen Live
          </Link>
        </div>
        
        {/* Decorative elements */}
        <div className="decorative-chopsticks">
          <img src="/chopsticks-icon.svg" alt="" style={{ 
            width: '60px', 
            height: '60px', 
            opacity: 0.15,
            filter: 'brightness(0) invert(1)'
          }} />
        </div>
        <div className="decorative-steam">
          <img src="/steam-icon.svg" alt="" style={{ 
            width: '40px', 
            height: '40px', 
            opacity: 0.15,
            filter: 'brightness(0) invert(1)'
          }} />
        </div>
        </div> {/* Close the z-index: 2 div */}
      </div>

      {/* Stats Section */}
      <div className="stats-grid noodle-pattern" style={{
        padding: '2rem',
        borderRadius: '2rem',
        background: 'rgba(255, 255, 255, 0.2)',
        marginBottom: '3rem'
      }}>
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
      <div className="noodle-pattern" style={{ 
        marginBottom: '4rem',
        padding: '2rem',
        borderRadius: '2rem',
        background: 'rgba(255, 255, 255, 0.3)'
      }}>
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          fontFamily: 'Georgia, serif',
          position: 'relative'
        }}>
          <img src="/noodle-bowl.jpg" alt="" style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            objectFit: 'cover',
            transform: 'rotate(-5deg)',
            border: '3px solid #d97706'
          }} />
          <span>What Makes Our Kitchen</span>
          <span className="handwritten-accent" style={{
            color: '#d97706',
            fontSize: '2.2rem',
            fontFamily: 'Brush Script MT, cursive',
            transform: 'rotate(-2deg)',
            margin: '0 5px'
          }}>
            Special
          </span>
          <img src="/noodle-bowl.jpg" alt="" style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            objectFit: 'cover',
            transform: 'rotate(7deg)',
            border: '3px solid #d97706'
          }} />
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          lineHeight: '1.6'
        }}>
          "Just like our carefully crafted dishes, every feature is made with love and attention to help your restaurant family grow."
          <br />
          <span style={{ 
            fontSize: '0.9rem', 
            opacity: 0.8,
            fontStyle: 'normal'
          }}>
            - From our kitchen to yours ❤️
          </span>
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
              
              {/* Feature Image */}
              <div style={{
                height: '200px',
                backgroundImage: `url('${feature.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '1rem 1rem 0 0',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.3))'
                }}></div>
              </div>
              
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
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="card" style={{
        background: 'var(--gradient-warm)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="card-content">
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            marginBottom: '1rem',
            fontFamily: 'Georgia, serif'
          }}>
            Ready to Transform Your Restaurant's Story?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '2rem',
            opacity: 0.95,
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic'
          }}>
            "Every great restaurant has great stories. Let's make sure yours are heard."
          </p>
          
          {/* Handwritten-style note */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#d97706',
            padding: '10px 15px',
            borderRadius: '8px',
            transform: 'rotate(3deg)',
            fontSize: '0.9rem',
            fontFamily: 'Brush Script MT, cursive',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            Made with ❤️<br />in our kitchen
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/respond-review" className="btn" style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid white',
              color: 'white',
              fontSize: '1.1rem',
              padding: '1rem 2rem',
              fontFamily: 'Georgia, serif'
            }}>
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
