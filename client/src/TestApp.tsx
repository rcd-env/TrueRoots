const TestApp = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#059669', fontSize: '2rem', marginBottom: '1rem' }}>
        🌿 TrueRoots Test Page
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#374151' }}>
        If you can see this, React is working!
      </p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1rem', 
        borderRadius: '8px',
        marginTop: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#d97706' }}>Test Status: ✅ SUCCESS</h2>
        <p>React components are rendering correctly.</p>
      </div>
    </div>
  );
};

export default TestApp;
