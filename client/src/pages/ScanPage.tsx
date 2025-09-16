import React, { useState, useRef } from 'react';
import {
  QrCode,
  Camera,
  Upload,
  CheckCircle,
  MapPin,
  Calendar,
  User,
  Building2,
  FlaskConical,
  Leaf,
  Shield,
  AlertCircle,
  Search,
  Download,
  Share2
} from 'lucide-react';

interface BatchData {
  batchId: string;
  herbName: string;
  scientificName: string;
  collectorName: string;
  collectionDate: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  quantity: number;
  unit: string;
  price: number;
  rarity: string;
  category: string;
  qualityScore: number;
  labResults: {
    tested: boolean;
    purity: number;
    contaminants: string[];
    certifiedBy: string;
    testDate: string;
  };
  enterprise: {
    name: string;
    verified: boolean;
  };
  blockchainHash: string;
  status: 'verified' | 'pending' | 'rejected';
}

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<BatchData | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock batch data for demonstration
  const mockBatchData: BatchData = {
    batchId: 'TR240916001',
    herbName: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    collectorName: 'Rajesh Kumar',
    collectionDate: '2024-09-15',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Uttarakhand, India'
    },
    quantity: 2.5,
    unit: 'kg',
    price: 25,
    rarity: 'Uncommon',
    category: 'Adaptogen',
    qualityScore: 96,
    labResults: {
      tested: true,
      purity: 98.5,
      contaminants: [],
      certifiedBy: 'AyurLab Certified',
      testDate: '2024-09-16'
    },
    enterprise: {
      name: 'Himalayan Herbs Co.',
      verified: true
    },
    blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
    status: 'verified'
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setError('');

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions or use manual input.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const simulateScan = () => {
    setIsLoading(true);
    setTimeout(() => {
      setScannedData(mockBatchData);
      setIsLoading(false);
      stopCamera();
    }, 2000);
  };
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (manualCode.toLowerCase().includes('tr') || manualCode.length > 6) {
        setScannedData(mockBatchData);
      } else {
        setError('Invalid batch code. Please check and try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    // Simulate QR code detection from image
    setTimeout(() => {
      setScannedData(mockBatchData);
      setIsLoading(false);
    }, 2000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' };
      case 'Uncommon': return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
      case 'Rare': return { bg: '#fdf2f8', text: '#be185d', border: '#f9a8d4' };
      case 'Very Rare': return { bg: '#f3e8ff', text: '#7c3aed', border: '#c4b5fd' };
      case 'Legendary': return { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' };
      default: return { bg: '#f9fafb', text: '#6b7280', border: '#d1d5db' };
    }
  };

  const resetScan = () => {
    setScannedData(null);
    setManualCode('');
    setError('');
    setIsLoading(false);
    stopCamera();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f3f4f6',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontFamily: 'Playfair Display, serif',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0
            }}>
              QR Code Scanner
            </h1>
          </div>

          <div style={{
            backgroundColor: '#fef2f2',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <QrCode size={16} color="#dc2626" />
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626' }}>
              Scan Mode
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {!scannedData ? (
            <>
              {/* Hero Section */}
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{
                  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em'
                }}>
                  Verify Herb Authenticity
                </h2>

                <p style={{
                  fontSize: '1.125rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  maxWidth: '600px',
                  margin: '0 auto 2rem auto'
                }}>
                  Scan the QR code on your herb package to view complete traceability information,
                  from collection to your hands.
                </p>
              </div>

              {/* Scanning Options */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem'
              }}>

                {/* Camera Scan */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '50%',
                    marginBottom: '1.5rem'
                  }}>
                    <Camera size={32} color="#dc2626" />
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '1rem'
                  }}>
                    Camera Scan
                  </h3>

                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5'
                  }}>
                    Use your device camera to scan QR codes directly
                  </p>

                  {!isScanning ? (
                    <button
                      onClick={startCamera}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        margin: '0 auto'
                      }}
                    >
                      <Camera size={16} />
                      Start Camera
                    </button>
                  ) : (
                    <div>
                      <video
                        ref={videoRef}
                        style={{
                          width: '100%',
                          maxWidth: '300px',
                          borderRadius: '8px',
                          marginBottom: '1rem'
                        }}
                        autoPlay
                        playsInline
                      />
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={simulateScan}
                          style={{
                            backgroundColor: '#059669',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Simulate Scan
                        </button>
                        <button
                          onClick={stopCamera}
                          style={{
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Stop
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manual Input */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '50%',
                    marginBottom: '1.5rem'
                  }}>
                    <Search size={32} color="#059669" />
                  </div>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '1rem'
                  }}>
                    Manual Entry
                  </h3>

                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5'
                  }}>
                    Enter the batch code manually if you can't scan
                  </p>

                  <form onSubmit={handleManualSubmit}>
                    <input
                      type="text"
                      placeholder="Enter batch code (e.g., TR240916001)"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        marginBottom: '1rem',
                        textAlign: 'center'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!manualCode.trim() || isLoading}
                      style={{
                        backgroundColor: manualCode.trim() ? '#059669' : '#e5e7eb',
                        color: manualCode.trim() ? 'white' : '#9ca3af',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: manualCode.trim() ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        margin: '0 auto'
                      }}
                    >
                      <Search size={16} />
                      {isLoading ? 'Searching...' : 'Search'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Upload Image Option */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #f3f4f6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '1rem'
                }}>
                  Upload QR Code Image
                </h3>

                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '1.5rem'
                }}>
                  Have a photo of the QR code? Upload it here for scanning
                </p>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '12px',
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#7c3aed';
                    e.currentTarget.style.backgroundColor = '#f3e8ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Upload size={32} color="#7c3aed" style={{ margin: '0 auto 1rem auto' }} />
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#7c3aed',
                    fontWeight: '500'
                  }}>
                    Click to upload QR code image
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Error Display */}
              {error && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '2rem'
                }}>
                  <AlertCircle size={20} color="#dc2626" />
                  <span style={{ fontSize: '0.875rem', color: '#dc2626' }}>
                    {error}
                  </span>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    border: '2px solid #059669',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '0.5rem'
                  }} />
                  <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                    Processing QR code...
                  </span>
                </div>
              )}
            </>
          ) : (
            /* Results Display */
            <div>
              {/* Success Header */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #f3f4f6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '50%',
                  marginBottom: '1.5rem'
                }}>
                  <CheckCircle size={40} color="#059669" />
                </div>

                <h2 style={{
                  fontSize: '1.75rem',
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '0.5rem'
                }}>
                  Herb Verified Successfully!
                </h2>

                <p style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  marginBottom: '1.5rem'
                }}>
                  Complete traceability information found
                </p>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#f0fdf4',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <Shield size={16} color="#059669" />
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>
                    {scannedData.status === 'verified' ? 'Verified Authentic' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              {/* Herb Information */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #f3f4f6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '12px'
                  }}>
                    <Leaf size={24} color="#92400e" />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '0.25rem'
                    }}>
                      {scannedData.herbName}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      fontStyle: 'italic'
                    }}>
                      {scannedData.scientificName}
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      BATCH ID
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', fontFamily: 'monospace' }}>
                      {scannedData.batchId}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      QUANTITY
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      {scannedData.quantity} {scannedData.unit}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      RARITY
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: getRarityColor(scannedData.rarity).text,
                      backgroundColor: getRarityColor(scannedData.rarity).bg,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      border: `1px solid ${getRarityColor(scannedData.rarity).border}`,
                      display: 'inline-block'
                    }}>
                      {scannedData.rarity}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      QUALITY SCORE
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: scannedData.qualityScore >= 95 ? '#059669' : scannedData.qualityScore >= 85 ? '#d97706' : '#dc2626'
                    }}>
                      {scannedData.qualityScore}/100
                    </div>
                  </div>
                </div>
              </div>

              {/* Collector & Enterprise Info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                {/* Collector Info */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <User size={20} color="#7c3aed" />
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: 0
                    }}>
                      Collector Information
                    </h3>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      COLLECTOR NAME
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      {scannedData.collectorName}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      COLLECTION DATE
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} color="#6b7280" />
                      {new Date(scannedData.collectionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      LOCATION
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} color="#6b7280" />
                      {scannedData.location.address}
                    </div>
                  </div>
                </div>

                {/* Enterprise Info */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Building2 size={20} color="#059669" />
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: 0
                    }}>
                      Enterprise Details
                    </h3>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      COMPANY NAME
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {scannedData.enterprise.name}
                      {scannedData.enterprise.verified && (
                        <div style={{
                          backgroundColor: '#f0fdf4',
                          color: '#059669',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          border: '1px solid #bbf7d0'
                        }}>
                          Verified
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      PRICE PER KG
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '14px',
                        height: '14px',
                        backgroundColor: '#059669',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.625rem',
                        color: 'white',
                        fontWeight: '700'
                      }}>
                        A
                      </span>
                      {scannedData.price} ALGO (~${(scannedData.price * 0.15).toFixed(2)})
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      BLOCKCHAIN HASH
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#6b7280',
                      fontFamily: 'monospace',
                      backgroundColor: '#f8fafc',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      wordBreak: 'break-all'
                    }}>
                      {scannedData.blockchainHash}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lab Results */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid #f3f4f6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <FlaskConical size={20} color="#dc2626" />
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: 0
                  }}>
                    Laboratory Analysis
                  </h3>
                  {scannedData.labResults.tested && (
                    <div style={{
                      backgroundColor: '#f0fdf4',
                      color: '#059669',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '1px solid #bbf7d0'
                    }}>
                      Lab Tested
                    </div>
                  )}
                </div>

                {scannedData.labResults.tested ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        PURITY LEVEL
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#059669' }}>
                        {scannedData.labResults.purity}%
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        CONTAMINANTS
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: scannedData.labResults.contaminants.length === 0 ? '#059669' : '#dc2626' }}>
                        {scannedData.labResults.contaminants.length === 0 ? 'None Detected' : `${scannedData.labResults.contaminants.length} Found`}
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        CERTIFIED BY
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                        {scannedData.labResults.certifiedBy}
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        TEST DATE
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                        {new Date(scannedData.labResults.testDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fcd34d',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <AlertCircle size={24} color="#92400e" style={{ margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '500' }}>
                      Lab testing pending
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginBottom: '2rem'
              }}>
                <button
                  onClick={resetScan}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <QrCode size={16} />
                  Scan Another
                </button>

                <button
                  onClick={() => {
                    const data = `Batch: ${scannedData.batchId}\nHerb: ${scannedData.herbName}\nCollector: ${scannedData.collectorName}\nQuality: ${scannedData.qualityScore}/100`;
                    navigator.clipboard.writeText(data);
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Share2 size={16} />
                  Share Info
                </button>

                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(scannedData, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${scannedData.batchId}_report.json`;
                    link.click();
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Download size={16} />
                  Download Report
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScanPage;
