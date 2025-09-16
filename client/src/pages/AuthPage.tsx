import React, { useState } from 'react';
import {
  Building2,
  FlaskConical,
  Smartphone,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle
} from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'role-selection' | 'login-role-selection';
type UserRole = 'firm' | 'lab' | 'collector';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole | '';
  // Firm specific
  companyName: string;
  companySize: string;
  industry: string;
  // Lab specific
  labName: string;
  accreditation: string;
  specialization: string;
  // Collector specific
  location: string;
  experience: string;
  preferredHerbs: string;
}

const AuthPage = () => {
  // Determine initial mode based on current path
  const getInitialMode = (): AuthMode => {
    const path = window.location.pathname;
    if (path === '/login') return 'login-role-selection';
    if (path === '/signup') return 'role-selection';
    return 'role-selection'; // default for /auth
  };

  const [authMode, setAuthMode] = useState<AuthMode>(getInitialMode());
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: '',
    companyName: '',
    companySize: '',
    industry: '',
    labName: '',
    accreditation: '',
    specialization: '',
    location: '',
    experience: '',
    preferredHerbs: ''
  });

  const roleOptions = [
    {
      id: 'firm' as UserRole,
      title: 'Enterprise/Firm',
      description: 'Register your company to manage supply chain and track herb batches',
      icon: Building2,
      color: '#d97706',
      features: ['Supply Chain Management', 'Batch Tracking', 'Quality Compliance', 'Supplier Network']
    },
    {
      id: 'lab' as UserRole,
      title: 'Laboratory',
      description: 'Join as a testing laboratory to provide quality verification services',
      icon: FlaskConical,
      color: '#7c3aed',
      features: ['Test Result Upload', 'Quality Certification', 'Compliance Reports', 'Lab Analytics']
    },
    {
      id: 'collector' as UserRole,
      title: 'Herb Collector',
      description: 'Start collecting herbs and earn instant payments through blockchain',
      icon: Smartphone,
      color: '#059669',
      features: ['Photo Upload', 'GPS Verification', 'Instant Payments', 'Quality Rewards']
    }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    setAuthMode('signup');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process - in real app, this would come from backend
    setTimeout(() => {
      setIsLoading(false);

      // For demo purposes, determine role based on email domain or ask user
      // In real app, this would come from the authentication response
      let userRole = 'collector'; // default

      if (formData.email.includes('enterprise') || formData.email.includes('firm')) {
        userRole = 'firm';
      } else if (formData.email.includes('lab')) {
        userRole = 'lab';
      }

      alert('🎉 Welcome back to TrueRoots!\n\nLogin successful. Redirecting to your dashboard...');

      setTimeout(() => {
        switch (userRole) {
          case 'firm':
            window.location.href = '/enterprise';
            break;
          case 'lab':
            window.location.href = '/lab';
            break;
          case 'collector':
          default:
            window.location.href = '/collector';
            break;
        }
      }, 1000);
    }, 1000);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    // Get role-specific information for success message
    const roleInfo = roleOptions.find(r => r.id === selectedRole);
    const roleName = roleInfo?.title || 'User';

    // Simulate account creation process
    setTimeout(() => {
      setIsLoading(false);
      alert(`🎉 Welcome to TrueRoots, ${formData.firstName}!\n\nYour ${roleName} account has been created successfully.\n\nRedirecting to your dashboard...`);

      setTimeout(() => {
        switch (selectedRole) {
          case 'firm':
            window.location.href = '/enterprise';
            break;
          case 'lab':
            window.location.href = '/lab';
            break;
          case 'collector':
            window.location.href = '/collector';
            break;
          default:
            window.location.href = '/home';
        }
      }, 1500);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .auth-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }
          
          .role-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .role-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          
          .input-group {
            position: relative;
            margin-bottom: 1rem;
          }
          
          .input-field {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.875rem;
            transition: all 0.2s ease;
          }
          
          .input-field:focus {
            outline: none;
            border-color: #059669;
            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
          }
          
          .password-toggle {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #6b7280;
          }
        `}
      </style>

      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f3f4f6',
        padding: '1rem 2rem',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontFamily: 'Playfair Display, serif',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0
          }}>
            TrueRoots
          </h1>
        </div>
      </header>

      <div className="auth-container" style={{ paddingTop: '4rem' }}>
        {authMode === 'login' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem',
            border: '1px solid #f3f4f6',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '1.875rem',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                Welcome Back
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Sign in to your TrueRoots account
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280'
                  }} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: isLoading ? '#9ca3af' : '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.875rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('role-selection')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
        )}

        {authMode === 'role-selection' && (
          <div style={{
            width: '100%',
            maxWidth: '1200px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '1rem'
              }}>
                Choose Your Role
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '1.125rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Select how you want to join the TrueRoots ecosystem
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {roleOptions.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.id}
                    className="role-card"
                    onClick={() => handleRoleSelection(role.id)}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '2rem',
                      border: '1px solid #f3f4f6',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '80px',
                      height: '80px',
                      backgroundColor: role.color + '15',
                      borderRadius: '20px',
                      marginBottom: '1.5rem'
                    }}>
                      <Icon size={40} color={role.color} />
                    </div>

                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '1rem'
                    }}>
                      {role.title}
                    </h3>

                    <p style={{
                      color: '#6b7280',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem'
                    }}>
                      {role.description}
                    </p>

                    <div style={{
                      display: 'grid',
                      gap: '0.5rem',
                      marginBottom: '1.5rem'
                    }}>
                      {role.features.map((feature, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          color: '#374151'
                        }}>
                          <CheckCircle size={16} color={role.color} />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <button style={{
                      width: '100%',
                      backgroundColor: role.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.875rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Sign Up as {role.title}
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#059669',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        )}

        {authMode === 'signup' && selectedRole && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2.5rem',
            border: '1px solid #f3f4f6',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            width: '100%',
            maxWidth: '600px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                backgroundColor: roleOptions.find(r => r.id === selectedRole)?.color + '15',
                borderRadius: '16px',
                marginBottom: '1rem'
              }}>
                {React.createElement(roleOptions.find(r => r.id === selectedRole)?.icon || Building2, {
                  size: 30,
                  color: roleOptions.find(r => r.id === selectedRole)?.color
                })}
              </div>
              <h2 style={{
                fontSize: '1.875rem',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                Sign Up as {roleOptions.find(r => r.id === selectedRole)?.title}
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Create your account to get started
              </p>
            </div>

            <form onSubmit={handleSignup}>
              {/* Common Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280'
                  }} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280'
                  }} />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-group">
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280'
                    }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="input-group">
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280'
                    }} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role-specific Fields */}
              {selectedRole === 'firm' && (
                <>
                  <div style={{
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '1.5rem',
                    marginTop: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Building2 size={18} color="#d97706" />
                      Company Information
                    </h4>
                  </div>

                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="input-group">
                      <select
                        value={formData.companySize}
                        onChange={(e) => handleInputChange('companySize', e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">Company Size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">Industry</option>
                        <option value="pharmaceuticals">Pharmaceuticals</option>
                        <option value="nutraceuticals">Nutraceuticals</option>
                        <option value="cosmetics">Cosmetics</option>
                        <option value="food-beverage">Food & Beverage</option>
                        <option value="research">Research</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {selectedRole === 'lab' && (
                <>
                  <div style={{
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '1.5rem',
                    marginTop: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <FlaskConical size={18} color="#7c3aed" />
                      Laboratory Information
                    </h4>
                  </div>

                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Laboratory Name"
                      value={formData.labName}
                      onChange={(e) => handleInputChange('labName', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="input-group">
                      <select
                        value={formData.accreditation}
                        onChange={(e) => handleInputChange('accreditation', e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">Accreditation</option>
                        <option value="iso-17025">ISO/IEC 17025</option>
                        <option value="nabl">NABL</option>
                        <option value="cap">CAP</option>
                        <option value="clia">CLIA</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <select
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">Specialization</option>
                        <option value="herbal-analysis">Herbal Analysis</option>
                        <option value="contaminant-testing">Contaminant Testing</option>
                        <option value="quality-control">Quality Control</option>
                        <option value="research-development">Research & Development</option>
                        <option value="all">All Services</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {selectedRole === 'collector' && (
                <>
                  <div style={{
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '1.5rem',
                    marginTop: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Smartphone size={18} color="#059669" />
                      Collector Information
                    </h4>
                  </div>

                  <div className="input-group">
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6b7280'
                      }} />
                      <input
                        type="text"
                        placeholder="Primary Collection Location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="input-group">
                      <select
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="input-field"
                        required
                      >
                        <option value="">Experience Level</option>
                        <option value="beginner">Beginner (0-1 years)</option>
                        <option value="intermediate">Intermediate (2-5 years)</option>
                        <option value="experienced">Experienced (5-10 years)</option>
                        <option value="expert">Expert (10+ years)</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Preferred Herbs (comma separated)"
                        value={formData.preferredHerbs}
                        onChange={(e) => handleInputChange('preferredHerbs', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                </>
              )}

              <div style={{
                borderTop: '1px solid #f3f4f6',
                paddingTop: '1.5rem',
                marginTop: '1.5rem'
              }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    backgroundColor: isLoading ? '#9ca3af' : roleOptions.find(r => r.id === selectedRole)?.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.875rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#059669',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Sign in
                    </button>
                    {' '}or{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('role-selection')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#059669',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      choose different role
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        )}

        {authMode === 'login-role-selection' && (
          <div style={{
            width: '100%',
            maxWidth: '1200px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontFamily: 'Playfair Display, serif',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '1rem'
              }}>
                Select Your Role
              </h2>
              <p style={{
                color: '#6b7280',
                fontSize: '1.125rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Choose your role to access your dashboard
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {roleOptions.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.id}
                    className="role-card"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setFormData(prev => ({ ...prev, role: role.id }));
                      setAuthMode('login');
                    }}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '2rem',
                      border: '1px solid #f3f4f6',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '80px',
                      height: '80px',
                      backgroundColor: role.color + '15',
                      borderRadius: '20px',
                      marginBottom: '1.5rem'
                    }}>
                      <Icon size={40} color={role.color} />
                    </div>

                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '1rem'
                    }}>
                      {role.title}
                    </h3>

                    <p style={{
                      color: '#6b7280',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem'
                    }}>
                      {role.description}
                    </p>

                    <button style={{
                      width: '100%',
                      backgroundColor: role.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.875rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      Log In as {role.title}
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('role-selection')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#059669',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
