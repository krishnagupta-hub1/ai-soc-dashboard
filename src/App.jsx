import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import LogManagement from './pages/LogManagement';
import AnomalyDetection from './pages/AnomalyDetection';
import AlertManagement from './pages/AlertManagement';
import AlertTriage from './pages/AlertTriage';
import ThreatIntelligence from './pages/ThreatIntelligence';
import RootCauseAnalysis from './pages/RootCauseAnalysis';
import Recommendations from './pages/Recommendations';
import IncidentReports from './pages/IncidentReports';
import SystemAdmin from './pages/SystemAdmin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="logs" element={<LogManagement />} />
          <Route path="anomalies" element={<AnomalyDetection />} />
          <Route path="alerts" element={<AlertManagement />} />
          <Route path="triage" element={<AlertTriage />} />
          <Route path="threat-intel" element={<ThreatIntelligence />} />
          <Route path="rca" element={<RootCauseAnalysis />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="reports" element={<IncidentReports />} />
          <Route path="admin" element={<SystemAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
