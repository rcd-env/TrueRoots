
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CollectorPage from './pages/CollectorPage';
import ScanPage from './pages/ScanPage';
import EnterprisePage from './pages/EnterprisePage';
import LabPage from './pages/LabPage';
import AuthPage from './pages/AuthPage';
import ProvenancePage from './pages/ProvenancePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/collector" element={<CollectorPage />} />
        <Route path="/enterprise" element={<EnterprisePage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        <Route path="/provenance/:batchId" element={<ProvenancePage />} />
      </Routes>
    </Router>
  );
}

export default App;
