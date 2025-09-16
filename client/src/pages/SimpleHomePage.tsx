import { Link } from 'react-router-dom';

const SimpleHomePage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#059669' }}>
        🌿 TrueRoots
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#6b7280' }}>
        Blockchain-based Ayurvedic Herb Traceability Platform
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/collector" style={{ textDecoration: 'none' }}>
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            transition: 'transform 0.2s'
          }}>
            <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>📱 Herb Collectors</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Upload herb photos and GPS location</p>
          </div>
        </Link>
        
        <Link to="/enterprise" style={{ textDecoration: 'none' }}>
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            transition: 'transform 0.2s'
          }}>
            <h3 style={{ color: '#d97706', marginBottom: '0.5rem' }}>🏢 Enterprises</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Track batches and manage supply chain</p>
          </div>
        </Link>
        
        <Link to="/lab" style={{ textDecoration: 'none' }}>
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            transition: 'transform 0.2s'
          }}>
            <h3 style={{ color: '#7c3aed', marginBottom: '0.5rem' }}>🧪 Testing Labs</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Upload test results and certificates</p>
          </div>
        </Link>
        
        <Link to="/scan" style={{ textDecoration: 'none' }}>
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.75rem', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            transition: 'transform 0.2s'
          }}>
            <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>📱 Consumers</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Scan QR codes for herb provenance</p>
          </div>
        </Link>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#374151' }}>
          Demo Batch IDs
        </h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/provenance/TR001234" style={{ 
            background: '#059669', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.5rem', 
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            TR001234 (Ashwagandha)
          </Link>
          <Link to="/provenance/TR001235" style={{ 
            background: '#d97706', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.5rem', 
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            TR001235 (Turmeric)
          </Link>
          <Link to="/provenance/TR001236" style={{ 
            background: '#7c3aed', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '0.5rem', 
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            TR001236 (Brahmi)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimpleHomePage;
