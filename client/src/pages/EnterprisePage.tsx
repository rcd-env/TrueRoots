import { useState } from 'react';
import {
  Building2,
  Package,
  TrendingUp,
  Users,
  Shield,
  Clock,
  MapPin,
  Search,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart3,
  Globe,
  Star,
  Award,
  Truck
} from 'lucide-react';

interface BatchData {
  id: string;
  herbName: string;
  scientificName: string;
  collectorName: string;
  collectionDate: string;
  location: string;
  quantity: number;
  unit: string;
  price: number;
  status: 'verified' | 'pending' | 'rejected' | 'shipped' | 'delivered';
  qualityScore: number;
  rarity: string;
  labTested: boolean;
  enterprise: string;
  destination: string;
  estimatedDelivery?: string;
}

const EnterprisePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Export functionality
  const exportBatchData = () => {
    const csvContent = [
      ['Batch ID', 'Herb Name', 'Scientific Name', 'Collector', 'Date', 'Location', 'Quantity', 'Unit', 'Price (ALGO)', 'Status', 'Quality Score', 'Rarity', 'Lab Tested', 'Enterprise', 'Destination'].join(','),
      ...filteredBatches.map(batch => [
        batch.id,
        batch.herbName,
        batch.scientificName,
        batch.collectorName,
        batch.collectionDate,
        batch.location,
        batch.quantity,
        batch.unit,
        batch.price,
        batch.status,
        batch.qualityScore,
        batch.rarity,
        batch.labTested ? 'Yes' : 'No',
        batch.enterprise,
        batch.destination
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `enterprise_batches_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View batch details
  const viewBatchDetails = (batch: BatchData) => {
    setSelectedBatch(batch);
    setShowBatchModal(true);
  };

  // Mock enterprise data
  const enterpriseStats = {
    totalBatches: 1247,
    activeBatches: 89,
    totalRevenue: 45680,
    qualityScore: 94.2,
    verifiedSuppliers: 156,
    pendingOrders: 23
  };

  const recentBatches: BatchData[] = [
    {
      id: 'TR240916001',
      herbName: 'Ashwagandha',
      scientificName: 'Withania somnifera',
      collectorName: 'Rajesh Kumar',
      collectionDate: '2024-09-15',
      location: 'Uttarakhand, India',
      quantity: 2.5,
      unit: 'kg',
      price: 25,
      status: 'verified',
      qualityScore: 96,
      rarity: 'Uncommon',
      labTested: true,
      enterprise: 'Himalayan Herbs Co.',
      destination: 'Mumbai, India'
    },
    {
      id: 'TR240916002',
      herbName: 'Turmeric',
      scientificName: 'Curcuma longa',
      collectorName: 'Priya Sharma',
      collectionDate: '2024-09-14',
      location: 'Kerala, India',
      quantity: 5.0,
      unit: 'kg',
      price: 8,
      status: 'shipped',
      qualityScore: 92,
      rarity: 'Common',
      labTested: true,
      enterprise: 'Spice Masters Ltd.',
      destination: 'Delhi, India',
      estimatedDelivery: '2024-09-18'
    },
    {
      id: 'TR240916003',
      herbName: 'Brahmi',
      scientificName: 'Bacopa monnieri',
      collectorName: 'Amit Patel',
      collectionDate: '2024-09-13',
      location: 'Gujarat, India',
      quantity: 1.8,
      unit: 'kg',
      price: 30,
      status: 'pending',
      qualityScore: 88,
      rarity: 'Uncommon',
      labTested: false,
      enterprise: 'Ayur Wellness Corp.',
      destination: 'Bangalore, India'
    },
    {
      id: 'TR240916004',
      herbName: 'Shatavari',
      scientificName: 'Asparagus racemosus',
      collectorName: 'Sunita Devi',
      collectionDate: '2024-09-12',
      location: 'Rajasthan, India',
      quantity: 3.2,
      unit: 'kg',
      price: 45,
      status: 'delivered',
      qualityScore: 98,
      rarity: 'Rare',
      labTested: true,
      enterprise: 'Premium Botanicals',
      destination: 'Chennai, India'
    },
    {
      id: 'TR240916005',
      herbName: 'Neem',
      scientificName: 'Azadirachta indica',
      collectorName: 'Ravi Singh',
      collectionDate: '2024-09-11',
      location: 'Madhya Pradesh, India',
      quantity: 4.5,
      unit: 'kg',
      price: 10,
      status: 'rejected',
      qualityScore: 72,
      rarity: 'Common',
      labTested: true,
      enterprise: 'Green Earth Solutions',
      destination: 'Pune, India'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' };
      case 'pending': return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
      case 'rejected': return { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' };
      case 'shipped': return { bg: '#f0f9ff', text: '#1e40af', border: '#93c5fd' };
      case 'delivered': return { bg: '#f3e8ff', text: '#7c3aed', border: '#c4b5fd' };
      default: return { bg: '#f9fafb', text: '#6b7280', border: '#d1d5db' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'rejected': return <XCircle size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'delivered': return <Award size={14} />;
      default: return <AlertTriangle size={14} />;
    }
  };

  const filteredBatches = recentBatches.filter(batch => {
    const matchesSearch = batch.herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.collectorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontFamily: 'Playfair Display, serif',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0
            }}>
              Enterprise Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              backgroundColor: '#fef3c7',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Building2 size={16} color="#d97706" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#d97706' }}>
                Enterprise Portal
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to log out?')) {
                  window.location.href = '/';
                }
              }}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f3f4f6',
        padding: '0 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'batches', label: 'Batch Management', icon: Package },
              { id: 'suppliers', label: 'Suppliers', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 0',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: activeTab === tab.id ? '#d97706' : '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid #d97706' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Overview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#fef3c7',
                      borderRadius: '12px'
                    }}>
                      <Package size={24} color="#d97706" />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                      TOTAL BATCHES
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                    {enterpriseStats.totalBatches.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                    +12% from last month
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '12px'
                    }}>
                      <TrendingUp size={24} color="#059669" />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                      REVENUE (ALGO)
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#059669',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      color: 'white',
                      fontWeight: '700'
                    }}>
                      A
                    </span>
                    {enterpriseStats.totalRevenue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                    +8% from last month
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#fef2f2',
                      borderRadius: '12px'
                    }}>
                      <Star size={24} color="#dc2626" />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                      QUALITY SCORE
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                    {enterpriseStats.qualityScore}%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                    +2.1% from last month
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'batches' && (
            <>
              {/* Search and Filter */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #f3f4f6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
                    <Search size={20} color="#6b7280" style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }} />
                    <input
                      type="text"
                      placeholder="Search batches, herbs, or collectors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <button
                    onClick={exportBatchData}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#d97706',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#b45309';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#d97706';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Batch Table */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: '#f8fafc'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: 0
                  }}>
                    Recent Batches ({filteredBatches.length})
                  </h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Batch ID
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Herb
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Collector
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Quantity
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Status
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Quality
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Price
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBatches.map((batch, index) => (
                        <tr key={batch.id} style={{
                          borderBottom: index < filteredBatches.length - 1 ? '1px solid #f3f4f6' : 'none'
                        }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', fontFamily: 'monospace' }}>
                              {batch.id}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {new Date(batch.collectionDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                              {batch.herbName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                              {batch.scientificName}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1a1a1a' }}>
                              {batch.collectorName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={12} />
                              {batch.location}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                              {batch.quantity} {batch.unit}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              backgroundColor: getStatusColor(batch.status).bg,
                              color: getStatusColor(batch.status).text,
                              border: `1px solid ${getStatusColor(batch.status).border}`
                            }}>
                              {getStatusIcon(batch.status)}
                              {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: batch.qualityScore >= 95 ? '#059669' : batch.qualityScore >= 85 ? '#d97706' : '#dc2626'
                            }}>
                              {batch.qualityScore}%
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#059669',
                                borderRadius: '50%',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.5rem',
                                color: 'white',
                                fontWeight: '700'
                              }}>
                                A
                              </span>
                              {batch.price}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <button
                              onClick={() => viewBatchDetails(batch)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.5rem',
                                backgroundColor: 'transparent',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f3f4f6';
                                e.currentTarget.style.borderColor = '#9ca3af';
                                e.currentTarget.style.color = '#374151';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.color = '#6b7280';
                              }}
                            >
                              <Eye size={14} />
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'suppliers' && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '3rem',
              border: '1px solid #f3f4f6',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <Users size={48} color="#d97706" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                Supplier Management
              </h3>
              <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
                Manage your network of verified herb collectors and suppliers
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706', marginBottom: '0.5rem' }}>
                    {enterpriseStats.verifiedSuppliers}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Verified Suppliers
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669', marginBottom: '0.5rem' }}>
                    4.8
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Average Rating
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#7c3aed', marginBottom: '0.5rem' }}>
                    {enterpriseStats.activeBatches}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Active Collections
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '3rem',
              border: '1px solid #f3f4f6',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <BarChart3 size={48} color="#7c3aed" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                Advanced Analytics
              </h3>
              <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
                Comprehensive insights into your supply chain performance
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginTop: '2rem'
              }}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <TrendingUp size={20} color="#059669" />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      Revenue Growth
                    </span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669', marginBottom: '0.25rem' }}>
                    +24.5%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Compared to last quarter
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Shield size={20} color="#d97706" />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      Quality Improvement
                    </span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#d97706', marginBottom: '0.25rem' }}>
                    +12.3%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Average quality score increase
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Globe size={20} color="#7c3aed" />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                      Market Expansion
                    </span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7c3aed', marginBottom: '0.25rem' }}>
                    8 Regions
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    New markets entered
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Batch Details Modal */}
      {showBatchModal && selectedBatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                Batch Details
              </h3>
              <button
                onClick={() => setShowBatchModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Batch ID
                  </label>
                  <div style={{ fontSize: '0.875rem', color: '#1a1a1a', fontFamily: 'monospace', backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '6px' }}>
                    {selectedBatch.id}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Status
                  </label>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: selectedBatch.status === 'verified' ? '#f0fdf4' :
                                   selectedBatch.status === 'pending' ? '#fef3c7' :
                                   selectedBatch.status === 'shipped' ? '#eff6ff' :
                                   selectedBatch.status === 'delivered' ? '#f0f9ff' : '#fef2f2',
                    color: selectedBatch.status === 'verified' ? '#166534' :
                           selectedBatch.status === 'pending' ? '#92400e' :
                           selectedBatch.status === 'shipped' ? '#1e40af' :
                           selectedBatch.status === 'delivered' ? '#0369a1' : '#dc2626'
                  }}>
                    {selectedBatch.status.charAt(0).toUpperCase() + selectedBatch.status.slice(1)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Herb Name
                  </label>
                  <div style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                    {selectedBatch.herbName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                    {selectedBatch.scientificName}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Quality Score
                  </label>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: selectedBatch.qualityScore >= 95 ? '#059669' : selectedBatch.qualityScore >= 85 ? '#d97706' : '#dc2626' }}>
                    {selectedBatch.qualityScore}%
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Collector
                  </label>
                  <div style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                    {selectedBatch.collectorName}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Collection Date
                  </label>
                  <div style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                    {selectedBatch.collectionDate}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                  Location
                </label>
                <div style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                  {selectedBatch.location}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Quantity
                  </label>
                  <div style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                    {selectedBatch.quantity} {selectedBatch.unit}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Price
                  </label>
                  <div style={{ fontSize: '0.875rem', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontWeight: '700' }}>A</span>
                    {selectedBatch.price}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Rarity
                  </label>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: selectedBatch.rarity === 'Common' ? '#f0fdf4' :
                                   selectedBatch.rarity === 'Uncommon' ? '#fef3c7' :
                                   selectedBatch.rarity === 'Rare' ? '#fdf2f8' :
                                   selectedBatch.rarity === 'Very Rare' ? '#f3e8ff' : '#fef2f2',
                    color: selectedBatch.rarity === 'Common' ? '#166534' :
                           selectedBatch.rarity === 'Uncommon' ? '#92400e' :
                           selectedBatch.rarity === 'Rare' ? '#be185d' :
                           selectedBatch.rarity === 'Very Rare' ? '#7c3aed' : '#dc2626'
                  }}>
                    {selectedBatch.rarity}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Enterprise
                  </label>
                  <div style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                    {selectedBatch.enterprise}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Lab Tested
                  </label>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    color: selectedBatch.labTested ? '#059669' : '#dc2626'
                  }}>
                    {selectedBatch.labTested ? '✓ Yes' : '✗ No'}
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                  Destination
                </label>
                <div style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                  {selectedBatch.destination}
                </div>
              </div>

              {selectedBatch.estimatedDelivery && (
                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>
                    Estimated Delivery
                  </label>
                  <div style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                    {selectedBatch.estimatedDelivery}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowBatchModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterprisePage;
