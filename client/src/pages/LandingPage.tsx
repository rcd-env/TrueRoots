import { Link } from 'react-router-dom';
import {
  User,
  LogIn,
  Shield,
  MapPin,
  Users,
  FlaskConical
} from 'lucide-react';
// import WalletConnect from '../components/WalletConnect';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <style>
        {`
          @media (max-width: 1300px) {
            .usps-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (max-width: 768px) {
            .usps-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%),
          radial-gradient(circle at 20% 20%, rgba(5, 150, 105, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        backgroundSize: '60px 60px, 400px 400px, 300px 300px, 60px 60px',
        backgroundPosition: '0 0, 0% 0%, 100% 100%, 0 0',
        padding: '2rem 1rem',
        position: 'relative'
      }}>
        {/* Subtle overlay for better text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1
        }} />

        <div style={{
          textAlign: 'center',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Main Heading */}
          <h1 style={{
            fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '1rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}>
            TrueRoots
          </h1>

          {/* Tagline */}
          <p style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            color: '#059669',
            fontWeight: '600',
            marginBottom: '1.5rem',
            letterSpacing: '0.01em'
          }}>
            Blockchain-Powered Ayurvedic Herb Traceability
          </p>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
            color: '#6b7280',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            fontWeight: '400'
          }}>
            Track every herb from farm to pharmacy with complete transparency.
            Blockchain technology meets ancient Ayurvedic wisdom for trusted,
            verified herbal products.
          </p>

          {/* Primary CTAs */}
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem' 
          }}>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 4px 20px rgba(5, 150, 105, 0.3)',
                transition: 'all 0.2s ease',
                marginBottom: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(5, 150, 105, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(5, 150, 105, 0.3)';
              }}>
                <User size={20} />
                Sign Up
              </button>
            </Link>

            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: 'transparent',
                color: '#059669',
                border: '2px solid #059669',
                padding: '1rem 2.5rem',
                borderRadius: '12px',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
                marginBottom: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#059669';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <LogIn size={20} />
                Log In
              </button>
            </Link>
          </div>

          {/* Wallet Connect Section - Temporarily Disabled */}
          {/*
          <div style={{
            marginTop: '3rem',
            marginBottom: '3rem',
            padding: '2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '600px',
            margin: '3rem auto'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '1rem',
              textAlign: 'center',
              fontFamily: 'Playfair Display, serif'
            }}>
              🔗 Connect Your Algorand Wallet
            </h3>
            <p style={{
              color: '#6b7280',
              fontSize: '1rem',
              marginBottom: '2rem',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '0 auto 2rem auto'
            }}>
              Connect your Algorand wallet to access blockchain-verified herb tracking and secure transactions
            </p>
            <WalletConnect
              onConnect={(address) => {
                console.log('Wallet connected:', address);
                // You can add additional logic here when wallet connects
              }}
              onDisconnect={() => {
                console.log('Wallet disconnected');
                // You can add additional logic here when wallet disconnects
              }}
              className="max-w-md mx-auto"
            />
          </div>
          */}

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(2rem, 6vw, 4rem)',
            marginBottom: '3rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: '700',
                color: '#059669',
                marginBottom: '0.5rem'
              }}>
                10K+
              </div>
              <div style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Verified Herbs
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: '700',
                color: '#059669',
                marginBottom: '0.5rem'
              }}>
                500+
              </div>
              <div style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Active Collectors
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: '700',
                color: '#059669',
                marginBottom: '0.5rem'
              }}>
              100%
              </div>
              <div style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Blockchain Verified
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Join the TrueRoots ecosystem and start your journey in transparent herb traceability
          </p>
        </div>
      </section>

      {/* USPs Section */}
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          {/* Section Header */}
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontFamily: 'Playfair Display, serif',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '1rem'
            }}>
              Why TrueRoots?
            </h2>
            <p style={{
              fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Revolutionizing Ayurvedic herb traceability with cutting-edge technology
            </p>
          </div>

          {/* USPs Grid */}
          <div
            className="usps-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              maxWidth: '1300px',
              margin: '0 auto'
            }}>
            {[
              {
                icon: Shield,
                title: 'Blockchain Verified',
                description: 'Every herb batch is recorded on blockchain for immutable traceability'
              },
              {
                icon: MapPin,
                title: 'GPS Tracking',
                description: 'Real-time location tracking from collection to consumer'
              },
              {
                icon: Users,
                title: 'Community Driven',
                description: 'Supporting local collectors and traditional knowledge'
              },
              {
                icon: FlaskConical,
                title: 'AI-Powered Verification',
                description: 'Advanced AI analyzes herb photos and stores verification data on IPFS for authenticity'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '2rem 1.5rem',
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    height: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '20px',
                    marginBottom: '1.5rem'
                  }}>
                    <Icon size={40} color="#059669" />
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    marginBottom: '1rem',
                    lineHeight: '1.3'
                  }}>
                    {feature.title}
                  </h3>

                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
