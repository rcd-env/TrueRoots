import { useState } from 'react';
import {
  FlaskConical,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Search,
  Download,
  Eye,
  Calendar,
  Award,
  BarChart3,
  Microscope,
  AlertCircle,
  Star
} from 'lucide-react';

interface TestResult {
  id: string;
  batchId: string;
  herbName: string;
  scientificName: string;
  testType: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  submissionDate: string;
  completionDate?: string;
  labTechnician: string;
  qualityScore: number;
  purityLevel: number;
  contaminants: string[];
  certificationLevel: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Failed';
  notes?: string;
}

const LabPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Export test results functionality
  const exportTestResults = () => {
    const csvContent = [
      ['Test ID', 'Batch ID', 'Herb Name', 'Test Type', 'Status', 'Quality Score', 'Purity Level', 'Certification', 'Technician', 'Date', 'Contaminants', 'Notes'].join(','),
      ...filteredResults.map(result => [
        result.id,
        result.batchId,
        result.herbName,
        result.testType,
        result.status,
        result.qualityScore,
        result.purityLevel,
        result.certificationLevel,
        result.labTechnician,
        result.completionDate || result.submissionDate,
        result.contaminants.join('; '),
        result.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lab_test_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // File upload functionality
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setShowUploadModal(true);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processUpload = () => {
    // Simulate file processing
    alert(`Successfully uploaded ${uploadedFiles.length} file(s) to the lab system!`);
    setUploadedFiles([]);
    setShowUploadModal(false);
  };

  // Mock lab statistics
  const labStats = {
    totalTests: 892,
    pendingTests: 23,
    completedTests: 847,
    averageQuality: 91.5,
    certifiedBatches: 789,
    activeTechnicians: 12
  };

  // Mock test results data
  const testResults: TestResult[] = [
    {
      id: 'LAB240916001',
      batchId: 'TR240916001',
      herbName: 'Ashwagandha',
      scientificName: 'Withania somnifera',
      testType: 'Complete Analysis',
      status: 'completed',
      submissionDate: '2024-09-15',
      completionDate: '2024-09-16',
      labTechnician: 'Dr. Sarah Chen',
      qualityScore: 96,
      purityLevel: 98.5,
      contaminants: [],
      certificationLevel: 'A+',
      notes: 'Exceptional quality, no contaminants detected'
    },
    {
      id: 'LAB240916002',
      batchId: 'TR240916002',
      herbName: 'Turmeric',
      scientificName: 'Curcuma longa',
      testType: 'Purity Test',
      status: 'in-progress',
      submissionDate: '2024-09-14',
      labTechnician: 'Dr. Raj Patel',
      qualityScore: 0,
      purityLevel: 0,
      contaminants: [],
      certificationLevel: 'A',
      notes: 'Testing in progress'
    },
    {
      id: 'LAB240916003',
      batchId: 'TR240916003',
      herbName: 'Brahmi',
      scientificName: 'Bacopa monnieri',
      testType: 'Contamination Screen',
      status: 'pending',
      submissionDate: '2024-09-13',
      labTechnician: 'Dr. Maria Rodriguez',
      qualityScore: 0,
      purityLevel: 0,
      contaminants: [],
      certificationLevel: 'A',
      notes: 'Awaiting lab processing'
    },
    {
      id: 'LAB240916004',
      batchId: 'TR240916004',
      herbName: 'Shatavari',
      scientificName: 'Asparagus racemosus',
      testType: 'Complete Analysis',
      status: 'completed',
      submissionDate: '2024-09-12',
      completionDate: '2024-09-13',
      labTechnician: 'Dr. James Wilson',
      qualityScore: 98,
      purityLevel: 99.2,
      contaminants: [],
      certificationLevel: 'A+',
      notes: 'Outstanding quality, premium grade'
    },
    {
      id: 'LAB240916005',
      batchId: 'TR240916005',
      herbName: 'Neem',
      scientificName: 'Azadirachta indica',
      testType: 'Quality Assessment',
      status: 'failed',
      submissionDate: '2024-09-11',
      completionDate: '2024-09-12',
      labTechnician: 'Dr. Lisa Thompson',
      qualityScore: 72,
      purityLevel: 85.3,
      contaminants: ['Heavy metals', 'Pesticide residue'],
      certificationLevel: 'Failed',
      notes: 'Failed due to contamination, batch rejected'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' };
      case 'in-progress': return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
      case 'pending': return { bg: '#f0f9ff', text: '#1e40af', border: '#93c5fd' };
      case 'failed': return { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5' };
      default: return { bg: '#f9fafb', text: '#6b7280', border: '#d1d5db' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} />;
      case 'in-progress': return <Clock size={14} />;
      case 'pending': return <AlertTriangle size={14} />;
      case 'failed': return <XCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const getCertificationColor = (level: string) => {
    switch (level) {
      case 'A+': return '#059669';
      case 'A': return '#16a34a';
      case 'B+': return '#d97706';
      case 'B': return '#ea580c';
      case 'C': return '#dc2626';
      case 'Failed': return '#991b1b';
      default: return '#6b7280';
    }
  };

  const filteredResults = testResults.filter(result => {
    const matchesSearch = result.herbName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
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
              Lab Partners Portal
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              backgroundColor: '#f3e8ff',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FlaskConical size={16} color="#7c3aed" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#7c3aed' }}>
                Lab Portal
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
              { id: 'tests', label: 'Test Results', icon: Microscope },
              { id: 'upload', label: 'Upload Results', icon: Upload },
              { id: 'certificates', label: 'Certificates', icon: Award }
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
                  color: activeTab === tab.id ? '#7c3aed' : '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '2px solid #7c3aed' : '2px solid transparent',
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
                      backgroundColor: '#f3e8ff',
                      borderRadius: '12px'
                    }}>
                      <Microscope size={24} color="#7c3aed" />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                      TOTAL TESTS
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                    {labStats.totalTests.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                    +15% from last month
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
                      backgroundColor: '#fef3c7',
                      borderRadius: '12px'
                    }}>
                      <Clock size={24} color="#d97706" />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                      PENDING TESTS
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                    {labStats.pendingTests}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#d97706', fontWeight: '500' }}>
                    Awaiting processing
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
                      <Star size={24} color="#059669" />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                      AVG QUALITY
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                    {labStats.averageQuality}%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                    +3.2% improvement
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'tests' && (
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
                      placeholder="Search tests, batches, or herbs..."
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
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>

                  <button
                    onClick={exportTestResults}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#6d28d9';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#7c3aed';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Test Results Table */}
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
                    Test Results ({filteredResults.length})
                  </h3>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Test ID
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Herb
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Test Type
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Status
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Quality
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Certification
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Technician
                        </th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((result, index) => (
                        <tr key={result.id} style={{
                          borderBottom: index < filteredResults.length - 1 ? '1px solid #f3f4f6' : 'none'
                        }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', fontFamily: 'monospace' }}>
                              {result.id}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Batch: {result.batchId}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                              {result.herbName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                              {result.scientificName}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1a1a1a' }}>
                              {result.testType}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Calendar size={12} />
                              {new Date(result.submissionDate).toLocaleDateString()}
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
                              backgroundColor: getStatusColor(result.status).bg,
                              color: getStatusColor(result.status).text,
                              border: `1px solid ${getStatusColor(result.status).border}`
                            }}>
                              {getStatusIcon(result.status)}
                              {result.status.charAt(0).toUpperCase() + result.status.slice(1).replace('-', ' ')}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              color: result.qualityScore >= 95 ? '#059669' : result.qualityScore >= 85 ? '#d97706' : '#dc2626'
                            }}>
                              {result.status === 'completed' ? `${result.qualityScore}%` : '-'}
                            </div>
                            {result.status === 'completed' && (
                              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                Purity: {result.purityLevel}%
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: '700',
                              color: getCertificationColor(result.certificationLevel)
                            }}>
                              {result.status === 'completed' ? result.certificationLevel : '-'}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1a1a1a' }}>
                              {result.labTechnician}
                            </div>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <button style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.5rem',
                              backgroundColor: 'transparent',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              cursor: 'pointer'
                            }}>
                              <Eye size={14} />
                              View
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

          {activeTab === 'upload' && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '3rem',
              border: '1px solid #f3f4f6',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <Upload size={48} color="#7c3aed" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                Upload Test Results
              </h3>
              <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
                Upload lab test results and certificates for herb batches
              </p>
              <div style={{ position: 'relative' }}>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.csv,.xlsx"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#6d28d9';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#7c3aed';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Upload size={16} />
                  Choose Files
                </label>
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '3rem',
              border: '1px solid #f3f4f6',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <Award size={48} color="#d97706" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '0.5rem'
              }}>
                Quality Certificates
              </h3>
              <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
                Manage and download quality certificates for tested batches
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
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#7c3aed', marginBottom: '0.5rem' }}>
                    {labStats.certifiedBatches}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Certified Batches
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669', marginBottom: '0.5rem' }}>
                    A+
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Average Grade
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706', marginBottom: '0.5rem' }}>
                    {labStats.activeTechnicians}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Lab Technicians
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
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
                Upload Test Results
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
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

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem' }}>
                Selected Files ({uploadedFiles.length})
              </h4>

              {uploadedFiles.length === 0 ? (
                <div style={{
                  padding: '2rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '2px dashed #d1d5db',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  No files selected
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a' }}>
                          {file.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        style={{
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #bae6fd',
              marginBottom: '1.5rem'
            }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
                Supported File Types:
              </h5>
              <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0 }}>
                PDF, DOC, DOCX, JPG, JPEG, PNG, CSV, XLSX
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowUploadModal(false)}
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
                Cancel
              </button>
              <button
                onClick={processUpload}
                disabled={uploadedFiles.length === 0}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: uploadedFiles.length > 0 ? '#7c3aed' : '#e5e7eb',
                  color: uploadedFiles.length > 0 ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: uploadedFiles.length > 0 ? 'pointer' : 'not-allowed'
                }}
              >
                Upload {uploadedFiles.length} File{uploadedFiles.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabPage;
